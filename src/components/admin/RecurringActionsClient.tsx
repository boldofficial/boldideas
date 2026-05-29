'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface RecurringActionsClientProps {
    invoiceId: string;
    isRecurring: boolean;
}

export default function RecurringActionsClient({ invoiceId, isRecurring }: RecurringActionsClientProps) {
    const [showForm, setShowForm] = useState(false);
    const [frequency, setFrequency] = useState<string>('monthly');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEnable = async () => {
        setLoading(true);
        try {
            const { enableRecurringInvoice } = await import('@/actions/recurringInvoices');
            const result = await enableRecurringInvoice(invoiceId, frequency as any, endDate || null);
            if (result.success) {
                toast.success(`Recurring enabled — next invoice on ${new Date(result.nextDate!).toLocaleDateString()}`);
                setShowForm(false);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to enable recurring');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to enable recurring');
        }
        setLoading(false);
    };

    const handleDisable = async () => {
        setLoading(true);
        try {
            const { disableRecurringInvoice } = await import('@/actions/recurringInvoices');
            const result = await disableRecurringInvoice(invoiceId);
            if (result.success) {
                toast.success('Recurring disabled');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to disable recurring');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to disable recurring');
        }
        setLoading(false);
    };

    if (isRecurring) {
        return (
            <button
                onClick={handleDisable}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-rose-100 transition-all disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                {loading ? 'Disabling...' : 'Disable Recurring'}
            </button>
        );
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-navy text-brand-gold border border-brand-navy rounded text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-all"
            >
                <RefreshCw className="w-3 h-3" />
                Set as Recurring
            </button>
        );
    }

    return (
        <div className="space-y-3 p-3 bg-white border border-slate-200 rounded-lg">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Configure Recurring</p>
            <div className="space-y-2">
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly (every 3 months)</option>
                    <option value="yearly">Yearly</option>
                    <option value="bi-weekly">Bi-Weekly (every 2 weeks)</option>
                </select>
                <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        End Date (optional)
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleEnable}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    {loading ? 'Enabling...' : 'Enable'}
                </button>
                <button
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
