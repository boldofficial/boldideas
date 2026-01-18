'use client';

import { useState } from 'react';
import Link from 'next/link';

type Lead = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string | null;
    status: string | null;
    value: string | null;
    createdAt: Date | null;
    // ... other fields
};

type Props = {
    leads: Lead[];
    children?: React.ReactNode; // For the server-side add form if needed, or pass as props
};

export default function CRMClient({ leads }: Props) {
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(l =>
        l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { id: 'new', label: 'New Lead', color: 'bg-blue-50 border-blue-200' },
        { id: 'contacted', label: 'Contacted', color: 'bg-yellow-50 border-yellow-200' },
        { id: 'qualified', label: 'Qualified', color: 'bg-indigo-50 border-indigo-200' },
        { id: 'proposal', label: 'Proposal Sent', color: 'bg-purple-50 border-purple-200' },
        { id: 'won', label: 'Won', color: 'bg-green-50 border-green-200' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView('kanban')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'kanban' ? 'bg-white shadow text-brand-navy' : 'text-slate-500'}`}
                    >
                        Kanban Board
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-brand-navy' : 'text-slate-500'}`}
                    >
                        List View
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search leads..."
                    className="p-2 border rounded text-sm w-64 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {view === 'kanban' ? (
                <div className="flex-1 overflow-x-auto pb-8">
                    {/* Changed min-w-max to slightly less restrictive or keep same if user expects horizontal scroll */}
                    <div className="flex gap-6 min-w-max h-full">
                        {columns.map(col => (
                            <div key={col.id} className={`w-72 lg:w-80 rounded-lg border flex flex-col ${col.color}`}>
                                <div className="p-4 font-bold text-slate-700 uppercase tracking-wide text-xs border-b border-black/5 flex justify-between">
                                    <span>{col.label}</span>
                                    <span className="bg-white/50 px-2 rounded-full">{filteredLeads.filter(l => l.status === col.id).length}</span>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                                    {filteredLeads.filter(l => l.status === col.id).map(lead => (
                                        <Link href={`/admin/crm/${lead.id}`} key={lead.id} className="block group">
                                            <div className="bg-white p-4 rounded shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-800 group-hover:text-brand-navy">{lead.firstName} {lead.lastName}</h4>
                                                    {lead.value && <span className="text-xs font-mono font-bold text-green-600">${lead.value}</span>}
                                                </div>
                                                <p className="text-xs text-slate-500 mb-3">{lead.company}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Name</th>
                                <th className="p-4 font-semibold text-slate-600">Company</th>
                                <th className="p-4 font-semibold text-slate-600">Email</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-brand-navy">
                                        <Link href={`/admin/crm/${lead.id}`} className="hover:underline">{lead.firstName} {lead.lastName}</Link>
                                    </td>
                                    <td className="p-4 text-slate-600">{lead.company}</td>
                                    <td className="p-4 text-slate-500">{lead.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                            ${lead.status === 'won' ? 'bg-green-100 text-green-700 border-green-200' :
                                                lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-slate-600">${lead.value || '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
