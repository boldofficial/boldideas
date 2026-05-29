'use client';

import { useState } from 'react';
import { CreditCard, ExternalLink, Loader2 } from 'lucide-react';

interface PayInvoiceButtonProps {
  invoiceId: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  disabled?: boolean;
  label?: string;
}

export default function PayInvoiceButton({
  invoiceId,
  amount,
  currency,
  invoiceNumber,
  disabled = false,
  label = 'Pay Now',
}: PayInvoiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/create-invoice-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handlePay}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-gold text-brand-navy rounded-xl text-lg font-black hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Opening Stripe Checkout...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6" />
            {label}
            <ExternalLink className="w-4 h-4 opacity-60" />
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 font-medium">
          {error}
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-center">
        Secured by Stripe · Your card info is never stored on our servers
      </p>
    </div>
  );
}
