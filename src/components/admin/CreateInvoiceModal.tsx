'use client';

import { useState } from 'react';
import { createInvoice, addInvoiceItem } from '@/actions/finance';
import { Plus, X, Trash2, DollarSign, Calendar, User, CreditCard, FileText, Percent, BadgePercent } from 'lucide-react';

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
        formData.set('totalAmount', subtotal.toString()); // Store subtotal as totalAmount in DB for consistency? 
        // Actually, schema usually expects final total. Let's send final total.
        formData.set('totalAmount', totalAmount.toString());
        formData.set('discountAmount', discountAmount.toString());
        formData.set('discountType', discountType);

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
            setIsOpen(false);
            setItems([{ title: '', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
            setDiscountAmount(0);
        } else {
            alert('Failed to create invoice');
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-brand-navy text-brand-gold px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-brand-navy/20"
            >
                <Plus className="w-4 h-4" />
                New Invoice
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-black text-xl text-brand-navy uppercase tracking-tight italic">Create New Invoice</h3>
                                <p className="text-[10px] font-mono text-slate-400">Professional Billing System</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-brand-navy transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Client Information</h4>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            name="clientId"
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:ring-1 focus:ring-brand-gold outline-none appearance-none"
                                            required
                                        >
                                            <option value="unassigned">Select Client</option>
                                            {clients.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name || c.email}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            name="currency"
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:ring-1 focus:ring-brand-gold outline-none appearance-none"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="NGN">NGN (₦)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Billing Dates</h4>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="dueDate"
                                            type="date"
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:ring-1 focus:ring-brand-gold outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="text-[10px] text-slate-400 italic">Sets the deadline for payment.</div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Notes</h4>
                                    <textarea
                                        name="notes"
                                        placeholder="Internal notes or terms..."
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-xs font-medium focus:ring-1 focus:ring-brand-gold outline-none min-h-[82px]"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-brand-navy uppercase tracking-widest flex justify-between items-center bg-slate-100 p-2 rounded">
                                    <span>Line Items & Services</span>
                                    <button type="button" onClick={addItem} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold">
                                        <Plus className="w-3 h-3" /> Add Item
                                    </button>
                                </h4>

                                <div className="space-y-2">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-3 bg-slate-50/50 rounded border border-dashed border-slate-200 group space-y-3">
                                            <div className="grid md:grid-cols-12 gap-2">
                                                <div className="md:col-span-11">
                                                    <input
                                                        value={item.title}
                                                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                                                        placeholder="Service Title (e.g. Web Development)"
                                                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-bold text-brand-navy focus:ring-1 focus:ring-brand-gold outline-none"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-1 flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-12 gap-2 pb-1">
                                                <div className="md:col-span-6">
                                                    <input
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                        placeholder="Detailed description or scope..."
                                                        className="w-full p-2 bg-white border border-slate-200 rounded text-[10px] font-medium focus:ring-1 focus:ring-brand-gold outline-none"
                                                    />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        placeholder="Qty"
                                                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-bold text-center focus:ring-1 focus:ring-brand-gold outline-none"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                                        placeholder="Price"
                                                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-bold focus:ring-1 focus:ring-brand-gold outline-none"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-3 flex items-center justify-end px-3 font-black text-brand-navy text-xs">
                                                    ${item.amount.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-slate-100 pt-6">
                                <div className="w-full max-w-sm space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Adjustments</h4>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                            <input
                                                type="number"
                                                value={discountAmount}
                                                onChange={e => setDiscountAmount(Number(e.target.value))}
                                                placeholder="Discount"
                                                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:ring-1 focus:ring-brand-gold outline-none"
                                            />
                                        </div>
                                        <select
                                            value={discountType}
                                            onChange={e => setDiscountType(e.target.value as any)}
                                            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-[10px] font-bold uppercase outline-none"
                                        >
                                            <option value="fixed">Fixed ($)</option>
                                            <option value="percentage">Percent (%)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Total</p>
                                        <h3 className="text-3xl font-black text-brand-navy italic">
                                            <span className="text-slate-300 mr-2">$</span>
                                            {totalAmount.toLocaleString()}
                                        </h3>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-brand-navy text-brand-gold px-10 py-4 rounded text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-brand-navy/30 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? 'Processing...' : (
                                            <>
                                                <FileText className="w-4 h-4" />
                                                Create Invoice
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
