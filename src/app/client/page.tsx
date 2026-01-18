'use client';

import { useEffect, useState } from 'react';
import { getInternalProjects } from '@/actions/agency';
import { getProjectMilestones } from '@/actions/pm';
import { getInvoices } from '@/actions/finance';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
    const { user, role, isLoading } = useAuthStore();
    const [projects, setProjects] = useState<any[]>([]);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            await useAuthStore.getState().checkAuth();
        };
        init();
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/signin');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user) {
                const { data: projData } = await getInternalProjects(user.id);
                setProjects(projData || []);

                // If there is an active project, fetch its milestones
                if (projData && projData.length > 0) {
                    const { data: msData } = await getProjectMilestones(projData[0].id);
                    setMilestones(msData || []);
                }

                // Fetch invoices
                const { data: invData } = await getInvoices(user.id);
                setInvoices(invData || []);
            }
        };
        fetchProjects();
    }, [user]);

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-brand-navy/10 pb-8">
                    <div>
                        <h1 className="text-3xl font-black text-brand-navy">Client Portal</h1>
                        <p className="text-slate-500 font-mono text-sm">Overview for {user?.email}</p>
                    </div>
                    <div className="bg-brand-gold text-brand-navy px-4 py-1 rounded text-xs font-bold uppercase tracking-widest">
                        Client Access
                    </div>
                </header>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Active Projects</h2>

                    <div className="grid grid-cols-1 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-gold relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1 rounded-bl text-xs font-bold uppercase text-slate-500">
                                    {project.status}
                                </div>
                                <h3 className="text-2xl font-black text-brand-navy mb-2">{project.title}</h3>
                                <p className="text-slate-600 mb-8">{project.description || 'Project is underway.'}</p>

                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                                    <div
                                        className="bg-brand-navy h-full transition-all duration-1000"
                                        style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">{project.progress || 0}% Complete</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{project.completedTasks || 0} / {project.totalTasks || 0} Tasks</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>Kickoff: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</span>
                                    <span>Target: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Ongoing'}</span>
                                </div>

                                {/* Milestones Preview */}
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase">Recent Milestones</h4>
                                    <div className="space-y-3">
                                        {milestones.map(ms => (
                                            <div key={ms.id} className="flex justify-between items-center text-sm">
                                                <span className={`${ms.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{ms.title}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${ms.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{ms.status}</span>
                                            </div>
                                        ))}
                                        {milestones.length === 0 && <p className="text-slate-400 text-xs text-center italic">No milestones set.</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center p-12 bg-white rounded border border-dashed border-slate-300 text-slate-400">
                                No active projects linked to your account.
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Invoices</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">ID</th>
                                    <th className="p-4 font-semibold text-slate-600">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-slate-100">
                                        <td className="p-4 font-mono text-xs text-slate-500">#{inv.id.slice(0, 8)}</td>
                                        <td className="p-4 font-bold text-slate-900">${inv.totalAmount}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}</td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">No invoices found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
