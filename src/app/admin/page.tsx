import React, { Suspense } from 'react';
import QuickActions from "@/components/admin/QuickActions";
import DashboardGreeting from "@/components/admin/DashboardGreeting";
import {
    DashboardMetricsGrid,
    DashboardChartsSection,
    DashboardHealthSection,
    DashboardProjectsSection,
} from "@/components/admin/DashboardContent";
import {
    MetricsSkeleton,
    ChartsSkeleton,
    HealthActivitySkeleton,
    ProjectsSkeleton,
} from "@/components/admin/DashboardSkeleton";

export const metadata = {
    title: "Admin Dashboard | Bold Ideas",
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="min-w-0 space-y-4">
                    <DashboardGreeting />
                    <p className="max-w-2xl text-sm text-slate-500">
                        Open work, client risk, cash, and follow-ups in one place.
                    </p>
                    <QuickActions />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 sm:flex sm:items-center">
                    <div className="border border-slate-200 bg-white px-3 py-2">
                        <span className="block font-bold uppercase tracking-[0.12em] text-slate-400">View</span>
                        <span className="font-semibold text-brand-navy">Operations</span>
                    </div>
                    <div className="border border-slate-200 bg-white px-3 py-2">
                        <span className="block font-bold uppercase tracking-[0.12em] text-slate-400">Status</span>
                        <span className="font-semibold text-brand-navy">Live data</span>
                    </div>
                </div>
            </header>

            <Suspense fallback={<MetricsSkeleton />}>
                <DashboardMetricsGrid />
            </Suspense>

            <Suspense fallback={<HealthActivitySkeleton />}>
                <DashboardHealthSection />
            </Suspense>

            <Suspense fallback={<ChartsSkeleton />}>
                <DashboardChartsSection />
            </Suspense>

            <Suspense fallback={<ProjectsSkeleton />}>
                <DashboardProjectsSection />
            </Suspense>
        </div>
    );
}
