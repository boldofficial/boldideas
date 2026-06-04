import { getLeads, createLead, getAnalyticsData, getCrmStaff } from '@/actions/crm';
import CRMClient from '@/components/crm/CRMClient';

// Wrapper for form action type compatibility
async function handleCreateLead(formData: FormData) {
    'use server';
    await createLead(formData);
}

export default async function CRMPage() {
    const [leadsResult, analyticsResult, staffResult] = await Promise.all([
        getLeads(),
        getAnalyticsData(),
        getCrmStaff(),
    ]);

    const leads = leadsResult.data || [];
    const analyticsData = analyticsResult.success ? analyticsResult.data : null;
    const staff = staffResult.data || [];

    return (
        <div className="min-h-screen bg-slate-100/70 p-4 md:p-6 xl:p-8">
            <div className="mb-6 rounded-sm border border-slate-200 bg-white px-5 py-5 shadow-sm md:px-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-brand-gold">Sales Desk</p>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-brand-navy md:text-3xl">CRM Pipeline</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Manage website inquiries, quote requests, callbacks, and deal follow-up from one operational view.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-sm border border-slate-200 bg-slate-50 text-center">
                        <HeaderStat label="Open" value={String(leads.filter((lead) => !['won', 'lost'].includes(lead.status || '')).length)} />
                        <HeaderStat label="Quote Requests" value={String(leads.filter((lead) => (lead.serviceInterest || '').toLowerCase().includes('quote')).length)} />
                        <HeaderStat label="Team" value={String(staff.length)} />
                    </div>
                </div>
            </div>

            <CRMClient
                leads={leads}
                analyticsData={analyticsData}
                staff={staff}
                createLeadAction={handleCreateLead}
            />
        </div>
    );
}

function HeaderStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-24 px-4 py-3">
            <p className="text-lg font-black text-brand-navy">{value}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
        </div>
    );
}
