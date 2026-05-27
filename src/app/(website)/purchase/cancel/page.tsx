import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default async function PurchaseCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase_id?: string }>;
}) {
  const { purchase_id } = await searchParams;

  return (
    <main className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="bg-brand-navy py-6">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <Link href="/" className={`text-xl font-bold text-white`}>
            Bold <span className="text-brand-gold">Ideas</span>
          </Link>
        </div>
      </div>

      {/* Cancel content */}
      <div className="mx-auto max-w-[640px] px-6 py-20 md:py-28">
        <div className="text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <XCircle className="h-10 w-10 text-amber-600" />
          </div>

          <h1 className={`mt-6 text-3xl font-bold text-brand-navy md:text-4xl`}>
            Purchase Not Completed
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Your payment was not processed. No charges have been made.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            If you experienced an issue during checkout, you can try again or contact us for assistance.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-brand-gold hover:text-brand-navy"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-brand-navy transition hover:text-brand-gold"
          >
            Need help? Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
