'use server'

import { db } from '@/lib/db';
import { invoices, invoiceItems, users } from '@/lib/db/schema';
import { eq, desc, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { recordActivity } from './activity';
import { createNotification } from './notifications';
import { resend } from '@/lib/resend';
import { getCompanySettings } from './financeEnhancements';
import { calculateNextDueDate } from './recurringInvoices';

export async function getInvoices(clientId?: string) {
    try {
        let query = db.select().from(invoices);
        if (clientId) {
            // @ts-ignore
            query = query.where(eq(invoices.clientId, clientId));
        }
        const data = await query.orderBy(desc(invoices.createdAt));
        console.log('[getInvoices] Fetched', data.length, 'invoices');
        return { success: true, data };
    } catch (error) {
        console.error('[getInvoices] Error:', error);
        return { success: false, error: 'Failed to fetch invoices' };
    }
}

export async function getClients() {
    try {
        // Only fetch users with role 'user' (clients)
        const data = await db.select().from(users)
            .where(eq(users.role, 'user'))
            .orderBy(desc(users.createdAt));
        return { success: true, data };
    } catch (error) {
        console.error('[getClients] Error:', error);
        return { success: false, error: 'Failed to fetch clients' };
    }
}

export async function createInvoice(formData: FormData) {
    const totalAmount = formData.get('totalAmount') as string;
    const dueDate = formData.get('dueDate') as string;
    const clientId = formData.get('clientId') as string || null;
    const currency = formData.get('currency') as string || 'USD';
    const notes = formData.get('notes') as string || '';
    const discountAmount = formData.get('discountAmount') as string || '0';
    const discountType = formData.get('discountType') as string || 'fixed';
    const isRecurring = formData.get('isRecurring') === 'true';
    const recurringFrequency = formData.get('recurringFrequency') as string || null;
    const recurringEndDateRaw = formData.get('recurringEndDate') as string || null;

    // Auto-generate invoice number
    let invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    try {
        const count = await db.select({ id: invoices.id }).from(invoices);
        invoiceNumber = `INV-${new Date().getFullYear()}-${(count.length + 1).toString().padStart(3, '0')}`;
    } catch (e) {
        // Use timestamp-based fallback if count query fails
        console.warn('Could not count invoices, using timestamp-based number');
    }

    try {
        console.log('[createInvoice] Inserting invoice with:', { invoiceNumber, totalAmount, dueDate, clientId, currency });
        const [result] = await db.insert(invoices).values({
            invoiceNumber,
            totalAmount,
            dueDate: dueDate ? new Date(dueDate) : null,
            status: 'draft',
            clientId: clientId === 'unassigned' || !clientId ? null : clientId,
            currency,
            notes,
            discountAmount,
            discountType,
            isRecurring,
            recurringFrequency,
            recurringNextDate: isRecurring ? await calculateNextDueDate(dueDate ? new Date(dueDate) : new Date(), (recurringFrequency || 'monthly') as any) : null,
            recurringEndDate: recurringEndDateRaw ? new Date(recurringEndDateRaw) : null,
        }).returning({ id: invoices.id });
        console.log('[createInvoice] Successfully created invoice:', result.id);

        revalidatePath('/admin/finance');

        // Log Activity
        await recordActivity({
            userId: null,
            action: 'invoice_created',
            details: { amount: totalAmount, id: result.id.slice(0, 8), invoiceNumber }
        });

        // Notify client if assigned
        if (clientId && clientId !== 'unassigned') {
            await createNotification(
                clientId,
                'invoice_created',
                'New Invoice Created',
                `Invoice ${invoiceNumber} has been created for ${currency} ${parseFloat(totalAmount).toLocaleString()}`,
                `/admin/finance/invoice/${result.id}`
            );
        }

        return { success: true, id: result.id };
    } catch (error) {
        console.error('createInvoice error:', error);
        return { success: false, error: 'Failed to create invoice' };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
    try {
        // Get invoice details before updating
        const [invoice] = await db.select()
            .from(invoices)
            .where(eq(invoices.id, invoiceId))
            .limit(1);

        const updateData: any = { status, updatedAt: new Date() };
        if (status === 'paid') {
            updateData.paidAt = new Date();
        }
        await db.update(invoices).set(updateData).where(eq(invoices.id, invoiceId));
        console.log(`[updateInvoiceStatus] Updated invoice ${invoiceId} to status: ${status}`);
        revalidatePath('/admin/finance');

        // Log Activity
        await recordActivity({
            userId: null,
            action: 'invoice_status_updated',
            details: { invoiceId: invoiceId.slice(0, 8), newStatus: status }
        });

        // Notify client of status change
        if (invoice?.clientId) {
            const statusMessages: Record<string, string> = {
                'draft': 'Invoice is in draft',
                'sent': 'Invoice has been sent to you',
                'paid': 'Payment received - Thank you!',
                'overdue': 'Invoice is now overdue',
                'cancelled': 'Invoice has been cancelled'
            };
            
            await createNotification(
                invoice.clientId,
                'invoice_status_updated',
                `Invoice ${invoice.invoiceNumber} - ${status.toUpperCase()}`,
                statusMessages[status] || `Invoice status updated to ${status}`,
                `/admin/finance/invoice/${invoiceId}`
            );
        }

        return { success: true };
    } catch (error) {
        console.error('[updateInvoiceStatus] Error:', error);
        return { success: false, error: 'Failed to update invoice status' };
    }
}

export async function getInvoiceDetails(invoiceId: string) {
    try {
        const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
        if (!invoice) return { success: false, error: 'Invoice not found' };

        const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));

        let client = null;
        if (invoice.clientId) {
            [client] = await db.select().from(users).where(eq(users.id, invoice.clientId)).limit(1);
        }

        return { success: true, data: { ...invoice, items, client } };
    } catch (error) {
        console.error('getInvoiceDetails error:', error);
        return { success: false, error: 'Failed to fetch invoice details' };
    }
}
export async function addInvoiceItem(data: {
    invoiceId: string;
    title?: string | null;
    description?: string | null;
    quantity: string;
    unitPrice: string;
    amount: string;
}) {
    try {
        await db.insert(invoiceItems).values(data);
        revalidatePath('/admin/finance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to add invoice item' };
    }
}

