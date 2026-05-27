import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { getPurchaseById } from '@/actions/purchases';

export default async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; purchase_id?: string }>;
}) {
  const { session_id, purchase_id } = await searchParams;

  if (!purchase_id) {
    redirect('/');
  }

  const { data: purchase } = await getPurchaseById(purchase_id);

  if (!purchase) {
    redirect('/');
  }

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

      {/* Success content */}
      <div className="mx-auto max-w-[640px] px-6 py-20 md:py-28">
        <div className="text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>

          <h1 className={`mt-6 text-3xl font-bold text-brand-navy md:text-4xl`}>
            Purchase Confirmed!
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Thank you for your purchase of <strong>{purchase.packageName}</strong>.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            A receipt has been sent to <strong>{purchase.customerEmail}</strong>.
          </p>
        </div>

        {/* Order summary */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-8">
          <h2 className={`text-lg font-bold text-brand-navy`}>Order Summary</h2>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Package</span>
              <span className="font-bold text-brand-navy">{purchase.packageName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Service</span>
              <span className="font-bold text-brand-navy capitalize">{purchase.serviceSlug.replace(/-/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="font-bold text-brand-navy">${parseFloat(purchase.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {purchase.status === 'completed' ? 'Completed' : 'Processing'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date</span>
              <span className="font-bold text-brand-navy">
                {new Date(purchase.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <Mail className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm leading-6 text-amber-800">
              We will be in touch within <strong>1 business day</strong> to get started on your project.
              Check your inbox (and spam folder) for your receipt email.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-brand-gold hover:text-brand-navy"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
