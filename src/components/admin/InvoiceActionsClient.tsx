'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/admin/PaymentModal';
import { Printer, Download, CreditCard, Receipt, Eye } from 'lucide-react';
import Link from 'next/link';

interface InvoiceActionsClientProps {
    invoiceId: string;
    invoiceNumber: string;
    totalAmount: string;
    amountPaid: string;
    currency: string;
    status: string;
    receiptId?: string | null;
}

export default function InvoiceActionsClient({
    invoiceId,
    invoiceNumber,
    totalAmount,
    amountPaid,
    currency,
    status,
    receiptId
}: InvoiceActionsClientProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const router = useRouter();

    const isPaid = status === 'paid';
    const outstanding = parseFloat(totalAmount) - parseFloat(amountPaid || '0');

    return (
        <>
            <div className="flex gap-3 flex-wrap">
                {/* Record Payment - Only show if not fully paid */}
                {!isPaid && (
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                        <CreditCard className="w-4 h-4" />
                        Record Payment
                    </button>
                )}

                {/* View Receipt - Only show if paid and receipt exists */}
                {isPaid && receiptId && (
                    <Link
                        href={`/admin/finance/receipt/${receiptId}`}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy rounded-lg text-sm font-medium hover:scale-105 transition-all shadow-lg"
                    >
                        <Receipt className="w-4 h-4" />
                        View Receipt
                    </Link>
                )}

                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
                >
                    <Printer className="w-4 h-4" />
                    Print
                </button>

                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-brand-gold rounded-lg text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-brand-navy/20"
                >
                    <Download className="w-4 h-4" />
                    Download PDF
                </button>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    invoiceId={invoiceId}
                    invoiceNumber={invoiceNumber}
                    totalAmount={totalAmount}
                    amountPaid={amountPaid}
                    currency={currency}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </>
    );
}
