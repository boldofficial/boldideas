import React, { cache } from 'react';
import Link from 'next/link';
import { getDashboardMetrics } from "@/actions/dashboard";
import ActivityFeed from "@/components/admin/ActivityFeed";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, DollarSign, FolderKanban, MessageSquare, Users } from 'lucide-react';
import { getGlobalActivity } from "@/actions/activity";

const getCachedDashboardMetrics = cache(getDashboardMetrics);

function formatMoney(value: number) {
    return `$${value.toLocaleString()}`;
}

function formatDate(value: Date | string | null) {
    if (!value) return 'No due date';
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function statusTone(tone?: string) {
    if (tone === 'danger') return 'border-red-200 bg-red-50 text-red-700';
    if (tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-700';
    return 'border-slate-200 bg-white text-slate-600';
}

function workRisk(overdueTasks: number, priority: string | null) {
    if (overdueTasks > 0) return { label: `${overdueTasks} overdue`, className: 'bg-red-50 text-red-700 border-red-200' };
    if (priority === 'urgent' || priority === 'high') return { label: 'High priority', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'On track', className: 'bg-slate-50 text-slate-600 border-slate-200' };
}

export async function DashboardMetricsGrid() {
    const { data: metrics } = await getCachedDashboardMetrics();

    const cards = [
        {
            label: 'Revenue this month',
            value: formatMoney(metrics?.revenueThisMonth || 0),
            detail: 'Paid invoices',
            icon: DollarSign,
        },
        {
            label: 'Outstanding',
            value: formatMoney(metrics?.pendingInvoicesValue || 0),
            detail: `${metrics?.pendingInvoicesCount || 0} invoices awaiting action`,
            icon: Clock,
        },
        {
            label: 'Active work',
            value: String(metrics?.activeProjects || 0),
            detail: `${metrics?.pendingTasks || 0} open tasks`,
            icon: FolderKanban,
        },
        {
            label: 'Client pressure',
            value: String((metrics?.openTickets || 0) + (metrics?.staleLeads || 0)),
            detail: `${metrics?.openTickets || 0} tickets, ${metrics?.staleLeads || 0} follow-ups`,
            icon: MessageSquare,
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
                <div
                    key={card.label}
                    className={`bg-white border border-slate-200 p-5 shadow-sm ${index === 0 ? 'border-l-4 border-l-brand-gold' : ''}`}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{card.label}</p>
                            <p className="mt-3 text-3xl font-semibold text-brand-navy tabular-nums">{card.value}</p>
                            <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-slate-50 text-brand-navy">
                            <card.icon className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export async function DashboardChartsSection() {
    const { data: metrics } = await getCachedDashboardMetrics();

    return (
        <DashboardCharts
            revenueTrend={metrics?.revenueTrend || []}
            pipeline={metrics?.pipeline || []}
            taskTrend={metrics?.taskTrend || []}
        />
    );
}

export async function DashboardHealthSection() {
    const [{ data: metrics }, { data: activities }] = await Promise.all([
        getCachedDashboardMetrics(),
        getGlobalActivity(8)
    ]);

    return (
        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-brand-navy">Active Work</h2>
                            <p className="text-xs text-slate-500">Current delivery items that need awareness.</p>
                        </div>
                        <Link href="/admin/projects" className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-gold">
                            Projects <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                <tr>
                                    <th className="px-5 py-3">Work</th>
                                    <th className="px-5 py-3">Owner</th>
                                    <th className="px-5 py-3">Next Action</th>
                                    <th className="px-5 py-3">Due</th>
                                    <th className="px-5 py-3">Risk</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(metrics?.activeWork || []).length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                                            No active project work yet.
                                        </td>
                                    </tr>
                                ) : (
                                    metrics?.activeWork?.map((item) => {
                                        const risk = workRisk(item.overdueTasks, item.priority);
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/70">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-brand-navy">{item.title}</p>
                                                    <p className="mt-1 text-xs capitalize text-slate-500">{item.status} · {item.openTasks} open tasks</p>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">{item.owner}</td>
                                                <td className="px-5 py-4">
                                                    <p className="max-w-[240px] truncate text-slate-700">{item.nextAction}</p>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">{formatDate(item.nextDueAt)}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-semibold ${risk.className}`}>
                                                        {risk.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h2 className="text-sm font-semibold text-brand-navy">Attention Queue</h2>
                        <p className="text-xs text-slate-500">Items that can interrupt delivery or cash flow.</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {(metrics?.attentionQueue || []).map((item) => (
                            <Link key={item.label} href={item.href} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded border ${statusTone(item.tone)}`}>
                                        {item.tone === 'danger' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                </div>
                                <span className="text-lg font-semibold tabular-nums text-brand-navy">{item.value}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="min-h-[420px]">
                <ActivityFeed activities={activities || []} />
            </div>
        </section>
    );
}

export async function DashboardProjectsSection() {
    const { data: metrics } = await getCachedDashboardMetrics();

    return (
        <section className="grid gap-4 border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-4">
            <div className="lg:col-span-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Operating Snapshot</p>
                <h2 className="mt-2 text-xl font-semibold text-brand-navy">What needs a decision?</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
                {[
                    { label: 'Won lead rate', value: `${metrics?.winRate || 0}%`, detail: `${metrics?.wonLeads || 0} won of ${metrics?.totalLeads || 0}` },
                    { label: 'Completed this week', value: String(metrics?.completedTasksThisWeek || 0), detail: 'Delivery throughput' },
                    { label: 'Users', value: String(metrics?.totalUsers || 0), detail: 'Clients and team' },
                    { label: 'Total projects', value: String(metrics?.totalProjects || 0), detail: 'All time' },
                ].map(item => (
                    <div key={item.label} className="border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs font-medium text-slate-500">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-brand-navy tabular-nums">{item.value}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
