'use server'

import { db } from '@/lib/db';
import { invoices, invoiceItems, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { recordActivity } from './activity';
import { createNotification } from './notifications';

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
            discountType
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
