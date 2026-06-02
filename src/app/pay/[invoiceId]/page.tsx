import { getPublicInvoiceDetails } from '@/actions/finance';
import { getCompanySettings } from '@/actions/financeEnhancements';
import { notFound } from 'next/navigation';
import PayInvoiceButton from '@/components/pay/PayInvoiceButton';
import { CheckCircle2, AlertCircle, Clock, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Pay Invoice | Bold Ideas",
};

export default async function PayInvoicePage({
  params,
  searchParams,
}: {
  params: { invoiceId: string };
  searchParams: { success?: string; canceled?: string };
}) {
  const { invoiceId } = await params;
  const searchParamsResolved = await searchParams;
  const { data: _invoice, success } = await getPublicInvoiceDetails(invoiceId);
  const { data: settings } = await getCompanySettings();

  if (!success || !_invoice) {
    notFound();
  }

  const invoice = _invoice as typeof _invoice & {
    id: string;
    invoiceNumber: string | null;
    status: string | null;
    totalAmount: string | null;
    amountPaid: string | null;
    currency: string | null;
    dueDate: string | Date | null;
    paidAt: string | Date | null;
    notes: string | null;
  };

  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';
  const showSuccess = searchParamsResolved?.success === 'true';

  const getCurrencySymbol = (currency: string | null) => {
    switch (currency) {
      case 'NGN': return '₦';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const totalAmount = parseFloat(invoice.totalAmount || '0');
  const amountPaid = parseFloat(invoice.amountPaid || '0');
  const outstanding = totalAmount - amountPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy">
      {/* Subtle Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow Effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-400">Payment Successful!</h3>
                <p className="text-xs text-emerald-300/70">Thank you for your payment. A receipt has been generated.</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold text-xs font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Bold Ideas
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Brand Bar */}
          <div className="h-2 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-navy" />

          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center mx-auto shadow-lg shadow-brand-navy/20">
                <span className="text-brand-gold font-black text-xl">BI</span>
              </div>
              <h1 className="text-2xl font-black text-brand-navy tracking-tight">
                {settings?.companyName || 'Bold Ideas'}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Invoice Payment Portal
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              {isPaid ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Paid</span>
                </div>
              ) : isOverdue ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Overdue</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Pending</span>
                </div>
              )}
            </div>

            {/* Invoice Info */}
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice</p>
                <p className="text-lg font-black text-brand-navy font-mono">
                  #{invoice.invoiceNumber || invoice.id.slice(0, 8)}
                </p>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client</p>
                  <p className="text-sm font-bold text-brand-navy mt-1">
                    {invoice.client?.name || invoice.client?.email || 'Client'}
                  </p>
                  {invoice.client?.email && (
                    <p className="text-[10px] text-slate-500">{invoice.client.email}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                  <p className={`text-sm font-bold mt-1 ${isOverdue ? 'text-rose-600' : 'text-brand-navy'}`}>
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) : 'Open'}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isPaid ? 'Amount Paid' : 'Total Due'}
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl text-slate-300 font-black">{getCurrencySymbol(invoice.currency)}</span>
                <span className="text-5xl font-black text-brand-navy tracking-tight">
                  {(isPaid ? totalAmount : outstanding).toLocaleString()}
                </span>
              </div>
              {invoice.status === 'partial' && (
                <p className="text-xs text-emerald-600 font-medium">
                  {getCurrencySymbol(invoice.currency)}{amountPaid.toLocaleString()} already paid
                </p>
              )}
            </div>

            {/* Line Items Preview */}
            {invoice.items?.length > 0 && (
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Services</p>
                <div className="divide-y divide-slate-100">
                  {invoice.items.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-2">
                      <div>
                        <p className="text-xs font-bold text-brand-navy">{item.title || 'Service'}</p>
                        {item.description && (
                          <p className="text-[10px] text-slate-400">{item.description}</p>
                        )}
                      </div>
                      <p className="text-xs font-black text-brand-navy">
                        {getCurrencySymbol(invoice.currency)}{Number(item.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {invoice.items.length > 3 && (
                    <p className="text-[10px] text-slate-400 pt-2">
                      +{invoice.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                <p className="text-xs text-slate-500 italic">{invoice.notes}</p>
              </div>
            )}

            {/* Pay Button */}
            {!isPaid && (
              <PayInvoiceButton
                invoiceId={invoice.id}
                amount={outstanding}
                currency={invoice.currency || 'USD'}
                invoiceNumber={invoice.invoiceNumber || ''}
              />
            )}

            {/* Already Paid Message */}
            {isPaid && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-700">This invoice has been paid</p>
                <p className="text-xs text-emerald-600/70 mt-1">
                  {invoice.paidAt ? `Paid on ${new Date(invoice.paidAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-medium">256-bit SSL Encrypted Connection</span>
          </div>
          <p className="text-[9px] text-slate-600/50 font-mono">
            &copy; {new Date().getFullYear()} {settings?.companyName || 'Bold Ideas'} · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
