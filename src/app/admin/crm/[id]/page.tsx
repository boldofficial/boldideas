import { getLead, getInteractions, updateLead } from '@/actions/crm';
import ActivityTimeline from '@/components/crm/ActivityTimeline';

async function handleUpdateLead(formData: FormData) {
    'use server';
    await updateLead(formData);
}

function toDateTimeLocal(value: Date | string | null) {
    if (!value) return '';
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [leadResult, interactionsResult] = await Promise.all([
        getLead(id),
        getInteractions(id),
    ]);

    const lead = leadResult.data;
    const interactions = interactionsResult.data || [];

    if (!lead) return <div>Lead not found</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{lead.firstName} {lead.lastName}</h1>
                    <p className="text-slate-500">{lead.company} • {lead.email}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        lead.status === 'qualified' ? 'bg-indigo-100 text-indigo-700' :
                        lead.status === 'proposal' ? 'bg-purple-100 text-purple-700' :
                        lead.status === 'won' ? 'bg-green-100 text-green-700' :
                        lead.status === 'lost' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                        {lead.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="font-bold text-lg mb-4">Lead Profile</h2>
                    <form action={handleUpdateLead} className="grid gap-4 md:grid-cols-2">
                        <input type="hidden" name="id" value={id} />
                        <Field label="First name" name="firstName" defaultValue={lead.firstName} required />
                        <Field label="Last name" name="lastName" defaultValue={lead.lastName || ''} />
                        <Field label="Email" name="email" type="email" defaultValue={lead.email} required />
                        <Field label="Phone" name="phone" defaultValue={lead.phone || ''} />
                        <Field label="Company" name="company" defaultValue={lead.company || ''} />
                        <Field label="Estimated value" name="value" defaultValue={lead.value || ''} />

                        <div>
                            <label className="text-xs text-slate-500 uppercase">Status</label>
                            <select name="status" defaultValue={lead.status || 'new'} className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-sm">
                                <option value="new">New Lead</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="proposal">Proposal Sent</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 uppercase">Priority</label>
                            <select name="priority" defaultValue={lead.priority || 'medium'} className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <Field label="Source" name="source" defaultValue={lead.source || ''} />
                        <Field label="Next follow-up" name="nextFollowUpAt" type="datetime-local" defaultValue={toDateTimeLocal(lead.nextFollowUpAt)} />
                        <Field label="Service interest" name="serviceInterest" defaultValue={lead.serviceInterest || ''} className="md:col-span-2" />
                        <Field label="Lost reason" name="lostReason" defaultValue={lead.lostReason || ''} className="md:col-span-2" />

                        <div className="md:col-span-2">
                            <label className="text-xs text-slate-500 uppercase">Notes</label>
                            <textarea name="notes" defaultValue={lead.notes || ''} rows={5} className="mt-1 w-full rounded border border-slate-200 p-3 text-sm text-slate-700" />
                        </div>

                        <div className="md:col-span-2">
                            <button className="rounded bg-brand-navy px-5 py-3 text-sm font-bold text-white">Save Lead</button>
                        </div>
                    </form>
                </div>

                <ActivityTimeline leadId={id} interactions={interactions} />
            </div>
        </div>
    );
}

function Field({
    label,
    name,
    defaultValue,
    type = 'text',
    required = false,
    className = '',
}: {
    label: string;
    name: string;
    defaultValue: string;
    type?: string;
    required?: boolean;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="text-xs text-slate-500 uppercase">{label}</label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                className="mt-1 w-full rounded border border-slate-200 p-2 text-sm"
            />
        </div>
    );
}
