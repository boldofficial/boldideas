'use server'

import { db } from '@/lib/db';
import { invoices, invoiceItems, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { recordActivity } from './activity';

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
        const data = await db.select().from(users).orderBy(desc(users.createdAt));
        return { success: true, data };
    } catch (error) {
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

        return { success: true, id: result.id };
    } catch (error) {
        console.error('createInvoice error:', error);
        return { success: false, error: 'Failed to create invoice' };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
    try {
        const updateData: any = { status, updatedAt: new Date() };
        if (status === 'paid') {
            updateData.paidAt = new Date();
        }

        await db.update(invoices).set(updateData).where(eq(invoices.id, invoiceId));
        revalidatePath('/admin/finance');

        // Log Activity
        await recordActivity({
            userId: null,
            action: 'invoice_status_updated',
            details: { id: invoiceId.slice(0, 8), status }
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update invoice' };
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
