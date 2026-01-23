'use server'

import { db } from '@/lib/db';
import { payments, receipts, invoices, expenses, bankAccounts, companySettings, users } from '@/lib/db/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { recordActivity } from './activity';
import { createNotification } from './notifications';

// ============= PAYMENTS =============

export async function recordPayment(data: {
    invoiceId: string;
    amount: string;
    paymentMethod?: string;
    notes?: string;
    createdBy?: string;
}) {
    try {
        // Get current invoice
        const [invoice] = await db.select().from(invoices).where(eq(invoices.id, data.invoiceId)).limit(1);
        if (!invoice) return { success: false, error: 'Invoice not found' };

        // Calculate new amount paid
        const currentPaid = parseFloat(invoice.amountPaid || '0');
        const newPayment = parseFloat(data.amount);
        const totalPaid = currentPaid + newPayment;
        const totalAmount = parseFloat(invoice.totalAmount || '0');

        // Insert payment record
        const [payment] = await db.insert(payments).values({
            invoiceId: data.invoiceId,
            amount: data.amount,
            currency: invoice.currency,
            paymentMethod: data.paymentMethod || 'bank_transfer',
            notes: data.notes || null,
            createdBy: data.createdBy || null,
        }).returning();

        // Update invoice
        const newStatus = totalPaid >= totalAmount ? 'paid' : 'partial';
        await db.update(invoices).set({
            amountPaid: totalPaid.toString(),
            status: newStatus,
            paidAt: newStatus === 'paid' ? new Date() : null,
            updatedAt: new Date(),
        }).where(eq(invoices.id, data.invoiceId));

        // If fully paid, generate receipt
        let receipt = null;
        if (newStatus === 'paid') {
            receipt = await createReceipt({
                invoiceId: data.invoiceId,
                amountPaid: totalPaid.toString(),
                paymentMethod: data.paymentMethod,
            });
        }

        revalidatePath('/admin/finance');
        revalidatePath(`/admin/finance/invoice/${data.invoiceId}`);

        await recordActivity({
            userId: null,
            action: 'payment_recorded',
            details: { invoiceId: data.invoiceId.slice(0, 8), amount: data.amount, status: newStatus }
        });

        // Notify all admins of payment
        const admins = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.role, 'admin'));
        
        for (const admin of admins) {
            await createNotification(
                admin.id,
                'payment_recorded',
                'Payment Received',
                `Payment of ${invoice.currency} ${parseFloat(data.amount).toLocaleString()} recorded for invoice ${invoice.invoiceNumber}`,
                `/admin/finance/invoice/${data.invoiceId}`
            );
        }

        return { success: true, payment, receipt };
    } catch (error) {
        console.error('recordPayment error:', error);
        return { success: false, error: 'Failed to record payment' };
    }
}

export async function getPaymentsByInvoice(invoiceId: string) {
    try {
        const data = await db.select().from(payments)
            .where(eq(payments.invoiceId, invoiceId))
            .orderBy(desc(payments.paymentDate));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch payments' };
    }
}

// ============= RECEIPTS =============

export async function createReceipt(data: {
    invoiceId: string;
    amountPaid: string;
    paymentMethod?: string;
    paymentReference?: string;
}) {
    try {
        // Generate receipt number
        const count = await db.select({ id: receipts.id }).from(receipts);
        const receiptNumber = `RCP-${new Date().getFullYear()}-${(count.length + 1).toString().padStart(4, '0')}`;

        const [receipt] = await db.insert(receipts).values({
            invoiceId: data.invoiceId,
            receiptNumber,
            amountPaid: data.amountPaid,
            paymentMethod: data.paymentMethod || 'bank_transfer',
            paymentReference: data.paymentReference || null,
        }).returning();

        revalidatePath('/admin/finance');

        // Notify client of receipt generation
        const [invoice] = await db.select()
            .from(invoices)
            .where(eq(invoices.id, data.invoiceId))
            .limit(1);
        
        if (invoice?.clientId) {
            await createNotification(
                invoice.clientId,
                'receipt_generated',
                'Payment Receipt Generated',
                `Receipt ${receiptNumber} has been generated for your payment`,
                `/admin/finance/receipt/${receipt.id}`
            );
        }

        return { success: true, data: receipt };
    } catch (error) {
        console.error('createReceipt error:', error);
        return { success: false, error: 'Failed to create receipt' };
    }
}

