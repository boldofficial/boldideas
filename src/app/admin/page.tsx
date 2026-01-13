
import React from 'react';
import { getProjects } from "@/actions/projects";
import ProjectManager from "@/components/admin/ProjectManager";

export const metadata = {
    title: "Admin Dashboard | Bold Ideas",
};

export default async function AdminDashboardPage() {
    const { data: projects } = await getProjects();

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight">System Overview</h1>
                    <p className="text-slate-500 font-mono text-xs mt-2">Active_Monitoring_Phase</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">System_Online</span>
                </div>
            </header>

            {/* Metrics Grid (Static for now) */}
            <div className="grid md:grid-cols-3 gap-6">
                {[ 
                    { label: 'Total Users', value: '1,240', change: '+12%', id: 'METRIC_01' },
                    { label: 'Total Projects', value: String(projects?.length || 0), change: 'LIVE', id: 'METRIC_02' },
                    { label: 'System Health', value: '98.5%', change: 'STABLE', id: 'METRIC_03' },
                ].map(metric => (
                    <div key={metric.id} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-gold transition-colors">
                        <div className="absolute top-0 right-0 p-2 opacity-50">
                            <span className="text-[9px] font-mono text-slate-300">{metric.id}</span>
                        </div>
                        <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{metric.label}</h3>
                        <div className="flex items-baseline space-x-3">
                            <span className="text-4xl font-black text-brand-navy">{metric.value}</span>
                            <span className="text-xs font-mono font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-sm">{metric.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects Manager */}
            <ProjectManager initialProjects={projects || []} />
        </div>
    );
}
