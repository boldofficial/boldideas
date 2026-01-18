'use client';

import { useState } from 'react';
import { recordPayment } from '@/actions/financeEnhancements';
import { CreditCard, DollarSign, X, Check, Wallet, Building2, Banknote, Bitcoin } from 'lucide-react';

interface PaymentModalProps {
    invoiceId: string;
    invoiceNumber: string;
    totalAmount: string;
    amountPaid: string;
    currency: string;
    onClose: () => void;
    onSuccess: () => void;
}

const paymentMethods = [
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'other', label: 'Other', icon: Wallet },
];

export default function PaymentModal({
    invoiceId,
    invoiceNumber,
    totalAmount,
    amountPaid,
    currency,
    onClose,
    onSuccess
}: PaymentModalProps) {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('bank_transfer');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const outstanding = parseFloat(totalAmount) - parseFloat(amountPaid || '0');
    const currencySymbol = currency === 'NGN' ? '₦' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setIsSubmitting(true);
        const result = await recordPayment({
            invoiceId,
            amount,
            paymentMethod: method,
            notes: notes || undefined,
        });

        if (result.success) {
            onSuccess();
            onClose();
        } else {
            alert(result.error || 'Failed to record payment');
        }
        setIsSubmitting(false);
    };

    const payFull = () => setAmount(outstanding.toString());

    return (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-brand-navy to-slate-800 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">Record Payment</h2>
                    <p className="text-sm text-slate-300 mt-1">Invoice {invoiceNumber}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Outstanding Balance */}
                    <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-slate-500">Outstanding Balance</p>
                            <p className="text-2xl font-bold text-brand-navy">{currencySymbol}{outstanding.toLocaleString()}</p>
                        </div>
                        <button
                            type="button"
                            onClick={payFull}
                            className="text-xs font-medium text-brand-gold bg-brand-navy px-3 py-1.5 rounded hover:scale-105 transition-transform"
                        >
                            Pay Full
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="text-sm font-medium text-slate-600 block mb-2">Payment Amount</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        {parseFloat(amount) > outstanding && (
                            <p className="text-xs text-amber-600 mt-1">⚠️ Amount exceeds outstanding balance</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="text-sm font-medium text-slate-600 block mb-2">Payment Method</label>
                        <div className="grid grid-cols-5 gap-2">
                            {paymentMethods.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setMethod(m.id)}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${method === m.id
                                            ? 'border-brand-gold bg-brand-gold/10 text-brand-navy'
                                            : 'border-slate-200 text-slate-400 hover:border-slate-300'
                                        }`}
                                >
                                    <m.icon className="w-5 h-5" />
                                    <span className="text-[10px] font-medium">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-medium text-slate-600 block mb-2">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Payment reference, transaction ID, etc."
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                        className="w-full bg-brand-navy text-brand-gold py-4 rounded-lg font-medium hover:scale-[1.02] transition-transform shadow-lg shadow-brand-navy/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Processing...' : (
                            <>
                                <Check className="w-4 h-4" />
                                Record Payment
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