export async function getReceiptByInvoice(invoiceId: string) {
    try {
        const [receipt] = await db.select().from(receipts)
            .where(eq(receipts.invoiceId, invoiceId))
            .limit(1);
        return { success: true, data: receipt };
    } catch (error) {
        return { success: false, error: 'Failed to fetch receipt' };
    }
}

export async function getReceiptDetails(receiptId: string) {
    try {
        const [receipt] = await db.select().from(receipts)
            .where(eq(receipts.id, receiptId))
            .limit(1);
        if (!receipt) return { success: false, error: 'Receipt not found' };

        // Get associated invoice
        const [invoice] = await db.select().from(invoices)
            .where(eq(invoices.id, receipt.invoiceId!))
            .limit(1);

        return { success: true, data: { ...receipt, invoice } };
    } catch (error) {
        return { success: false, error: 'Failed to fetch receipt details' };
    }
}

// ============= EXPENSES =============

export async function createExpense(data: {
    category: string;
    description?: string;
    amount: string;
    currency?: string;
    expenseDate?: string;
    vendor?: string;
    receiptUrl?: string;
    isRecurring?: boolean;
    createdBy?: string;
}) {
    try {
        const [expense] = await db.insert(expenses).values({
            category: data.category,
            description: data.description || null,
            amount: data.amount,
            currency: data.currency || 'USD',
            expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
            vendor: data.vendor || null,
            receiptUrl: data.receiptUrl || null,
            isRecurring: data.isRecurring || false,
            createdBy: data.createdBy || null,
        }).returning();

        revalidatePath('/admin/finance');

        // Notify all admins of new expense
        const admins = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.role, 'admin'));
        
        for (const admin of admins) {
            await createNotification(
                admin.id,
                'expense_created',
                'New Expense Recorded',
                `${data.category}: ${data.currency || 'USD'} ${parseFloat(data.amount).toLocaleString()}${data.vendor ? ` - ${data.vendor}` : ''}`,
                `/admin/finance`
            );
        }

        return { success: true, data: expense };
    } catch (error) {
        console.error('createExpense error:', error);
        return { success: false, error: 'Failed to create expense' };
    }
}

export async function getExpenses(filters?: { category?: string; startDate?: string; endDate?: string }) {
    try {
        let query = db.select().from(expenses);

        // Apply filters if provided
        const conditions = [];
        if (filters?.category) {
            conditions.push(eq(expenses.category, filters.category));
        }
        if (filters?.startDate) {
            conditions.push(gte(expenses.expenseDate, new Date(filters.startDate)));
        }
        if (filters?.endDate) {
            conditions.push(lte(expenses.expenseDate, new Date(filters.endDate)));
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
        }

        const data = await query.orderBy(desc(expenses.expenseDate));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch expenses' };
    }
}

export async function deleteExpense(expenseId: string) {
    try {
        await db.delete(expenses).where(eq(expenses.id, expenseId));
        revalidatePath('/admin/finance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete expense' };
    }
}

// ============= BANK ACCOUNTS =============

export async function createBankAccount(data: {
    accountName: string;
    bankName: string;
    accountNumber?: string;
    currency?: string;
    isPrimary?: boolean;
}) {
    try {
        // If setting as primary, unset other primary accounts
        if (data.isPrimary) {
            await db.update(bankAccounts).set({ isPrimary: false });
        }

        const [account] = await db.insert(bankAccounts).values({
            accountName: data.accountName,
            bankName: data.bankName,
            accountNumber: data.accountNumber || null,
            currency: data.currency || 'USD',
            isPrimary: data.isPrimary || false,
        }).returning();

        revalidatePath('/admin/finance');
        return { success: true, data: account };
    } catch (error) {
        return { success: false, error: 'Failed to create bank account' };
    }
}

