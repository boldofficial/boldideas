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
        <div className="space-y-8 animate-fade-in">
            <header className="flex items-start justify-between border-b border-slate-200 pb-6 gap-4">
                <div className="space-y-4 min-w-0">
                    <DashboardGreeting />
                    <p className="text-slate-500 text-sm">Real-time overview of your agency</p>
                    <QuickActions />
                </div>
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full border border-green-200 shrink-0 self-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium">Online</span>
                </div>
            </header>

            {/* Stream in progressively — each section loads independently */}
            <Suspense fallback={<MetricsSkeleton />}>
                <DashboardMetricsGrid />
            </Suspense>

            <Suspense fallback={<ChartsSkeleton />}>
                <DashboardChartsSection />
            </Suspense>

            <Suspense fallback={<HealthActivitySkeleton />}>
                <DashboardHealthSection />
            </Suspense>

            <Suspense fallback={<ProjectsSkeleton />}>
                <DashboardProjectsSection />
            </Suspense>
        </div>
    );
}
