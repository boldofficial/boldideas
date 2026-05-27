'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/admin/PaymentModal';
import Link from 'next/link';
import EditInvoiceModal from './EditInvoiceModal';
import { Printer, Download, CreditCard, Receipt, Settings } from 'lucide-react';

interface InvoiceActionsClientProps {
    invoice: any;
    clients: any[];
    receiptId?: string | null;
}

export default function InvoiceActionsClient({
    invoice,
    clients,
    receiptId
}: InvoiceActionsClientProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const router = useRouter();

    const isPaid = invoice.status === 'paid';
    const outstanding = parseFloat(invoice.totalAmount || '0') - parseFloat(invoice.amountPaid || '0');

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

                <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-brand-gold rounded-lg text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-brand-navy/20"
                >
                    <Settings className="w-4 h-4" />
                    Edit Invoice
                </button>

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
                    invoiceId={invoice.id}
                    invoiceNumber={invoice.invoiceNumber || ''}
                    totalAmount={invoice.totalAmount || '0'}
                    amountPaid={invoice.amountPaid || '0'}
                    currency={invoice.currency || 'USD'}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => router.refresh()}
                />
            )}

            {showEditModal && (
                <EditInvoiceModal
                    invoice={invoice}
                    clients={clients}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </>
    );
}
