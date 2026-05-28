import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createPurchase } from '@/actions/purchases';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      serviceSlug,
      packageName,
      packageSlug,
      amount,
      monthlyPrice,
      customerName,
      customerEmail,
      customerPhone,
      userId,
    } = body;

    // Validate required fields
    if (!serviceSlug || !packageName || !packageSlug || !amount || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceSlug, packageName, packageSlug, amount, customerName, customerEmail' },
        { status: 400 }
      );
    }

    // Determine if this is a one-time or recurring payment
    const isRecurring = monthlyPrice > 0;

    // 1. Create a pending purchase record
    const { success, id: purchaseId } = await createPurchase({
      serviceSlug,
      packageName,
      amount: String(amount),
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      userId: userId || null,
    });

    if (!success || !purchaseId) {
      return NextResponse.json({ error: 'Failed to create purchase record' }, { status: 500 });
    }

    // 2. Create Stripe Checkout Session
    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageName} — ${serviceSlug.replace(/-/g, ' ')}`,
              description: `Bold Ideas productized package`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
            ...(isRecurring && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        purchaseId,
        serviceSlug,
        packageName,
        packageSlug,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}&purchase_id=${purchaseId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/cancel?purchase_id=${purchaseId}`,
    };

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      purchaseId,
    });
  } catch (error: any) {
    console.error('[create-checkout-session] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
