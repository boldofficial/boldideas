import React from 'react';
import { getProjects } from "@/actions/projects";
import { getDashboardMetrics } from "@/actions/dashboard";
import ProjectManager from "@/components/admin/ProjectManager";
import ActivityFeed from "@/components/admin/ActivityFeed";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { TrendingUp, Users, FolderKanban, CheckCircle2, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { getGlobalActivity } from "@/actions/activity";

// ─── Metric Cards ─────────────────────────────────────────

export async function DashboardMetricsGrid() {
    const { data: metrics } = await getDashboardMetrics();

    const dashboardMetrics = [
        {
            label: 'Total Users',
            value: metrics?.totalUsers?.toLocaleString() || '0',
            change: '+Active',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Active Projects',
            value: String(metrics?.activeProjects || 0),
            change: `${metrics?.totalProjects || 0} Total`,
            icon: FolderKanban,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Tasks This Week',
            value: String(metrics?.completedTasksThisWeek || 0),
            change: `${metrics?.pendingTasks || 0} Pending`,
            icon: CheckCircle2,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Revenue (Month)',
            value: `$${(metrics?.revenueThisMonth || 0).toLocaleString()}`,
            change: 'PAID',
            icon: DollarSign,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        {
            label: 'Pending Invoices',
            value: `$${(metrics?.pendingInvoicesValue || 0).toLocaleString()}`,
            change: `${metrics?.pendingInvoicesCount || 0} Open`,
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'Overdue Tasks',
            value: String(metrics?.overdueTasks || 0),
            change: (metrics?.overdueTasks || 0) > 0 ? 'ATTENTION' : 'CLEAR',
            icon: AlertTriangle,
            color: (metrics?.overdueTasks || 0) > 0 ? 'text-red-600' : 'text-green-600',
            bgColor: (metrics?.overdueTasks || 0) > 0 ? 'bg-red-50' : 'bg-green-50'
        },
    ];

    return (
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dashboardMetrics.map(metric => (
                <div key={metric.label} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-gold hover:shadow-md transition-all">
                    <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <h3 className="text-slate-400 text-xs font-medium mb-1">{metric.label}</h3>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-brand-navy">{metric.value}</span>
                    </div>
                    <span className={`text-xs font-medium ${metric.color} ${metric.bgColor} px-2 py-0.5 rounded mt-2 inline-block`}>
                        {metric.change}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Charts ───────────────────────────────────────────────

export async function DashboardChartsSection() {
    const { data: metrics } = await getDashboardMetrics();

    return (
        <DashboardCharts
            revenueTrend={metrics?.revenueTrend || []}
            pipeline={metrics?.pipeline || []}
            taskTrend={metrics?.taskTrend || []}
        />
    );
}

// ─── Health & Activity ────────────────────────────────────

export async function DashboardHealthSection() {
    const [{ data: metrics }, { data: activities }] = await Promise.all([
        getDashboardMetrics(),
        getGlobalActivity(10)
    ]);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 rounded-lg p-6 text-white border border-brand-gold/20 shadow-lg relative overflow-hidden h-full flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-brand-gold" />
                                System Health
                            </h2>
                            <p className="text-sm text-slate-300 mt-2 font-medium">
                                {metrics?.activeProjects || 0} active projects • {metrics?.pendingTasks || 0} pending tasks • ${(metrics?.pendingInvoicesValue || 0).toLocaleString()} outstanding
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                <span>{metrics?.totalLeads || 0} total leads</span>
                                <span>{metrics?.wonLeads || 0} won</span>
                                <span className="text-brand-gold">{metrics?.winRate || 0}% win rate</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-black text-brand-gold">
                                {metrics?.overdueTasks === 0 ? '100' : Math.round((1 - (metrics?.overdueTasks || 0) / Math.max(metrics?.pendingTasks || 1, 1)) * 100)}<span className="text-2xl">%</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Health Score</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[300px] lg:h-auto">
                <ActivityFeed activities={activities || []} />
            </div>
        </div>
    );
}

// ─── Projects ─────────────────────────────────────────────

export async function DashboardProjectsSection() {
    const { data: projects } = await getProjects();
    return <ProjectManager initialProjects={projects || []} />;
}


