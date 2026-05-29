'use server'

import { db } from '@/lib/db';
import { invoices, invoiceItems, users } from '@/lib/db/schema';
import { eq, and, lte, isNull, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { recordActivity } from './activity';
import { createNotification } from './notifications';
import { resend } from '@/lib/resend';

type RecurringFrequency = 'monthly' | 'quarterly' | 'yearly' | 'bi-weekly';

/**
 * Advance a date by the given frequency.
 */
function advanceDate(date: Date, frequency: RecurringFrequency): Date {
    const d = new Date(date);
    switch (frequency) {
        case 'monthly':
            d.setMonth(d.getMonth() + 1);
            break;
        case 'quarterly':
            d.setMonth(d.getMonth() + 3);
            break;
        case 'yearly':
            d.setFullYear(d.getFullYear() + 1);
            break;
        case 'bi-weekly':
            d.setDate(d.getDate() + 14);
            break;
    }
    return d;
}

/**
 * Calculate the next due date based on the invoice's due date and frequency.
 * e.g., if original due date was 15th and freq is monthly, next due date is 15th of next month.
 */
export function calculateNextDueDate(originalDueDate: Date | null, frequency: RecurringFrequency): Date | null {
    if (!originalDueDate) return null;
    const next = advanceDate(originalDueDate, frequency);
    return next;
}

/**
 * Find all recurring invoices that are due for generation and clone them.
 * Designed to be called from a cron job or API endpoint.
 */
export async function generateRecurringInvoices() {
    try {
        const now = new Date();

        // Find all recurring invoices where next date is due (or past due)
        const dueRecurring = await db.select()
            .from(invoices)
            .where(
                and(
                    eq(invoices.isRecurring, true),
                    lte(invoices.recurringNextDate!, now),
                    or(
                        isNull(invoices.recurringEndDate),
                        lte(invoices.recurringNextDate!, invoices.recurringEndDate)
                    )
                )
            );

        if (dueRecurring.length === 0) {
            console.log('[generateRecurringInvoices] No recurring invoices due');
            return { success: true, generated: [] };
        }

        console.log(`[generateRecurringInvoices] Found ${dueRecurring.length} recurring invoice(s) due`);

        const generated: { id: string; invoiceNumber: string; sourceId: string }[] = [];

        for (const sourceInvoice of dueRecurring) {
            const frequency = sourceInvoice.recurringFrequency as RecurringFrequency | null;
            if (!frequency) {
                console.warn(`[generateRecurringInvoices] Invoice ${sourceInvoice.id} has no frequency, skipping`);
                continue;
            }

            // Auto-generate invoice number
            let invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
            try {
                const count = await db.select({ id: invoices.id }).from(invoices);
                invoiceNumber = `INV-${new Date().getFullYear()}-${(count.length + 1).toString().padStart(3, '0')}`;
            } catch (e) {
                // fallback
            }

            // Calculate the new due date based on the source's original due date + frequency
            const newDueDate = calculateNextDueDate(sourceInvoice.dueDate, frequency);

            // Clone the invoice
            const [newInvoice] = await db.insert(invoices).values({
                clientId: sourceInvoice.clientId,
                invoiceNumber,
                status: 'sent',
                issueDate: new Date(),
                dueDate: newDueDate,
                totalAmount: sourceInvoice.totalAmount,
                amountPaid: '0',
                discountAmount: sourceInvoice.discountAmount || '0',
                discountType: sourceInvoice.discountType || 'fixed',
                currency: sourceInvoice.currency || 'USD',
                notes: `Recurring invoice — generated from ${sourceInvoice.invoiceNumber || sourceInvoice.id.slice(0, 8)}${sourceInvoice.notes ? `\n\n${sourceInvoice.notes}` : ''}`,
                // Mark this as a generated child of the recurring source
                isRecurring: false, // child invoices are not themselves recurring
                recurringSourceInvoiceId: sourceInvoice.id,
            }).returning({ id: invoices.id, invoiceNumber: invoices.invoiceNumber });

            // Clone invoice items
            const sourceItems = await db.select()
                .from(invoiceItems)
                .where(eq(invoiceItems.invoiceId, sourceInvoice.id));

            if (sourceItems.length > 0) {
                await db.insert(invoiceItems).values(
                    sourceItems.map(item => ({
                        invoiceId: newInvoice.id,
                        title: item.title,
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        amount: item.amount,
                    }))
                );
            }

            // Update the source invoice's next generation date
            const nextDate = advanceDate(now, frequency);

            // Check if we've passed the end date
            if (sourceInvoice.recurringEndDate && nextDate > sourceInvoice.recurringEndDate) {
                // This was the last one — unmark recurring
                await db.update(invoices)
                    .set({
                        isRecurring: false,
                        recurringNextDate: null,
                        updatedAt: new Date(),
                    })
                    .where(eq(invoices.id, sourceInvoice.id));
            } else {
                await db.update(invoices)
                    .set({
                        recurringNextDate: nextDate,
                        updatedAt: new Date(),
                    })
                    .where(eq(invoices.id, sourceInvoice.id));
            }

            // Notify client if assigned
            if (sourceInvoice.clientId) {
                await createNotification(
                    sourceInvoice.clientId,
                    'invoice_created',
                    'Recurring Invoice Generated',
                    `Your recurring invoice ${invoiceNumber} for ${sourceInvoice.currency || 'USD'} ${parseFloat(sourceInvoice.totalAmount || '0').toLocaleString()} has been generated.`,
                    `/admin/finance/invoice/${newInvoice.id}`
                );
            }

            // Notify admin staff
            const admins = await db.select({ id: users.id })
                .from(users)
                .where(eq(users.role, 'admin'));

            for (const admin of admins) {
                await createNotification(
                    admin.id,
                    'recurring_invoice_generated',
                    'Recurring Invoice Auto-Generated',
                    `Invoice ${invoiceNumber} (${sourceInvoice.currency || 'USD'} ${parseFloat(sourceInvoice.totalAmount || '0').toLocaleString()}) generated from recurring template ${sourceInvoice.invoiceNumber || sourceInvoice.id.slice(0, 8)}`,
                    `/admin/finance/invoice/${newInvoice.id}`
                );
            }

            generated.push({
                id: newInvoice.id,
                invoiceNumber: newInvoice.invoiceNumber || invoiceNumber,
                sourceId: sourceInvoice.id,
            });

            // Log activity
            await recordActivity({
                userId: null,
                action: 'recurring_invoice_generated',
                details: {
                    sourceInvoiceId: sourceInvoice.id.slice(0, 8),
                    sourceInvoiceNumber: sourceInvoice.invoiceNumber,
                    newInvoiceId: newInvoice.id.slice(0, 8),
                    newInvoiceNumber: invoiceNumber,
                    amount: sourceInvoice.totalAmount,
                    frequency,
                },
            });

            console.log(`[generateRecurringInvoices] Generated invoice ${invoiceNumber} from source ${sourceInvoice.invoiceNumber}`);
        }

        revalidatePath('/admin/finance');

        return { success: true, generated };
    } catch (error) {
        console.error('[generateRecurringInvoices] Error:', error);
        return { success: false, error: 'Failed to generate recurring invoices' };
    }
}

/**
 * Set up an existing invoice as a recurring template.
 */
export async function enableRecurringInvoice(
    invoiceId: string,
    frequency: RecurringFrequency,
    endDate?: string | null
) {
    try {
        const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
        if (!invoice) return { success: false, error: 'Invoice not found' };

        // Calculate next date from today
        const nextDate = advanceDate(new Date(), frequency);

        await db.update(invoices).set({
            isRecurring: true,
            recurringFrequency: frequency,
            recurringNextDate: nextDate,
            recurringEndDate: endDate ? new Date(endDate) : null,
            updatedAt: new Date(),
        }).where(eq(invoices.id, invoiceId));

        revalidatePath('/admin/finance');
        revalidatePath(`/admin/finance/invoice/${invoiceId}`);

        await recordActivity({
            userId: null,
            action: 'recurring_invoice_enabled',
            details: {
                invoiceId: invoiceId.slice(0, 8),
                invoiceNumber: invoice.invoiceNumber,
                frequency,
                nextDate: nextDate.toISOString(),
                endDate: endDate || null,
            },
        });

        return { success: true, nextDate };
    } catch (error) {
        console.error('[enableRecurringInvoice] Error:', error);
        return { success: false, error: 'Failed to enable recurring invoice' };
    }
}

/**
 * Disable recurring for an invoice.
 */
export async function disableRecurringInvoice(invoiceId: string) {
    try {
        const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
        if (!invoice) return { success: false, error: 'Invoice not found' };

        await db.update(invoices).set({
            isRecurring: false,
            recurringFrequency: null,
            recurringNextDate: null,
            updatedAt: new Date(),
        }).where(eq(invoices.id, invoiceId));

        revalidatePath('/admin/finance');
        revalidatePath(`/admin/finance/invoice/${invoiceId}`);

        await recordActivity({
            userId: null,
            action: 'recurring_invoice_disabled',
            details: {
                invoiceId: invoiceId.slice(0, 8),
                invoiceNumber: invoice.invoiceNumber,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('[disableRecurringInvoice] Error:', error);
        return { success: false, error: 'Failed to disable recurring invoice' };
    }
}
