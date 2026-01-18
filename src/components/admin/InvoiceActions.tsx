'use client';

import { Printer, Download } from 'lucide-react';

export default function InvoiceActions() {
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
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-brand-gold rounded text-xs font-medium hover:scale-105 transition-all shadow-lg shadow-brand-navy/20"
            >
                <Download className="w-3 h-3" />
                Download PDF
            </button>
        </div>
    );
}