export async function getBankAccounts() {
    try {
        const data = await db.select().from(bankAccounts).orderBy(desc(bankAccounts.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch bank accounts' };
    }
}

// ============= ANALYTICS =============

export async function getFinanceAnalytics(year?: number) {
    const targetYear = year || new Date().getFullYear();
    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);
    const startOfLastYear = new Date(targetYear - 1, 0, 1);
    const endOfLastYear = new Date(targetYear - 1, 11, 31, 23, 59, 59);

    try {
        // Current year invoices
        const currentYearInvoices = await db.select().from(invoices)
            .where(and(
                gte(invoices.createdAt, startOfYear),
                lte(invoices.createdAt, endOfYear)
            ));

        // Last year invoices (for YoY comparison)
        const lastYearInvoices = await db.select().from(invoices)
            .where(and(
                gte(invoices.createdAt, startOfLastYear),
                lte(invoices.createdAt, endOfLastYear)
            ));

        // Current year expenses
        const currentYearExpenses = await db.select().from(expenses)
            .where(and(
                gte(expenses.expenseDate, startOfYear),
                lte(expenses.expenseDate, endOfYear)
            ));

        // Calculate metrics
        const totalRevenue = currentYearInvoices
            .filter(i => i.status === 'paid')
            .reduce((sum, i) => sum + parseFloat(i.totalAmount || '0'), 0);

        const totalExpenses = currentYearExpenses
            .reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);

        const outstanding = currentYearInvoices
            .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
            .reduce((sum, i) => sum + parseFloat(i.totalAmount || '0'), 0);

        const lastYearRevenue = lastYearInvoices
            .filter(i => i.status === 'paid')
            .reduce((sum, i) => sum + parseFloat(i.totalAmount || '0'), 0);

        // Monthly revenue breakdown
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
            const monthInvoices = currentYearInvoices.filter(inv => {
                const d = new Date(inv.paidAt || inv.createdAt || '');
                return d.getMonth() === i && inv.status === 'paid';
            });
            return {
                month: i,
                revenue: monthInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || '0'), 0)
            };
        });

        // YoY comparison
        const yoyGrowth = lastYearRevenue > 0
            ? ((totalRevenue - lastYearRevenue) / lastYearRevenue * 100).toFixed(1)
            : null;

        return {
            success: true,
            data: {
                totalRevenue,
                totalExpenses,
                netProfit: totalRevenue - totalExpenses,
                outstanding,
                invoiceCount: currentYearInvoices.length,
                paidCount: currentYearInvoices.filter(i => i.status === 'paid').length,
                pendingCount: currentYearInvoices.filter(i => i.status === 'sent' || i.status === 'draft').length,
                overdueCount: currentYearInvoices.filter(i => i.status === 'overdue').length,
                monthlyRevenue,
                yoyGrowth,
                lastYearRevenue,
                year: targetYear,
            }
        };
    } catch (error) {
        console.error('getFinanceAnalytics error:', error);
        return { success: false, error: 'Failed to fetch analytics' };
    }
}
// ============= COMPANY SETTINGS =============

export async function getCompanySettings() {
    try {
        const [settings] = await db.select().from(companySettings).limit(1);
        if (!settings) {
            // Create default if missing
            const [newSettings] = await db.insert(companySettings).values({
                companyName: 'Bold Ideas Innovations Ltd.',
                companyWebsite: 'boldideas.agency',
                companyEmail: 'HQ@boldideas.agency',
            }).returning();
            return { success: true, data: newSettings };
        }
        return { success: true, data: settings };
    } catch (error) {
        console.error('getCompanySettings error:', error);
        return { success: false, error: 'Failed to fetch company settings' };
    }
}

export async function updateCompanySettings(data: Partial<typeof companySettings.$inferSelect>) {
    try {
        const [settings] = await db.select().from(companySettings).limit(1);

        if (settings) {
            await db.update(companySettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(companySettings.id, settings.id));
        } else {
            await db.insert(companySettings).values(data as any);
        }

        revalidatePath('/admin/finance');
        return { success: true };
    } catch (error) {
        console.error('updateCompanySettings error:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
