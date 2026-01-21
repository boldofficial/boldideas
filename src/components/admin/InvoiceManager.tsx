'use client';

import React, { useState } from 'react';
import { DollarSign, FileText, Plus, Search, Filter, MoreVertical, CheckCircle2, Clock, AlertCircle, X, Download, Eye } from 'lucide-react';
import { updateInvoiceStatus, deleteInvoice, getInvoiceDetails } from '@/actions/finance';
import { recordActivity } from '@/actions/activity';
import EditInvoiceModal from './EditInvoiceModal';
import { toast } from 'sonner';

interface Invoice {
    id: string;
    invoiceNumber: string | null;
    totalAmount: string | null;
    status: string | null;
    issueDate?: Date | null;
    dueDate: Date | null;
    createdAt: Date | null;
    clientId: string | null;
    currency: string | null;
    notes: string | null;
    paidAt: Date | null;
    updatedAt: Date | null;
    amountPaid?: string | null;
    discountAmount?: string | null;
    discountType?: string | null;
}

export default function InvoiceManager({ initialInvoices, clients }: { initialInvoices: Invoice[], clients: any[] }) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        const result = await updateInvoiceStatus(id, newStatus);
        if (result.success) {
            setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus, paidAt: newStatus === 'paid' ? new Date() : inv.paidAt } : inv));
            toast.success(`Invoice marked as ${newStatus}`);
        }
        setUpdatingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;
        
        const result = await deleteInvoice(id);
        if (result.success) {
            setInvoices(prev => prev.filter(inv => inv.id !== id));
            toast.success('Invoice deleted');
        } else {
            toast.error('Failed to delete invoice');
        }
    };

    const handleEditClick = async (id: string) => {
        setIsFetchingDetails(true);
        const result = await getInvoiceDetails(id);
        if (result.success) {
            setEditingInvoice(result.data);
        } else {
            toast.error('Failed to fetch invoice details');
        }
        setIsFetchingDetails(false);
    };

    const filteredInvoices = invoices.filter(inv => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            inv.id.toLowerCase().includes(query) ||
            (inv.invoiceNumber?.toLowerCase().includes(query)) ||
            (inv.notes?.toLowerCase().includes(query));
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'overdue': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-slate-200 text-slate-500 border-slate-300';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-3 h-3" />;
            case 'sent': return <Clock className="w-3 h-3" />;
            case 'overdue': return <AlertCircle className="w-3 h-3" />;
            default: return <FileText className="w-3 h-3" />;
        }
    };

    const getCurrencySymbol = (currency: string | null) => {
        switch (currency) {
            case 'NGN': return '₦';
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '$';
        }
    };

    // Analytics Calculations
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);
    const pendingRevenue = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-brand-navy p-5 rounded-lg border border-brand-gold/20 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-12 h-12 text-brand-gold" />
                    </div>
                    <p className="text-xs font-medium text-brand-gold mb-1">Total Revenue Collected</p>
                    <h3 className="text-2xl font-black text-white">
                        ${totalRevenue.toLocaleString()}
                    </h3>
                </div>
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <Clock className="w-12 h-12 text-slate-900" />
                    </div>
                    <p className="text-xs font-medium text-slate-400 mb-1">Total Outstanding</p>
                    <h3 className="text-2xl font-black text-brand-navy">
                        ${pendingRevenue.toLocaleString()}
                    </h3>
                </div>
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs font-medium text-slate-400 mb-1">Invoices Sent</p>
                    <h3 className="text-2xl font-black text-blue-600">
                        {invoices.filter(i => i.status === 'sent').length}
                    </h3>
                </div>
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs font-medium text-slate-400 mb-1">Overdue</p>
                    <h3 className="text-2xl font-black text-rose-600">
                        {invoices.filter(i => i.status === 'overdue').length}
                    </h3>
                </div>
            </div>

            {/* Visual Intelligence Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl">
                    <h4 className="text-xs font-medium text-slate-500 mb-6 flex items-center justify-between">
                        <span>Revenue Status</span>
                        <span className="text-brand-gold">Live</span>
                    </h4>
                    <div className="space-y-4">
                        {[
                            { label: 'Collected', value: totalRevenue, color: 'bg-emerald-500' },
                            { label: 'Pending', value: pendingRevenue, color: 'bg-brand-gold' },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-slate-400">
                                    <span>{item.label}</span>
                                    <span>${item.value.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} transition-all duration-1000`}
                                        style={{ width: `${(item.value / (totalRevenue + pendingRevenue || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative">
                    <h4 className="text-xs font-medium text-slate-400 mb-4">Currency Distribution</h4>
                    <div className="flex flex-wrap gap-4">
                        {['USD', 'NGN', 'EUR', 'GBP'].map(curr => {
                            const count = invoices.filter(i => i.currency === curr).length;
                            if (count === 0) return null;
                            return (
                                <div key={curr} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                                    <span className="text-xs font-black text-brand-navy">{curr}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{count} Active</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID or notes..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-medium text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="p-4">Reference</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Due Date</th>
                                <th className="p-4">Updated</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-brand-navy font-bold">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-brand-gold animate-pulse'}`}></div>
                                                <span className="uppercase">{inv.invoiceNumber || inv.id.slice(0, 8)}</span>
                                            </div>
                                            {inv.notes && <span className="text-[9px] text-slate-400 truncate max-w-[150px] mt-1 font-sans">{inv.notes}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 font-black text-brand-navy">
                                        <span className="text-slate-400 mr-1">{getCurrencySymbol(inv.currency)}</span>
                                        {Number(inv.totalAmount).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-2 w-fit px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(inv.status || 'draft')}`}>
                                            {getStatusIcon(inv.status || 'draft')}
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 font-medium">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'No date'}</span>
                                            {inv.status === 'paid' && inv.paidAt && (
                                                <span className="text-xs text-emerald-600 font-medium">Paid: {new Date(inv.paidAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-slate-400 font-mono">
                                        {inv.updatedAt ? new Date(inv.updatedAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a href={`/admin/finance/invoice/${inv.id}`} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-navy transition-all" title="View Payload">
                                                <Eye className="w-4 h-4" />
                                            </a>
                                            <div className="relative group/menu">
                                                <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-navy transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20 hidden group-hover/menu:block">
                                                    <div className="p-2 border-b border-slate-100 italic text-[9px] text-slate-400 uppercase font-black">Status Control</div>
                                                    {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusUpdate(inv.id, status)}
                                                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy transition-colors capitalize"
                                                        >
                                                            Mark as {status}
                                                        </button>
                                                    ))}
                                                    <div className="p-2 border-t border-slate-100 italic text-[9px] text-slate-400 uppercase font-black">Management</div>
                                                    <button
                                                        onClick={() => handleEditClick(inv.id)}
                                                        disabled={isFetchingDetails}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-brand-navy hover:bg-slate-50 transition-colors"
                                                    >
                                                        {isFetchingDetails ? 'Fetching...' : 'Edit Details'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(inv.id)}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                                    >
                                                        Delete Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center opacity-20">
                                            <FileText className="w-12 h-12 mb-2" />
                                            <p className="text-xs font-medium text-slate-400">No invoices found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingInvoice && (
                <EditInvoiceModal
                    invoice={editingInvoice}
                    clients={clients}
                    onClose={() => setEditingInvoice(null)}
                    onSuccess={() => {
                        // Just refresh the entire list or update the specific one
                        // Refreshing the page is easiest to get all analytics right
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
