import { getInvoiceDetails, getClients } from '@/actions/finance';
import { getReceiptByInvoice, getPaymentsByInvoice, getCompanySettings } from '@/actions/financeEnhancements';
import { ChevronLeft, Download, Printer, CheckCircle2, AlertCircle, Clock, FileText, Globe, Mail, Phone, Landmark } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import InvoiceActionsClient from '@/components/admin/InvoiceActionsClient';
import Image from 'next/image';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const [{ data: invoice, success }, { data: receipt }, { data: payments }, { data: settings }, { data: clients }] = await Promise.all([
        getInvoiceDetails(id),
        getReceiptByInvoice(id),
        getPaymentsByInvoice(id),
        getCompanySettings(),
        getClients()
    ]);

    if (!success || !invoice) {
        notFound();
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'paid': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'partial': return 'text-amber-500 bg-amber-50 border-amber-100';
            case 'overdue': return 'text-rose-500 bg-rose-50 border-rose-100';
            case 'sent': return 'text-blue-500 bg-blue-50 border-blue-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    const getCurrencySymbol = (currency: string | null) => {
        switch (currency) {
            case 'NGN': return '₦';
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Navigation & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <Link
                    href="/admin/finance"
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-navy font-medium text-sm transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Finance
                </Link>
                <InvoiceActionsClient
                    invoice={invoice}
                    clients={clients || []}
                    receiptId={receipt?.id}
                />
            </div>

            {/* Main Invoice Card */}
            <div className="bg-white border border-slate-200 shadow-2xl rounded-sm overflow-hidden relative" id="invoice-payload">
                {/* Visual Header */}
                <div className="h-3 bg-brand-navy"></div>

                <div className="p-12 space-y-12">
                    {/* Header: Company Info vs Invoice Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                            <div className="relative w-[236px] h-24">
                            <Image
                                src={settings?.logoUrl || "/logo.png"}
                                alt="Company Logo"
                                fill
                                className="!w-full !h-full object-fill"
                                style={{ objectFit: 'fill' }}
                            />
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest space-y-1">
                                <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-brand-gold" /> {settings?.companyWebsite || "boldideas.agency"}</div>
                                <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-brand-gold" /> {settings?.companyEmail || "HQ@boldideas.agency"}</div>
                            </div>
                        </div>

                        <div className="text-right space-y-2">
                            <h1 className="text-5xl font-black text-brand-navy tracking-tighter">INVOICE</h1>
                            <div className="font-mono text-lg font-bold text-brand-gold uppercase tracking-widest">#{invoice.invoiceNumber || invoice.id.slice(0, 8)}</div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mt-2 ${getStatusStyles(invoice.status || 'draft')}`}>
                                {invoice.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {invoice.status}
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Metadata Grid */}
                    <div className="grid md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-1">Client Information</h4>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-brand-navy uppercase">{invoice.client?.name || 'Anonymous Client'}</p>
                                <p className="text-xs font-medium text-slate-500">{invoice.client?.email || 'client@email.com'}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-1">Dates</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Issue Date</p>
                                    <p className="text-xs font-bold text-brand-navy">{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-rose-400 uppercase">Due Date</p>
                                    <p className="text-xs font-bold text-rose-600">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'OPEN'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-1">Payment Instructions</h4>
                            <div className="space-y-2">
                                <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[10px] text-slate-500 font-medium leading-relaxed">
                                    Please include invoice number {invoice.invoiceNumber || invoice.id.slice(0, 8)} in your payment reference.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table Section */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Line Items & Services</h4>
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="pb-4 text-left">Description</th>
                                    <th className="pb-4 text-center">Qty</th>
                                    <th className="pb-4 text-right">Unit Price</th>
                                    <th className="pb-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoice.items?.length > 0 ? invoice.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 pr-4">
                                            <div className="text-sm font-bold text-brand-navy">{item.title || "Professional Services"}</div>
                                            {item.description && (
                                                <div className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{item.description}</div>
                                            )}
                                        </td>
                                        <td className="py-6 text-center text-sm font-bold text-slate-500">{item.quantity}</td>
                                        <td className="py-6 text-right text-sm font-bold text-brand-navy font-mono">{getCurrencySymbol(invoice.currency)}{Number(item.unitPrice).toLocaleString()}</td>
                                        <td className="py-6 text-right text-sm font-black text-brand-navy font-mono">{getCurrencySymbol(invoice.currency)}{Number(item.amount).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td className="py-6 pr-4">
                                            <div className="text-sm font-bold text-brand-navy">Professional Services</div>
                                        </td>
                                        <td className="py-6 text-center text-sm font-bold text-slate-500">1</td>
                                        <td className="py-6 text-right text-sm font-bold text-brand-navy font-mono">{getCurrencySymbol(invoice.currency)}{Number(invoice.totalAmount).toLocaleString()}</td>
                                        <td className="py-6 text-right text-sm font-black text-brand-navy font-mono">{getCurrencySymbol(invoice.currency)}{Number(invoice.totalAmount).toLocaleString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-start pt-12 border-t border-slate-100 gap-8">
                        <div className="max-w-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notes</h4>
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                {invoice.notes || 'No additional notes.'}
                            </p>
                        </div>
                        <div className="w-full md:w-64 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                                <span>Subtotal</span>
                                <span>{getCurrencySymbol(invoice.currency)}{Number(invoice.totalAmount || 0).toLocaleString()}</span>
                            </div>
                            {Number(invoice.discountAmount || 0) > 0 && (
                                <div className="flex justify-between items-center text-[10px] font-black text-rose-500 uppercase">
                                    <span>Discount ({invoice.discountType === 'percentage' ? 'Percentage' : 'Fixed'})</span>
                                    <span>-{getCurrencySymbol(invoice.currency)}{Number(invoice.discountAmount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-[10px] font-black text-brand-gold uppercase">
                                <span>Tax (0%)</span>
                                <span>$0.00</span>
                            </div>
                            <div className="pt-4 border-t-2 border-brand-navy flex justify-between items-end">
                                <div className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Total Amount</div>
                                <div className="text-3xl font-black text-brand-navy italic tracking-tighter">
                                    <span className="text-slate-300 mr-2">{getCurrencySymbol(invoice.currency)}</span>
                                    {Number(invoice.totalAmount).toLocaleString()}
                                </div>
                            </div>

                            {/* Payment Status Info if partially paid */}
                            {invoice.status === 'partial' && (
                                <div className="pt-2 text-right">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Amount Paid: {getCurrencySymbol(invoice.currency)}{Number(invoice.amountPaid).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-rose-600 uppercase">Balance Due: {getCurrencySymbol(invoice.currency)}{(Number(invoice.totalAmount) - Number(invoice.amountPaid)).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Signature Block */}
                    <div className="pt-12 flex justify-end">
                        <div className="text-center space-y-1">
                            {settings?.signatureUrl ? (
                                <div className="h-16 w-48 relative mb-[-10px]">
                                    <Image src={settings.signatureUrl} alt="Signature" fill className="object-contain" />
                                </div>
                            ) : (
                                <div className="font-signature text-3xl text-slate-800 mb-[-12px] opacity-90 select-none">
                                    {settings?.companyName?.slice(0, 10).toUpperCase() || "BOLD_IDEAS"}
                                </div>
                            )}
                            <div className="w-48 border-t-2 border-slate-200 mx-auto"></div>
                            <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">Authorized Signature</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-12 text-center border-t border-slate-100">
                        <p className="text-[8px] font-mono text-slate-400 uppercase tracking-[0.5em]">Bold Ideas Official Transmission // Digital Secure Infrastructure</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    
                    @page { 
                        size: A4;
                        margin: 0 !important;
                    }
                    
                    html, body {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }

                    body { 
                        background: white !important; 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important;
                    }

                    aside, nav, .no-print { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; width: 100% !important; display: block !important; }
                    
                    #invoice-payload { 
                        box-shadow: none !important; 
                        border: none !important; 
                        border-radius: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        margin: 0 !important;
                        padding: 15mm !important;
                        box-sizing: border-box !important;
                        position: relative !important;
                        background: white !important;
                    }
                    
                    /* Force visibility of brand elements */
                    .bg-brand-navy { background-color: #001f3f !important; }
                    .text-brand-navy { color: #001f3f !important; }
                    .text-brand-gold { color: #D4AF37 !important; }
                    
                    /* Tighten spacing for A4 fit */
                    .p-12 { padding: 0 !important; }
                    .gap-12 { gap: 2rem !important; }
                    .pt-12 { pt-8 !important; }
                }
                
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
                .font-signature {
                    font-family: 'Caveat', cursive;
                }
            `}} />
        </div>
    );
}
