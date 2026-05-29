'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/admin/PaymentModal';
import Link from 'next/link';
import EditInvoiceModal from './EditInvoiceModal';
import { Printer, Download, CreditCard, Receipt, Settings, ExternalLink, Loader2, Copy, Check, Send, Mail } from 'lucide-react';
import { toast } from 'sonner';

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
    const [generatingLink, setGeneratingLink] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [copied, setCopied] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const router = useRouter();

    const isPaid = invoice.status === 'paid';
    const hasStripeLink = !!invoice.stripePaymentLink;
    const outstanding = parseFloat(invoice.totalAmount || '0') - parseFloat(invoice.amountPaid || '0');

    const handleGenerateStripeLink = async () => {
        setGeneratingLink(true);
        try {
            const res = await fetch('/api/stripe/create-invoice-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId: invoice.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate payment link');
            router.refresh();
            if (data.url) {
                window.open(data.url, '_blank');
            }
            toast.success('Payment link generated!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate Stripe payment link');
        }
        setGeneratingLink(false);
    };

    const handleCopyPaymentLink = async () => {
        if (!invoice.stripePaymentLink) return;
        try {
            await navigator.clipboard.writeText(invoice.stripePaymentLink);
            setCopied(true);
            toast.success('Payment link copied!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleSendInvoiceEmail = async () => {
        setSendingEmail(true);
        try {
            const { sendInvoiceEmail } = await import('@/actions/finance');
            const result = await sendInvoiceEmail(invoice.id);
            if (result.success) {
                setEmailSent(true);
                toast.success('Invoice emailed to client!');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to send invoice email');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to send invoice email');
        }
        setSendingEmail(false);
    };

    return (
        <>
            <div className="flex gap-3 flex-wrap">
                {/* Send Invoice via Email */}
                <button
                    onClick={handleSendInvoiceEmail}
                    disabled={sendingEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy rounded-lg text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-brand-gold/30 disabled:opacity-50"
                >
                    {sendingEmail ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : emailSent ? (
                        <Mail className="w-4 h-4" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {sendingEmail ? 'Sending...' : emailSent ? 'Sent!' : 'Send Invoice'}
                </button>

                {/* Stripe Payment Link Section */}
                {!isPaid && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleGenerateStripeLink}
                            disabled={generatingLink}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {generatingLink ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CreditCard className="w-4 h-4" />
                            )}
                            {hasStripeLink ? 'Regenerate Link' : 'Pay via Stripe'}
                        </button>
                        {hasStripeLink && (
                            <button
                                onClick={handleCopyPaymentLink}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-all"
                                title="Copy payment link"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        )}
                    </div>
                )}

                {/* Record Manual Payment - Only show if not fully paid */}
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

                {/* Public Payment Page Link */}
                {!isPaid && invoice.stripePaymentLink && (
                    <Link
                        href={`/pay/${invoice.id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Payment Page
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
                    onClick={async () => {
                        setDownloadingPdf(true);
                        try {
                            const { downloadElementAsPdf } = await import('@/lib/downloadPdf');
                            await downloadElementAsPdf('invoice-payload', invoice.invoiceNumber || invoice.id.slice(0, 8).toUpperCase());
                        } catch (err: any) {
                            toast.error(err.message || 'Failed to download PDF');
                        }
                        setDownloadingPdf(false);
                    }}
                    disabled={downloadingPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-brand-gold rounded-lg text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-brand-navy/20 disabled:opacity-50"
                >
                    {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {downloadingPdf ? 'Generating...' : 'Download PDF'}
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
