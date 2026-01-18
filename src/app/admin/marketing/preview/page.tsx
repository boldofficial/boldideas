'use client';

import { useSearchParams } from 'next/navigation';

export default function MarketingPreviewPage() {
    const searchParams = useSearchParams();
    const content = searchParams.get('content') || '';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-brand-navy p-4 text-white flex justify-between items-center shadow-lg">
                <span className="text-xs font-black uppercase tracking-widest italic">Neural_Transmission_Sandbox</span>
                <span className="text-[10px] font-mono opacity-50">PREVIEW_MODE_ACTIVE</span>
            </div>
            <div className="flex-1 p-8 flex justify-center">
                <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div
                        className="p-8 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>
        </div>
    );
}