export async function updateInvoice(invoiceId: string, data: any, items: any[]) {
    try {
        // 1. Update main invoice
        await db.update(invoices)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(invoices.id, invoiceId));

        // 2. Refresh items: Delete old and insert new (simpler than tracking changes)
        await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
        
        if (items.length > 0) {
            await db.insert(invoiceItems).values(
                items.map(item => ({
                    title: item.title,
                    description: item.description,
                    quantity: String(item.quantity),
                    unitPrice: String(item.unitPrice),
                    amount: String(item.amount),
                    invoiceId
                }))
            );
        }

        revalidatePath('/admin/finance');
        revalidatePath(`/admin/finance/invoice/${invoiceId}`);

        // Log Activity
        await recordActivity({
            userId: null,
            action: 'invoice_updated',
            details: { id: invoiceId.slice(0, 8), invoiceNumber: data.invoiceNumber }
        });

        return { success: true };
    } catch (error) {
        console.error('updateInvoice error:', error);
        return { success: false, error: 'Failed to update invoice' };
    }
}

/**
 * Send invoice via email to the client using the Zoho SMTP setup.
 * Builds a beautiful HTML invoice matching the branded design.
 */
export async function sendInvoiceEmail(invoiceId: string) {
    try {
        const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
        if (!invoice) return { success: false, error: 'Invoice not found' };

        const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));

        let client = null;
        if (invoice.clientId) {
            [client] = await db.select({ email: users.email, name: users.name }).from(users).where(eq(users.id, invoice.clientId)).limit(1);
        }

        if (!client?.email) {
            return { success: false, error: 'Invoice has no client with an email address assigned. Assign a client with an email first.' };
        }

        const { data: settings } = await getCompanySettings();

        const companyName = settings?.companyName || 'Bold Ideas';
        const companyWebsite = settings?.companyWebsite || 'boldideas.agency';
        const companyEmail = settings?.companyEmail || 'HQ@boldideas.agency';

        const getCurrencySymbol = (currency: string | null) => {
            switch (currency) {
                case 'NGN': return '&#8358;';
                case 'EUR': return '&#8364;';
                case 'GBP': return '&#163;';
                default: return '&#36;';
            }
        };

        const currencySymbol = getCurrencySymbol(invoice.currency);
        const formattedAmount = Number(invoice.totalAmount || 0).toLocaleString();
        const dueDateStr = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Open';
        const issueDateStr = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

        const itemsHtml = items.length > 0
            ? items.map(item => `
                <tr>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0;">
                        <div style="font-weight: 700; color: #0A1128; font-size: 14px;">${item.title || 'Professional Services'}</div>
                        ${item.description ? `<div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">${item.description}</div>` : ''}
                    </td>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-weight: 600; font-size: 14px;">${item.quantity}</td>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0A1128; font-weight: 700; font-size: 14px;">${currencySymbol}${Number(item.unitPrice).toLocaleString()}</td>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0A1128; font-weight: 900; font-size: 14px;">${currencySymbol}${Number(item.amount).toLocaleString()}</td>
                </tr>
            `).join('')
            : `
                <tr>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; color: #0A1128; font-weight: 700; font-size: 14px;">Professional Services</td>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-weight: 600; font-size: 14px;">1</td>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0A1128; font-weight: 700; font-size: 14px;">${currencySymbol}${formattedAmount}</td>
                    <td style="padding: 16px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0A1128; font-weight: 900; font-size: 14px;">${currencySymbol}${formattedAmount}</td>
                </tr>
            `;

        const hasDiscount = Number(invoice.discountAmount || 0) > 0;

        const paymentLinkHtml = invoice.stripePaymentLink
            ? `
                <tr>
                    <td colspan="2" style="padding: 24px 40px; text-align: center;">
                        <a href="${invoice.stripePaymentLink}" style="display: inline-block; background: #D4AF37; color: #0A1128; padding: 14px 32px; text-decoration: none; font-weight: 800; font-size: 14px; border-radius: 8px; letter-spacing: 1px;">
                            PAY NOW &mdash; ${currencySymbol}${formattedAmount}
                        </a>
                        <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">Secure payment powered by Stripe</p>
                    </td>
                </tr>
            `
            : '';

        const statusBadgeColor = invoice.status === 'paid' ? '#059669' : invoice.status === 'overdue' ? '#e11d48' : invoice.status === 'sent' ? '#2563eb' : '#64748b';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoiceNumber || ''}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Card -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Navy Top Bar -->
                    <tr>
                        <td style="background-color: #0A1128; height: 6px;"></td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="text-align: left; vertical-align: top;">
                                        <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #0A1128; letter-spacing: -1px;">${companyName.toUpperCase()}</h1>
                                        <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-weight: 600;">${companyWebsite} &bull; ${companyEmail}</p>
                                    </td>
                                    <td style="text-align: right; vertical-align: top;">
                                        <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #0A1128; letter-spacing: -2px; line-height: 1;">INVOICE</h1>
                                        <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 800; color: #D4AF37; letter-spacing: 2px;">#${invoice.invoiceNumber || invoiceId.slice(0, 8).toUpperCase()}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr><td><hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 40px;"></td></tr>

                    <!-- Client & Dates -->
                    <tr>
                        <td style="padding: 24px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="vertical-align: top; width: 50%;">
                                        <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">Bill To</p>
                                        <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0A1128;">${client?.name || 'Valued Client'}</p>
                                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">${client?.email || ''}</p>
                                    </td>
                                    <td style="vertical-align: top; width: 25%;">
                                        <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">Issue Date</p>
                                        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0A1128;">${issueDateStr}</p>
                                    </td>
                                    <td style="vertical-align: top; width: 25%;">
                                        <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">Due Date</p>
                                        <p style="margin: 0; font-size: 13px; font-weight: 700; color: ${invoice.status === 'overdue' ? '#e11d48' : '#0A1128'};">${dueDateStr}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Items Table -->
                    <tr>
                        <td style="padding: 0 40px 24px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #f8fafc;">
                                        <th style="padding: 12px; text-align: left; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Description</th>
                                        <th style="padding: 12px; text-align: center; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Qty</th>
                                        <th style="padding: 12px; text-align: right; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Unit Price</th>
                                        <th style="padding: 12px; text-align: right; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Summary -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="vertical-align: top; width: 50%; padding-right: 20px;">
                                        ${invoice.notes ? `
                                            <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">Notes</p>
                                            <p style="margin: 0; font-size: 12px; color: #64748b; font-style: italic;">${invoice.notes}</p>
                                        ` : ''}
                                    </td>
                                    <td style="vertical-align: top; width: 50%;">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="padding: 4px 0; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">Subtotal</td>
                                                <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 700; color: #0A1128;">${currencySymbol}${formattedAmount}</td>
                                            </tr>
                                            ${hasDiscount ? `
                                            <tr>
                                                <td style="padding: 4px 0; font-size: 10px; font-weight: 900; color: #e11d48; letter-spacing: 1px; text-transform: uppercase;">Discount (${invoice.discountType})</td>
                                                <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 700; color: #e11d48;">-${currencySymbol}${Number(invoice.discountAmount).toLocaleString()}</td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td style="padding: 4px 0; font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">Tax</td>
                                                <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 700; color: #0A1128;">${currencySymbol}0.00</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0 4px 0; border-top: 2px solid #0A1128;">
                                                    <span style="font-size: 10px; font-weight: 900; color: #0A1128; letter-spacing: 1px; text-transform: uppercase;">Total Due</span>
                                                </td>
                                                <td style="padding: 12px 0 4px 0; text-align: right; border-top: 2px solid #0A1128;">
                                                    <span style="font-size: 22px; font-weight: 900; color: #0A1128; letter-spacing: -1px;">${currencySymbol}${formattedAmount}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Stripe Payment CTA -->
                    ${paymentLinkHtml}

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; font-size: 10px; color: #94a3b8; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">${companyName.toUpperCase()} &bull; Official Digital Transmission</p>
                            <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">
                                <a href="mailto:${companyEmail}" style="color: #0A1128; text-decoration: none; font-weight: 600;">${companyEmail}</a>
                                &nbsp;&bull;&nbsp;
                                <a href="https://${companyWebsite}" style="color: #0A1128; text-decoration: none;">${companyWebsite}</a>
                            </p>
                            <p style="margin: 4px 0 0 0; font-size: 10px; color: #cbd5e1;">Invoice #${invoice.invoiceNumber || invoiceId.slice(0, 8).toUpperCase()} &bull; Status: ${(invoice.status || 'draft').toUpperCase()}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        await resend.emails.send({
            from: process.env.FROM_EMAIL!,
            to: client.email,
            subject: `Invoice ${invoice.invoiceNumber || ''} from ${companyName}`,
            html,
        });

        // Auto-mark as sent if currently draft
        if (invoice.status === 'draft') {
            await db.update(invoices).set({ status: 'sent', updatedAt: new Date() }).where(eq(invoices.id, invoiceId));
        }

        revalidatePath('/admin/finance');
        revalidatePath(`/admin/finance/invoice/${invoiceId}`);

        await recordActivity({
            userId: null,
            action: 'invoice_emailed',
            details: { invoiceId: invoiceId.slice(0, 8), invoiceNumber: invoice.invoiceNumber, email: client.email }
        });

        return { success: true };
    } catch (error: any) {
        console.error('[sendInvoiceEmail] Error:', error);
        return { success: false, error: error.message || 'Failed to send invoice email' };
    }
}

