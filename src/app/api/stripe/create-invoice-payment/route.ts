import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { invoices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 });
    }

    // Get invoice
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Don't allow payment on already paid invoices
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice is already paid' }, { status: 400 });
    }

    const amount = parseFloat(invoice.totalAmount || '0');
    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid invoice amount' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const currency = (invoice.currency || 'USD').toLowerCase();

    // If there's already an active Stripe session, reuse it
    if (invoice.stripeSessionId) {
      try {
        const existingSession = await getStripe().checkout.sessions.retrieve(invoice.stripeSessionId);
        if (existingSession.url && (existingSession.status === 'open' || existingSession.status === 'expired')) {
          // If expired, create new one
          if (existingSession.status === 'open') {
            return NextResponse.json({ url: existingSession.url, sessionId: existingSession.id });
          }
        }
      } catch {
        // Session not found or expired, create a new one
      }
    }

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Invoice ${invoice.invoiceNumber || invoiceId.slice(0, 8)}`,
              description: `Bold Ideas — Invoice Payment`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'invoice_payment',
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber || '',
      },
      payment_intent_data: {
        metadata: {
          type: 'invoice_payment',
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber || '',
        },
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Invoice ${invoice.invoiceNumber || invoiceId.slice(0, 8)} — Bold Ideas`,
          metadata: {
            type: 'invoice_payment',
            invoiceId: invoice.id,
          },
        },
      },
      success_url: `${appUrl}/pay/${invoiceId}?success=true`,
      cancel_url: `${appUrl}/pay/${invoiceId}`,
    });

    // Save session ID and payment link on invoice
    await db.update(invoices).set({
      stripeSessionId: session.id,
      stripePaymentLink: session.url || null,
      updatedAt: new Date(),
    }).where(eq(invoices.id, invoiceId));

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('[create-invoice-payment] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
