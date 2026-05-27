import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * Thin Event Webhook Handler
 *
 * Stripe thin events (v2 API) have a different payload structure from snapshot events (v1).
 * Thin events deliver lightweight notifications with `related_object` instead of `data.object`.
 * To fetch the complete event, use `stripe.v2.core.events.retrieve(event.id)`.
 *
 * Events handled here:
 *   - v2.core.account_link.returned  →  User returned from Stripe account link flow
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: any;
    try {
      // constructEvent works for both snapshot and thin events
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_THIN_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('[stripe-thin-webhook] Signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Log the event for monitoring
    console.log(`[stripe-thin-webhook] Received event: ${event.type}`, {
      id: event.id,
      relatedObject: event.related_object,
    });

    switch (event.type) {
      case 'v2.core.account_link.returned': {
        const relatedObject = event.related_object as any;
        console.log(`[stripe-thin-webhook] Account link returned for account: ${relatedObject?.id || 'unknown'}`);
        // User completed (or exited) the Stripe account link flow
        // No automatic action needed — this is informational
        break;
      }

      default:
        console.log(`[stripe-thin-webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[stripe-thin-webhook] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
