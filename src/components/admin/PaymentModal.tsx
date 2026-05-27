'use client';

import { useState } from 'react';
import { recordPayment } from '@/actions/financeEnhancements';
import { CreditCard, DollarSign, X, Check, Wallet, Building2, Banknote, Bitcoin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
            toast.success('Payment recorded successfully');
            onSuccess();
            onClose();
        } else {
            toast.error(result.error || 'Failed to record payment');
        }
        setIsSubmitting(false);
    };

    const payFull = () => setAmount(outstanding.toString());

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-none shadow-2xl">
                <DialogHeader className="p-6 border-b bg-slate-50/80">
                    <div>
                        <DialogTitle className="font-black text-2xl text-brand-navy uppercase tracking-tight italic">Record Payment</DialogTitle>
                        <DialogDescription className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                            Invoice: {invoiceNumber} // Transaction Pipeline
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-slate-50 rounded-lg p-5 flex justify-between items-center border border-slate-200/60 shadow-inner">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
                            <p className="text-3xl font-black text-brand-navy italic tabular-nums leading-none">
                                <span className="text-slate-300 mr-1 text-xl">{currencySymbol}</span>
                                {outstanding.toLocaleString()}
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={payFull}
                            variant="outline"
                            className="text-[10px] font-black uppercase text-brand-navy hover:bg-brand-navy hover:text-white h-8 tracking-tighter"
                        >
                            Full Balance
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-500">Payment Amount</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 tabular-nums">{currencySymbol}</span>
                            <Input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-12 pr-4 h-14 border-slate-200 rounded-lg text-xl font-black text-brand-navy tabular-nums focus:ring-brand-gold outline-none bg-white shadow-sm"
                                required
                            />
                        </div>
                        {parseFloat(amount) > outstanding && (
                            <div className="flex items-center gap-1.5 text-amber-600 animate-pulse">
                                <AlertCircle className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-tight">Amount exceeds outstanding balance</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-500">Payment Method</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {paymentMethods.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setMethod(m.id)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-300 ${method === m.id
                                            ? 'border-brand-gold bg-brand-gold/5 text-brand-navy shadow-md'
                                            : 'border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-500'
                                        }`}
                                >
                                    <m.icon className={`w-5 h-5 ${method === m.id ? 'text-brand-gold' : ''}`} />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-500">Reference / Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Transaction ID, bank reference, etc..."
                            className="bg-slate-50 border-slate-200 text-xs font-medium resize-none h-20"
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                            className="w-full bg-brand-navy text-brand-gold h-14 font-black uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-xl shadow-brand-navy/30 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
                                    <span>Processing</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    <span>Commit Payment</span>
                                </div>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
