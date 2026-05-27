'use server'

import { db } from '@/lib/db';
import { purchases, invoices, invoiceItems, receipts, users, notifications } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { resend } from '@/lib/resend';

export async function getPurchases() {
  try {
    const data = await db.select().from(purchases).orderBy(desc(purchases.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error('[getPurchases] Error:', error);
    return { success: false, error: 'Failed to fetch purchases' };
  }
}

export async function getPurchaseById(id: string) {
  try {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id)).limit(1);
    if (!purchase) return { success: false, error: 'Purchase not found' };
    return { success: true, data: purchase };
  } catch (error) {
    console.error('[getPurchaseById] Error:', error);
    return { success: false, error: 'Failed to fetch purchase' };
  }
}

export async function createPurchase(data: {
  serviceSlug: string;
  packageName: string;
  amount: string;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  userId?: string | null;
  stripeSessionId?: string;
}) {
  try {
    const [result] = await db.insert(purchases).values({
      serviceSlug: data.serviceSlug,
      packageName: data.packageName,
      amount: data.amount,
      currency: data.currency || 'USD',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      userId: data.userId || null,
      stripeSessionId: data.stripeSessionId || null,
      status: 'pending',
    }).returning({ id: purchases.id });

    console.log('[createPurchase] Created purchase:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('[createPurchase] Error:', error);
    return { success: false, error: 'Failed to create purchase' };
  }
}

export async function updatePurchaseStatus(
  purchaseId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  stripePaymentIntentId?: string
) {
  try {
    const updateData: any = { status, updatedAt: new Date() };
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }

    await db.update(purchases).set(updateData).where(eq(purchases.id, purchaseId));
    console.log(`[updatePurchaseStatus] Updated purchase ${purchaseId} to ${status}`);
    revalidatePath('/admin/finance');
    return { success: true };
  } catch (error) {
    console.error('[updatePurchaseStatus] Error:', error);
    return { success: false, error: 'Failed to update purchase status' };
  }
}

/**
 * Called after Stripe payment succeeds.
 * Creates invoice + receipt, links them to the purchase, sends email notification.
 */
export async function completePurchase(purchaseId: string, paymentIntentId: string) {
  try {
    // Get the purchase
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, purchaseId)).limit(1);
    if (!purchase) return { success: false, error: 'Purchase not found' };
    if (purchase.status === 'completed') return { success: true, message: 'Already completed' };

    const amount = parseFloat(purchase.amount);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    // 1. Create invoice
    const [invoice] = await db.insert(invoices).values({
      clientId: purchase.userId,
      invoiceNumber,
      totalAmount: purchase.amount,
      amountPaid: purchase.amount,
      status: 'paid',
      currency: purchase.currency,
      issueDate: new Date(),
      paidAt: new Date(),
      notes: `Auto-generated from purchase: ${purchase.packageName} — ${purchase.serviceSlug}`,
    }).returning({ id: invoices.id });

    // 2. Add invoice item
    await db.insert(invoiceItems).values({
      invoiceId: invoice.id,
      title: `${purchase.packageName} — ${purchase.serviceSlug}`,
      description: `Productized package purchased via website checkout`,
      quantity: '1',
      unitPrice: purchase.amount,
      amount: purchase.amount,
    });

    // 3. Create receipt
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const [receipt] = await db.insert(receipts).values({
      invoiceId: invoice.id,
      receiptNumber,
      amountPaid: purchase.amount,
      paymentMethod: 'card',
      paymentReference: paymentIntentId,
    }).returning({ id: receipts.id });

    // 4. Link purchase to invoice + receipt, mark completed
    await db.update(purchases).set({
      status: 'completed',
      stripePaymentIntentId: paymentIntentId,
      invoiceId: invoice.id,
      receiptId: receipt.id,
      updatedAt: new Date(),
    }).where(eq(purchases.id, purchaseId));

    // 5. Get all admin users to notify them
    const admins = await db.select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.role, 'admin'));

    // 6. Send notification to all admins
    for (const admin of admins) {
      await db.insert(notifications).values({
        userId: admin.id,
        type: 'purchase_completed',
        title: `New Purchase: ${purchase.packageName}`,
        message: `${purchase.customerName} purchased ${purchase.packageName} for $${amount.toLocaleString()}`,
        link: `/admin/finance/invoice/${invoice.id}`,
      });
    }

    // 7. Send email confirmation to buyer
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: purchase.customerEmail,
        subject: `Receipt: ${purchase.packageName} — Bold Ideas`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A1128; padding: 32px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">BOLD IDEAS <span style="color: #ffffff;">INNOVATIONS</span></h1>
            </div>
            <div style="padding: 32px; background: #ffffff;">
              <h2 style="color: #0A1128; margin-top: 0;">Thank you for your purchase!</h2>
              <p style="color: #64748b;">Hi ${purchase.customerName},</p>
              <p style="color: #64748b;">Your purchase of <strong>${purchase.packageName}</strong> has been completed successfully.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Package</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${purchase.packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Receipt #</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${receiptNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${new Date().toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #64748b;">We'll be in touch within 1 business day to get started on your project.</p>
              <p style="color: #64748b;">If you have any questions, reply to this email or contact us at <a href="mailto:support@getboldideas.com" style="color: #D4AF37;">support@getboldideas.com</a>.</p>
            </div>
            <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Bold Ideas — Illinois & Wisconsin</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('[completePurchase] Failed to send email:', emailError);
      // Don't fail the whole operation if email fails
    }

    // 8. Send notification email to admin team
    const adminEmails = admins.map(a => a.email).filter(Boolean);
    for (const adminEmail of adminEmails) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL!,
          to: adminEmail,
          subject: `[Admin] New Purchase: ${purchase.packageName} — $${amount.toLocaleString()}`,
          html: `
            <div style="font-family: monospace; background: #0A1128; color: #fff; padding: 40px;">
              <h1 style="color: #D4AF37;">PURCHASE_COMPLETED</h1>
              <p>New productized package purchase received.</p>
              <pre style="background: #1a1a3e; padding: 20px; border-radius: 4px; color: #a8b2d1;">
Customer: ${purchase.customerName}
Email:    ${purchase.customerEmail}
Phone:    ${purchase.customerPhone || 'N/A'}
Package:  ${purchase.packageName}
Service:  ${purchase.serviceSlug}
Amount:   $${amount.toLocaleString()}
Receipt:  ${receiptNumber}
Payment:  ${paymentIntentId}
              </pre>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/finance/invoice/${invoice.id}" style="display: inline-block; background: #D4AF37; color: #0A1128; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 20px;">
                VIEW INVOICE
              </a>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('[completePurchase] Failed to send admin email:', emailError);
      }
    }

    revalidatePath('/admin/finance');
    revalidatePath(`/admin/finance/invoice/${invoice.id}`);

    // Log activity
    const { recordActivity } = await import('./activity');
    await recordActivity({
      userId: null,
      action: 'purchase_completed',
      details: {
        purchaseId: purchaseId.slice(0, 8),
        packageName: purchase.packageName,
        amount: purchase.amount,
        customerEmail: purchase.customerEmail,
      },
    });

    return { success: true, invoiceId: invoice.id, receiptId: receipt.id };
  } catch (error) {
    console.error('[completePurchase] Error:', error);
    return { success: false, error: 'Failed to complete purchase' };
  }
}
