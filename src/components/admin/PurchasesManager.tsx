'use client';

import { useState } from 'react';
import { Package, DollarSign, CalendarDays, Mail, Phone, ExternalLink, Search, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Purchase } from '@/lib/db/schema';

interface PurchasesManagerProps {
  initialPurchases: Purchase[];
}

export default function PurchasesManager({ initialPurchases }: PurchasesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = initialPurchases.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.customerName.toLowerCase().includes(term) ||
      p.customerEmail.toLowerCase().includes(term) ||
      p.packageName.toLowerCase().includes(term) ||
      p.serviceSlug.toLowerCase().includes(term)
    );
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-rose-500" />;
      case 'refunded': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const statusBadge = (status: string | null) => {
    const key = status || 'pending';
    const styles: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      failed: 'bg-rose-100 text-rose-700 border-rose-200',
      refunded: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${styles[key] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
        {statusIcon(key)}
        {key}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search purchases by name, email, or package..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm">
        <span className="text-slate-500">
          Total: <strong className="text-brand-navy">{filtered.length}</strong>
        </span>
        <span className="text-slate-500">
          Completed: <strong className="text-emerald-600">{filtered.filter(p => p.status === 'completed').length}</strong>
        </span>
        <span className="text-slate-500">
          Pending: <strong className="text-amber-600">{filtered.filter(p => p.status === 'pending').length}</strong>
        </span>
        <span className="text-slate-500">
          Revenue: <strong className="text-brand-navy">
            ${filtered.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}
          </strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Customer</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Package</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Amount</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Date</th>
                <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                    {searchTerm ? 'No purchases match your search.' : 'No purchases yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((purchase) => (
                  <tr key={purchase.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-navy">{purchase.customerName}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail className="h-3 w-3" />
                            {purchase.customerEmail}
                            {purchase.customerPhone && (
                              <>
                                <span>·</span>
                                <Phone className="h-3 w-3" />
                                {purchase.customerPhone}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-brand-navy">{purchase.packageName}</p>
                      <p className="text-xs text-slate-400 capitalize">{purchase.serviceSlug.replace(/-/g, ' ')}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-brand-navy">${parseFloat(purchase.amount).toLocaleString()}</p>
                    </td>
                    <td className="px-5 py-4">{statusBadge(purchase.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(purchase.createdAt!).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {purchase.invoiceId && (
                        <a
                          href={`/admin/finance/invoice/${purchase.invoiceId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold transition hover:text-brand-navy"
                        >
                          Invoice
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
