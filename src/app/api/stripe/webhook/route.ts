import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { completePurchase, updatePurchaseStatus } from '@/actions/purchases';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event;
    try {
      event = getStripe().webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('[stripe-webhook] Signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;

        // Only process paid sessions
        if (session.payment_status !== 'paid') {
          console.log('[stripe-webhook] Session not yet paid, skipping');
          break;
        }

        const metadata = session.metadata || {};
        const paymentIntentId = session.payment_intent;

        // ──────────────────────────────────────
        // Invoice Payment Flow (admin-created invoices paid via Stripe)
        // ──────────────────────────────────────
        if (metadata.type === 'invoice_payment') {
          const invoiceId = metadata.invoiceId;
          if (!invoiceId) {
            console.error('[stripe-webhook] No invoiceId in session metadata for invoice payment');
            break;
          }

          console.log(`[stripe-webhook] Invoice payment received for invoice ${invoiceId}`);

          try {
            const { completeInvoicePayment } = await import('@/actions/purchases');
            const result = await completeInvoicePayment(invoiceId, paymentIntentId);
            if (!result.success) {
              console.error('[stripe-webhook] Failed to complete invoice payment:', result.error);
            } else {
              console.log('[stripe-webhook] Invoice payment completed successfully');
            }
          } catch (err: any) {
            console.error('[stripe-webhook] Error processing invoice payment:', err.message);
          }
          break;
        }

        // ──────────────────────────────────────
        // Purchase Flow (public product checkout)
        // ──────────────────────────────────────
        const purchaseId = metadata.purchaseId;

        if (!purchaseId) {
          console.error('[stripe-webhook] No purchaseId or invoiceId in session metadata');
          break;
        }

        console.log(`[stripe-webhook] Completing purchase ${purchaseId} with payment ${paymentIntentId}`);
        const result = await completePurchase(purchaseId, paymentIntentId);

        if (!result.success) {
          console.error('[stripe-webhook] Failed to complete purchase:', result.error);
        } else {
          console.log('[stripe-webhook] Purchase completed successfully');
        }
        break;
      }

      case 'checkout.session.expired': {
        const expiredSession = event.data.object as any;
        const expiredPurchaseId = expiredSession.metadata?.purchaseId;
        if (expiredPurchaseId) {
          await updatePurchaseStatus(expiredPurchaseId, 'failed');
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object as any;
        // Find associated purchase via metadata on the payment intent
        const failedPurchaseId = failedPayment.metadata?.purchaseId;
        if (failedPurchaseId) {
          await updatePurchaseStatus(failedPurchaseId, 'failed', failedPayment.id);
        }
        break;
      }

      default:
        const ev = event as any;
        // ── Billing meter events (logged for monitoring, no action needed) ──
        if (ev.type === 'v1.billing.meter.error_report_triggered') {
          console.log(`[stripe-webhook] Billing meter error report triggered: ${ev.data?.object?.meter_id || 'unknown'}`);
        } else if (ev.type === 'v1.billing.meter.no_meter_found') {
          console.log(`[stripe-webhook] No meter found: ${JSON.stringify(ev.data?.object)}`);
        } else {
          console.log(`[stripe-webhook] Unhandled event type: ${ev.type}`);
        }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[stripe-webhook] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
