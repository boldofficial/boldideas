'use client';

import { TrendingUp, TrendingDown, DollarSign, FileText, AlertCircle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnalyticsData {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    outstanding: number;
    invoiceCount: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    monthlyRevenue: { month: number; revenue: number }[];
    yoyGrowth: string | null;
    lastYearRevenue: number;
    year: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function FinanceDashboard({ analytics }: { analytics: AnalyticsData }) {
    const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue), 1);
    const growthPositive = analytics.yoyGrowth && parseFloat(analytics.yoyGrowth) > 0;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <DollarSign className="w-16 h-16" />
                    </div>
                    <p className="text-xs text-emerald-100 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</h3>
                    {analytics.yoyGrowth && (
                        <div className={`flex items-center gap-1 mt-2 text-xs ${growthPositive ? 'text-emerald-100' : 'text-rose-200'}`}>
                            {growthPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {analytics.yoyGrowth}% vs last year
                        </div>
                    )}
                </div>

                {/* Total Expenses */}
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <TrendingDown className="w-16 h-16" />
                    </div>
                    <p className="text-xs text-rose-100 mb-1">Total Expenses</p>
                    <h3 className="text-2xl font-bold">${analytics.totalExpenses.toLocaleString()}</h3>
                </div>

                {/* Net Profit */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                    <p className="text-xs text-blue-100 mb-1">Net Profit</p>
                    <h3 className={`text-2xl font-bold ${analytics.netProfit < 0 ? 'text-rose-200' : ''}`}>
                        ${analytics.netProfit.toLocaleString()}
                    </h3>
                </div>

                {/* Outstanding */}
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <Clock className="w-16 h-16" />
                    </div>
                    <p className="text-xs text-amber-100 mb-1">Outstanding</p>
                    <h3 className="text-2xl font-bold">${analytics.outstanding.toLocaleString()}</h3>
                </div>
            </div>

            {/* Invoice Stats & Revenue Chart */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Invoice Stats */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="text-sm font-bold text-slate-800 mb-4">Invoice Summary</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-600">Total Invoices</span>
                            </div>
                            <span className="font-bold text-slate-800">{analytics.invoiceCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-slate-600">Paid</span>
                            </div>
                            <span className="font-bold text-emerald-600">{analytics.paidCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-slate-600">Pending</span>
                            </div>
                            <span className="font-bold text-amber-600">{analytics.pendingCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                                <span className="text-sm text-slate-600">Overdue</span>
                            </div>
                            <span className="font-bold text-rose-600">{analytics.overdueCount}</span>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-800">Monthly Revenue {analytics.year}</h4>
                        {analytics.lastYearRevenue > 0 && (
                            <span className="text-xs text-slate-400">Last year: ${analytics.lastYearRevenue.toLocaleString()}</span>
                        )}
                    </div>
                    <div className="flex items-end gap-1 h-40">
                        {analytics.monthlyRevenue.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full bg-gradient-to-t from-brand-navy to-brand-gold/70 rounded-t transition-all hover:from-brand-gold hover:to-brand-gold cursor-pointer relative"
                                    style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? '4px' : '0' }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ${m.revenue.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1">{monthNames[m.month]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
