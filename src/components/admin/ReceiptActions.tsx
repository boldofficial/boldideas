'use client';

import { Printer } from 'lucide-react';

export default function ReceiptActions() {
    return (
        <div className="flex gap-3">
            <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
            >
                <Printer className="w-4 h-4" />
                Print
            </button>
        </div>
    );
}
