'use client';

import { Printer, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ReceiptActionsProps {
    receiptNumber: string;
}

export default function ReceiptActions({ receiptNumber }: ReceiptActionsProps) {
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleDownloadPdf = async () => {
        setPdfLoading(true);
        try {
            const { downloadElementAsPdf } = await import('@/lib/downloadPdf');
            await downloadElementAsPdf(
                'receipt-content',
                receiptNumber || 'receipt',
                `Receipt ${receiptNumber}`
            );
        } catch (error) {
            console.error('[ReceiptActions] PDF download failed:', error);
            toast({
                title: 'Download failed',
                description: 'Could not generate PDF. Please try printing instead.',
                variant: 'destructive',
            });
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {pdfLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                {pdfLoading ? 'Generating...' : 'Download PDF'}
            </button>
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