/**
 * Count pending invoices (sent or overdue)
 */
export async function getPendingInvoiceCount() {
    try {
        const rows = await db.select({ id: invoices.id })
            .from(invoices)
            .where(
                or(
                    eq(invoices.status, 'sent'),
                    eq(invoices.status, 'overdue')
                )
            );
        return { success: true, count: rows.length };
    } catch (error) {
        console.error('getPendingInvoiceCount error:', error);
        return { success: false, count: 0 };
    }
}

/**
 * Get recent pending invoices with minimal details (for sidebar dropdown)
 */
export async function getRecentPendingInvoices(limit = 10) {
    try {
        const rows = await db.select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            totalAmount: invoices.totalAmount,
            currency: invoices.currency,
            status: invoices.status,
            dueDate: invoices.dueDate,
        })
            .from(invoices)
            .where(
                or(
                    eq(invoices.status, 'sent'),
                    eq(invoices.status, 'overdue')
                )
            )
            .orderBy(desc(invoices.createdAt))
            .limit(limit);
        return { success: true, data: rows };
    } catch (error) {
        console.error('getRecentPendingInvoices error:', error);
        return { success: false, data: [] };
    }
}

export async function deleteInvoice(invoiceId: string) {
    try {
        // Get invoice number first for logging
        const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
        
        await db.delete(invoices).where(eq(invoices.id, invoiceId));
        
        revalidatePath('/admin/finance');

        // Log Activity
        await recordActivity({
            userId: null,
            action: 'invoice_deleted',
            details: { id: invoiceId.slice(0, 8), invoiceNumber: invoice?.invoiceNumber }
        });

        return { success: true };
    } catch (error) {
        console.error('deleteInvoice error:', error);
        return { success: false, error: 'Failed to delete invoice' };
    }
}
