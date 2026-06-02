import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createPurchase, updatePurchaseStripeSession } from '@/actions/purchases';

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

    const setupAmount = Number(amount || 0);
    const recurringAmount = Number(monthlyPrice || 0);

    if (!serviceSlug || !packageName || !packageSlug || (!setupAmount && !recurringAmount) || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceSlug, packageName, packageSlug, amount, customerName, customerEmail' },
        { status: 400 }
      );
    }

    const isRecurring = recurringAmount > 0;
    const initialChargeAmount = isRecurring ? setupAmount + recurringAmount : setupAmount;
    const metadata = {
      type: 'website_purchase',
      serviceSlug,
      packageName,
      packageSlug,
    };

    const lineItems: any[] = isRecurring
      ? [
          ...(setupAmount > 0
            ? [{
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: `${packageName} setup - ${serviceSlug.replace(/-/g, ' ')}`,
                    description: 'One-time Bold Ideas setup fee',
                  },
                  unit_amount: Math.round(setupAmount * 100),
                },
                quantity: 1,
              }]
            : []),
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${packageName} monthly care - ${serviceSlug.replace(/-/g, ' ')}`,
                description: 'Bold Ideas recurring monthly service',
              },
              unit_amount: Math.round(recurringAmount * 100),
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${packageName} - ${serviceSlug.replace(/-/g, ' ')}`,
                description: 'Bold Ideas productized package',
              },
              unit_amount: Math.round(setupAmount * 100),
            },
            quantity: 1,
          },
        ];

    const { success, id: purchaseId } = await createPurchase({
      serviceSlug,
      packageName,
      amount: String(initialChargeAmount),
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      userId: userId || null,
    });

    if (!success || !purchaseId) {
      return NextResponse.json({ error: 'Failed to create purchase record' }, { status: 500 });
    }

    const fullMetadata = {
      ...metadata,
      purchaseId,
    };

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: lineItems,
      customer_email: customerEmail,
      metadata: fullMetadata,
      ...(isRecurring
        ? { subscription_data: { metadata: fullMetadata } }
        : { payment_intent_data: { metadata: fullMetadata } }),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}&purchase_id=${purchaseId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/cancel?purchase_id=${purchaseId}`,
    });

    await updatePurchaseStripeSession(purchaseId, session.id);

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
