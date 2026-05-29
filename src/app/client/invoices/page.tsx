'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getInvoices } from '@/actions/finance';
import PayInvoiceButton from '@/components/pay/PayInvoiceButton';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Download,
  Loader2,
} from 'lucide-react';

function getCurrencySymbol(currency: string | null) {
  switch (currency) {
    case 'NGN': return '₦';
    case 'EUR': return '€';
    case 'GBP': return '£';
    default: return '$';
  }
}

function getStatusStyles(status: string | null) {
  switch (status) {
    case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'overdue': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'draft': return 'bg-slate-100 text-slate-500 border-slate-200';
    case 'cancelled': return 'bg-slate-200 text-slate-500 border-slate-300';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function getStatusIcon(status: string | null) {
  switch (status) {
    case 'paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'overdue': return <AlertCircle className="w-3.5 h-3.5" />;
    case 'sent': return <Clock className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
}

export default function ClientInvoicesPage() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await getInvoices(user.id);
      setInvoices(data || []);
      setLoading(false);
    };

    fetchInvoices();
  }, [user]);

  const filteredInvoices = invoices.filter(inv => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.id.toLowerCase().includes(query) ||
      inv.notes?.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'sent' || i.status === 'draft').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
  };

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((sum, i) => sum + (parseFloat(i.totalAmount || '0') - parseFloat(i.amountPaid || '0')), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">My Invoices</h1>
        <p className="text-slate-500 mt-1">
          {invoices.length === 0
            ? 'No invoices yet'
            : `${stats.paid} paid · ${stats.pending} pending · ${stats.overdue} overdue`
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-brand-navy border-brand-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{stats.total}</p>
                <p className="text-xs text-brand-gold/70">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('paid')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{stats.paid}</p>
                <p className="text-xs text-slate-500">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('sent')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{stats.pending}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('overdue')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{stats.overdue}</p>
                <p className="text-xs text-slate-500">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Balance Highlight */}
      {totalOutstanding > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800">Outstanding Balance</p>
              <p className="text-xs text-amber-600/80">Invoices awaiting payment</p>
            </div>
          </div>
          <p className="text-xl font-black text-amber-800">
            {getCurrencySymbol('USD')}{totalOutstanding.toLocaleString()}
          </p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-gold"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="sent">Sent</option>
          <option value="draft">Draft</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No invoices found</p>
            <p className="text-sm mt-2">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You don\'t have any invoices yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv) => {
            const totalAmount = parseFloat(inv.totalAmount || '0');
            const amountPaid = parseFloat(inv.amountPaid || '0');
            const outstanding = totalAmount - amountPaid;
            const isPaid = inv.status === 'paid';
            const canPay = !isPaid && inv.status !== 'cancelled';

            return (
              <Card
                key={inv.id}
                className={`hover:shadow-md transition-all border-l-4 ${
                  isPaid ? 'border-l-emerald-500' :
                  inv.status === 'overdue' ? 'border-l-rose-500' :
                  inv.status === 'sent' ? 'border-l-blue-500' :
                  inv.status === 'draft' ? 'border-l-slate-300' :
                  'border-l-slate-300'
                }`}
              >
                <CardContent className="py-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Invoice Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isPaid ? 'bg-emerald-100' :
                        inv.status === 'overdue' ? 'bg-rose-100' :
                        'bg-slate-100'
                      }`}>
                        {getStatusIcon(inv.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-brand-navy font-mono text-sm">
                            {inv.invoiceNumber || inv.id.slice(0, 8).toUpperCase()}
                          </span>
                          <Badge className={getStatusStyles(inv.status)}>
                            {inv.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                          <span>Issued: {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-'}</span>
                          <span>Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'Open'}</span>
                        </div>
                        {inv.notes && (
                          <p className="text-xs text-slate-400 mt-1 truncate max-w-md">{inv.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount & Actions */}
                    <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-black text-brand-navy">
                          {getCurrencySymbol(inv.currency)}{totalAmount.toLocaleString()}
                        </p>
                        {!isPaid && outstanding > 0 && outstanding < totalAmount && (
                          <p className="text-[10px] text-emerald-600 font-medium">
                            {getCurrencySymbol(inv.currency)}{outstanding.toLocaleString()} remaining
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {canPay && (
                          <PayInvoiceButton
                            invoiceId={inv.id}
                            amount={outstanding}
                            currency={inv.currency || 'USD'}
                            invoiceNumber={inv.invoiceNumber || ''}
                            label="Pay Now"
                          />
                        )}

                        {canPay && inv.stripePaymentLink && (
                          <Link
                            href={`/pay/${inv.id}`}
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View
                          </Link>
                        )}

                        {isPaid && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700">Paid</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
