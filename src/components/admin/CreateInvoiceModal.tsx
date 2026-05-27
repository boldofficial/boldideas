'use client';

import { useState } from 'react';
import { createInvoice, addInvoiceItem } from '@/actions/finance';
import { 
    Plus, X, Trash2, DollarSign, Calendar, User, CreditCard, 
    FileText, Check, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InvoiceItem {
    title: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export default function CreateInvoiceModal({ clients }: { clients: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
    const [currency, setCurrency] = useState<string>('USD');
    const [clientId, setClientId] = useState<string>('unassigned');
    const [items, setItems] = useState<InvoiceItem[]>([
        { title: '', description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);

    const addItem = () => {
        setItems([...items, { title: '', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        const item = { ...newItems[index] };

        if (field === 'title') item.title = value as string;
        else if (field === 'description') item.description = value as string;
        else if (field === 'quantity') item.quantity = Number(value);
        else if (field === 'unitPrice') item.unitPrice = Number(value);

        item.amount = item.quantity * item.unitPrice;
        newItems[index] = item;
        setItems(newItems);
    };

    const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
    const calculatedDiscount = discountType === 'percentage'
        ? (subtotal * (discountAmount / 100))
        : discountAmount;
    const totalAmount = Math.max(0, subtotal - calculatedDiscount);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.set('totalAmount', totalAmount.toString());
        formData.set('discountAmount', discountAmount.toString());
        formData.set('discountType', discountType);
        formData.set('clientId', clientId === 'unassigned' ? '' : clientId);
        formData.set('currency', currency);

        const result = await createInvoice(formData);

        if (result.success && result.id) {
            for (const item of items) {
                await addInvoiceItem({
                    invoiceId: result.id,
                    title: item.title,
                    description: item.description,
                    quantity: item.quantity.toString(),
                    unitPrice: item.unitPrice.toString(),
                    amount: item.amount.toString()
                });
            }
            toast.success('Invoice created successfully');
            setIsOpen(false);
            setItems([{ title: '', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
            setDiscountAmount(0);
            window.location.reload();
        } else {
            toast.error('Failed to create invoice');
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    className="bg-brand-navy text-brand-gold px-6 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand-navy/20 h-10 italic"
                >
                    <Plus className="w-4 h-4 mr-2" /> New Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none shadow-2xl">
                <DialogHeader className="p-6 border-b bg-slate-50/80">
                    <div>
                        <DialogTitle className="font-black text-2xl text-brand-navy uppercase tracking-tight italic">Create New Invoice</DialogTitle>
                        <DialogDescription className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                            Professional Billing Transmission // Digital Secure Infrastructure
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-6 space-y-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Client Information</h4>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-slate-500">Select Client</Label>
                                        <Select value={clientId} onValueChange={setClientId}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10 text-xs font-bold">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    <SelectValue placeholder="Select Client" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">Select Client</SelectItem>
                                                {clients.map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name || c.email}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-slate-500">Currency</Label>
                                        <Select value={currency} onValueChange={setCurrency}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10 text-xs font-bold">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                                    <SelectValue placeholder="Currency" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="NGN">NGN (₦)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Billing Dates</h4>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-slate-500">Due Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                                            <Input
                                                name="dueDate"
                                                type="date"
                                                className="pl-10 bg-slate-50 border-slate-200 text-xs font-bold h-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Notes</h4>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-slate-500">Internal Remarks</Label>
                                        <Textarea
                                            name="notes"
                                            placeholder="Terms, bank info, or notes..."
                                            className="bg-slate-50 border-slate-200 text-xs font-medium resize-none min-h-[92px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-brand-navy uppercase tracking-widest flex justify-between items-center bg-slate-100/50 p-2 rounded border border-slate-200/50">
                                    <span>Line Items & Services</span>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={addItem} 
                                        className="h-7 text-[10px] text-blue-600 hover:text-blue-700 font-black uppercase tracking-tighter"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Service
                                    </Button>
                                </h4>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-4 bg-slate-50/30 rounded-lg border border-slate-200/60 group space-y-4 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="grid md:grid-cols-12 gap-4">
                                                <div className="md:col-span-11 space-y-3">
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                                                        placeholder="Service Title (e.g. Creative Direction)"
                                                        className="bg-white border-slate-200 text-xs font-black text-brand-navy h-9 shadow-sm"
                                                        required
                                                    />
                                                    <div className="grid md:grid-cols-12 gap-3 pb-1">
                                                        <div className="md:col-span-7">
                                                            <Input
                                                                value={item.description}
                                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                                placeholder="Scope of work details..."
                                                                className="bg-white border-slate-200 text-[10px] font-medium h-8"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <div className="relative">
                                                                <Input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                    className="bg-white border-slate-200 text-xs font-bold text-center h-8"
                                                                    required
                                                                />
                                                                <span className="absolute -top-3 left-0 text-[8px] font-black text-slate-300 uppercase">Qty</span>
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <div className="relative">
                                                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-slate-300" />
                                                                <Input
                                                                    type="number"
                                                                    value={item.unitPrice}
                                                                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                                                    className="pl-6 bg-white border-slate-200 text-xs font-bold h-8"
                                                                    required
                                                                />
                                                                <span className="absolute -top-3 left-0 text-[8px] font-black text-slate-300 uppercase">Unit Price</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-1 flex flex-col items-center justify-between py-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(index)}
                                                        className="h-8 w-8 text-slate-300 hover:text-rose-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <div className="text-[10px] font-black text-brand-navy">
                                                        ${item.amount.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-6 pt-6 border-t bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4 items-center">
                            <div className="space-y-1">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Discount Adjustment</Label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-24">
                                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                        <Input
                                            type="number"
                                            value={discountAmount}
                                            onChange={e => setDiscountAmount(Number(e.target.value))}
                                            className="pl-6 h-8 text-xs font-bold border-slate-200 bg-white"
                                        />
                                    </div>
                                    <Select 
                                        value={discountType} 
                                        onValueChange={(val: any) => setDiscountType(val)}
                                    >
                                        <SelectTrigger className="w-20 h-8 text-[9px] font-black uppercase bg-white border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed</SelectItem>
                                            <SelectItem value="percentage">Percent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Estimated Total</p>
                                <h3 className="text-3xl font-black text-brand-navy italic leading-none">
                                    <span className="text-slate-200 mr-2 text-xl italic">$</span>
                                    {totalAmount.toLocaleString()}
                                </h3>
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-brand-navy text-brand-gold h-14 px-8 font-black uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-xl shadow-brand-navy/30 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
                                        <span>Transmitting</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        <span>Create Invoice</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
