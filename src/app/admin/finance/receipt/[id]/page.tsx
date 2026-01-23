import { getReceiptDetails, getCompanySettings } from '@/actions/financeEnhancements';
import { ChevronLeft, Printer, Download, CheckCircle2, Landmark, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReceiptActions from '@/components/admin/ReceiptActions';
import Image from 'next/image';

export const metadata = {
    title: "Receipt | Bold Ideas",
};

export default async function ReceiptPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const [{ data, success }, { data: settings }] = await Promise.all([
        getReceiptDetails(id),
        getCompanySettings()
    ]);

    if (!success || !data) {
        notFound();
    }

    const getCurrencySymbol = (currency: string | null) => {
        switch (currency) {
            case 'NGN': return '₦';
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    const currencySymbol = getCurrencySymbol(data.invoice?.currency);

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20 print:pb-0 print:space-y-0">
            {/* Navigation */}
            <div className="flex justify-between items-center no-print">
                <Link
                    href={`/admin/finance/invoice/${data.invoiceId}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-navy font-medium text-sm transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Invoice
                </Link>
                <ReceiptActions />
            </div>

            {/* Receipt Card */}
            <div className="bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden" id="receipt-content">
                {/* Header */}
                <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-[236px] h-24">
                                    <Image
                                        src={settings?.logoUrl || "/logo.png"}
                                        alt="Company Logo"
                                        fill
                                        className="!w-full !h-full object-fill mix-blend-multiply"
                                        style={{ objectFit: 'fill' }}
                                    />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-emerald-200">Receipt No.</p>
                                <p className="text-lg font-mono font-bold">{data.receiptNumber}</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-xs uppercase tracking-widest text-emerald-200 mb-1">Amount Paid</p>
                            <div className="text-5xl font-bold">
                                {currencySymbol}{parseFloat(data.amountPaid).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Details */}
                <div className="p-8 space-y-8">
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Payment For</p>
                                <p className="font-bold text-slate-800">Invoice {data.invoice?.invoiceNumber || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Payment Date</p>
                                <p className="font-bold text-slate-800 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {data.issuedAt ? new Date(data.issuedAt).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                                <p className="font-bold text-slate-800 flex items-center gap-2 capitalize">
                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                    {data.paymentMethod?.replace('_', ' ') || 'Bank Transfer'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Transaction ID</p>
                                <p className="font-mono font-bold text-slate-600">{data.paymentReference || data.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-900 leading-none">Payment Successfully Processed</p>
                            <p className="text-xs text-emerald-600 mt-1">This document serves as official confirmation of funds received.</p>
                        </div>
                    </div>

                    {/* Signature and Company Footer */}
                    <div className="pt-8 flex justify-between items-end border-t border-slate-100">
                        <div className="space-y-4">
                            <div className="relative w-[236px] h-24">
                                <Image
                                    src={settings?.logoUrl || "/logo.png"}
                                    alt="Logo"
                                    fill
                                    className="!w-full !h-full object-fill"
                                    style={{ objectFit: 'fill' }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 max-w-[200px]">
                                {settings?.companyName}<br />
                                {settings?.companyAddress || "Digital Innovation Agency"}<br />
                                {settings?.companyEmail || "hq@boldideas.agency"}
                            </p>
                        </div>
                        <div className="text-center space-y-1">
                            {/* Digital Signature */}
                            {settings?.signatureUrl ? (
                                <div className="h-12 w-40 relative mb-[-10px]">
                                    <Image src={settings.signatureUrl} alt="Signature" fill className="object-contain" />
                                </div>
                            ) : (
                                <div className="font-signature text-2xl text-slate-800 mb-[-10px] opacity-80 select-none">
                                    {settings?.companyName?.slice(0, 10).toUpperCase() || "BOLD_IDEAS"}
                                </div>
                            )}
                            <div className="w-40 border-t-2 border-slate-200 mx-auto"></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        size: A4;
                        margin: 0;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                        background: white;
                    }

                    body { 
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    aside, nav, .no-print { 
                        display: none !important; 
                    }
                    
                    main { 
                        margin: 0 !important;
                        padding: 20mm 15mm !important;
                        width: 210mm !important;
                        max-width: 210mm !important;
                        box-sizing: border-box !important;
                    }
                    
                    #receipt-content { 
                        box-shadow: none !important; 
                        border: none !important; 
                        border-radius: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        background: white !important;
                    }

                    /* Aggressive spacing reduction for print */
                    .p-8 { padding: 1.5rem !important; }
                    .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem !important; }
                    .mt-8 { margin-top: 1rem !important; }
                    .pt-8 { padding-top: 1rem !important; }
                    .gap-8 { gap: 1rem !important; }
                    .mb-4 { margin-bottom: 0.5rem !important; }
                    
                    /* Ensure backgrounds and colors show in print */
                    .bg-emerald-600 { background-color: #059669 !important; }
                    .bg-emerald-50 { background-color: #ecfdf5 !important; }
                    .bg-emerald-500 { background-color: #10b981 !important; }
                    .border-emerald-100 { border-color: #d1fae5 !important; }
                    .text-emerald-100 { color: #d1fae5 !important; }
                    .text-emerald-200 { color: #a7f3d0 !important; }
                    .text-emerald-600 { color: #059669 !important; }
                    .text-emerald-900 { color: #064e3b !important; }
                    .text-white { color: #ffffff !important; }
                }
                
                /* Simple signature font effect */
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
                .font-signature {
                    font-family: 'Caveat', cursive;
                }
            `}} />
        </div>
    );
}
