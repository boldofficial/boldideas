'use client';

import { useState } from 'react';
import { Printer, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoiceActions() {
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleDownloadPdf = async () => {
        setPdfLoading(true);
        try {
            const { downloadElementAsPdf } = await import('@/lib/downloadPdf');
            await downloadElementAsPdf('invoice-payload', 'invoice');
        } catch (err: any) {
            toast.error(err.message || 'Failed to download PDF');
        }
        setPdfLoading(false);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-all shadow-sm"
            >
                <Printer className="w-3 h-3" />
                Print
            </button>
            <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-brand-gold rounded text-xs font-medium hover:scale-105 transition-all shadow-lg shadow-brand-navy/20 disabled:opacity-50"
            >
                {pdfLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                {pdfLoading ? 'Generating...' : 'Download PDF'}
            </button>
        </div>
    );
}
