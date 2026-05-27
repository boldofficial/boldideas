import { getLeads, createLead, getAnalyticsData } from '@/actions/crm';
import CRMClient from '@/components/crm/CRMClient';

// Wrapper for form action type compatibility
async function handleCreateLead(formData: FormData) {
    'use server';
    await createLead(formData);
}

export default async function CRMPage() {
    const [leadsResult, analyticsResult] = await Promise.all([
        getLeads(),
        getAnalyticsData(),
    ]);

    const leads = leadsResult.data || [];
    const analyticsData = analyticsResult.success ? analyticsResult.data : null;

    return (
        <div className="p-8 min-h-screen flex flex-col">
            <div className="mb-8 shrink-0">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-brand-gold">CRM</p>
                        <h1 className="text-3xl font-bold text-slate-800">Pipeline</h1>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-slate-500">
                        Track every website inquiry, booking request, and manual opportunity from first touch to won work.
                    </p>
                </div>

                <form action={handleCreateLead} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-12">
                    <input name="firstName" placeholder="First name" className="rounded border border-slate-200 p-2 text-sm lg:col-span-2" required />
                    <input name="lastName" placeholder="Last name" className="rounded border border-slate-200 p-2 text-sm lg:col-span-2" />
                    <input name="email" placeholder="Email" className="rounded border border-slate-200 p-2 text-sm lg:col-span-3" required />
                    <input name="phone" placeholder="Phone" className="rounded border border-slate-200 p-2 text-sm lg:col-span-2" />
                    <input name="value" placeholder="Value ($)" className="rounded border border-slate-200 p-2 text-sm lg:col-span-1" />
                    <select name="priority" defaultValue="medium" className="rounded border border-slate-200 bg-white p-2 text-sm lg:col-span-2">
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                    </select>
                    <input name="company" placeholder="Company" className="rounded border border-slate-200 p-2 text-sm lg:col-span-3" />
                    <input name="serviceInterest" placeholder="Service interest" className="rounded border border-slate-200 p-2 text-sm lg:col-span-3" />
                    <select name="source" defaultValue="manual" className="rounded border border-slate-200 bg-white p-2 text-sm lg:col-span-2">
                        <option value="manual">Manual</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="ads">Ads</option>
                        <option value="campaign">Campaign</option>
                    </select>
                    <input name="nextFollowUpAt" type="datetime-local" className="rounded border border-slate-200 p-2 text-sm lg:col-span-2" />
                    <button className="rounded bg-brand-navy px-4 py-2 text-sm font-bold text-white lg:col-span-2">Add Deal</button>
                </form>
            </div>

            <CRMClient leads={leads} analyticsData={analyticsData} />
        </div>
    );
}
