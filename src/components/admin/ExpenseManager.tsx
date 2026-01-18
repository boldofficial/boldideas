'use client';

import { useState } from 'react';
import { createExpense, deleteExpense } from '@/actions/financeEnhancements';
import { Plus, X, Trash2, Receipt, Calendar, Tag, Building2, DollarSign } from 'lucide-react';

interface Expense {
    id: string;
    category: string;
    description: string | null;
    amount: string;
    currency: string | null;
    expenseDate: Date | null;
    vendor: string | null;
    isRecurring: boolean | null;
}

const categories = [
    { id: 'software', label: 'Software', color: 'bg-blue-100 text-blue-700' },
    { id: 'office', label: 'Office', color: 'bg-purple-100 text-purple-700' },
    { id: 'marketing', label: 'Marketing', color: 'bg-pink-100 text-pink-700' },
    { id: 'travel', label: 'Travel', color: 'bg-amber-100 text-amber-700' },
    { id: 'utilities', label: 'Utilities', color: 'bg-green-100 text-green-700' },
    { id: 'salary', label: 'Salary', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'other', label: 'Other', color: 'bg-slate-100 text-slate-700' },
];

export default function ExpenseManager({ initialExpenses }: { initialExpenses: Expense[] }) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');

    const filteredExpenses = filterCategory === 'all'
        ? expenses
        : expenses.filter(e => e.category === filterCategory);

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await createExpense({
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            amount: formData.get('amount') as string,
            currency: formData.get('currency') as string,
            expenseDate: formData.get('expenseDate') as string,
            vendor: formData.get('vendor') as string,
            isRecurring: formData.get('isRecurring') === 'on',
        });

        if (result.success && result.data) {
            setExpenses([result.data as Expense, ...expenses]);
            setIsAdding(false);
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this expense?')) return;
        const result = await deleteExpense(id);
        if (result.success) {
            setExpenses(expenses.filter(e => e.id !== id));
        }
    };

    const getCategoryStyle = (cat: string) => {
        return categories.find(c => c.id === cat)?.color || 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-brand-navy">Expenses</h2>
                    <p className="text-sm text-slate-500">Track business expenses</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-500">Total Expenses</p>
                        <p className="text-lg font-bold text-rose-600">${totalExpenses.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-brand-navy text-brand-gold px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCategory === 'all' ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCategory === cat.id ? 'bg-brand-navy text-white' : `${cat.color} hover:opacity-80`
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs font-medium text-slate-500 border-b">
                        <tr>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map(expense => (
                            <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(expense.category)}`}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-700">{expense.description || '-'}</td>
                                <td className="p-4 text-slate-500">{expense.vendor || '-'}</td>
                                <td className="p-4 text-slate-500">
                                    {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="p-4 text-right font-bold text-slate-800">
                                    ${parseFloat(expense.amount).toLocaleString()}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(expense.id)}
                                        className="text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">
                                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p>No expenses recorded</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Expense Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white relative">
                            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold">Add Expense</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Category</label>
                                    <select name="category" required className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Amount</label>
                                    <input name="amount" type="number" step="0.01" required
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-600 block mb-1">Description</label>
                                <input name="description" type="text"
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="What was this expense for?" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Vendor</label>
                                    <input name="vendor" type="text"
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Company name" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Date</label>
                                    <input name="expenseDate" type="date" defaultValue={new Date().toISOString().split('T')[0]}
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isRecurring" id="isRecurring" className="rounded" />
                                <label htmlFor="isRecurring" className="text-sm text-slate-600">Recurring expense</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Add Expense'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
