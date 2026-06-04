import Link from 'next/link';
import type { ReactNode } from 'react';
import {
    getLead,
    getInteractions,
    updateLead,
    getCrmStaff,
    convertLeadToClient,
    createProjectFromLead,
    createInvoiceFromLead,
} from '@/actions/crm';
import ActivityTimeline from '@/components/crm/ActivityTimeline';
import {
    ArrowLeft,
    Banknote,
    Building2,
    CalendarClock,
    FileText,
    FolderOpen,
    Link2,
    Mail,
    Phone,
    Receipt,
    Send,
    UserRound,
} from 'lucide-react';

async function handleUpdateLead(formData: FormData) {
    'use server';
    await updateLead(formData);
}

async function handleConvertClient(formData: FormData) {
    'use server';
    await convertLeadToClient(formData);
}

async function handleCreateProject(formData: FormData) {
    'use server';
    await createProjectFromLead(formData);
}

async function handleCreateInvoice(formData: FormData) {
    'use server';
    await createInvoiceFromLead(formData);
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
    const [leadResult, interactionsResult, staffResult] = await Promise.all([
        getLead(id),
        getInteractions(id),
        getCrmStaff(),
    ]);

    const lead = leadResult.data;
    const interactions = interactionsResult.data || [];
    const staff = staffResult.data || [];

    if (!lead) {
        return (
            <div className="p-8">
                <div className="rounded-sm border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-lg font-black text-brand-navy">Lead not found</p>
                    <Link href="/admin/crm" className="mt-4 inline-flex text-sm font-bold text-brand-gold">Back to CRM</Link>
                </div>
            </div>
        );
    }

    const quoteDetails = parseStructuredNotes(lead.notes || '');
    const followUpState = getFollowUpState(lead.nextFollowUpAt);

    return (
        <div className="min-h-screen bg-slate-100/70 p-4 md:p-6 xl:p-8">
            <div className="mb-5 flex flex-col gap-4 rounded-sm border border-slate-200 bg-white px-5 py-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <Link href="/admin/crm" className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400 transition hover:text-brand-navy">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        CRM
                    </Link>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-black tracking-tight text-brand-navy md:text-3xl">{lead.firstName} {lead.lastName}</h1>
                        <StatusPill status={lead.status || 'new'} />
                        <PriorityPill priority={lead.priority || 'medium'} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{lead.company || 'No company'} / {lead.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <a href={`mailto:${lead.email}`} className="inline-flex h-10 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-black uppercase tracking-[0.14em] text-slate-600 transition hover:border-brand-gold hover:text-brand-navy">
                        <Mail className="h-4 w-4" />
                        Email
                    </a>
                    {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="inline-flex h-10 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-black uppercase tracking-[0.14em] text-slate-600 transition hover:border-brand-gold hover:text-brand-navy">
                            <Phone className="h-4 w-4" />
                            Call
                        </a>
                    )}
                    <a href="#conversion" className="inline-flex h-10 items-center gap-2 rounded-sm bg-brand-navy px-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand-gold hover:text-brand-navy">
                        <Receipt className="h-4 w-4" />
                        Convert
                    </a>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
                <aside className="space-y-5">
                    <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Contact</p>
                        <div className="mt-4 space-y-3">
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone || 'Not provided'} />
                            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Company" value={lead.company || 'Not provided'} />
                            <InfoRow icon={<UserRound className="h-4 w-4" />} label="Owner" value={lead.assignedToName || lead.assignedToEmail || 'Unassigned'} />
                        </div>
                    </section>

                    <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Deal Snapshot</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <Snapshot label="Value" value={`$${Number(lead.value || 0).toLocaleString()}`} />
                            <Snapshot label="Source" value={formatLabel(lead.source || 'unknown')} />
                            <Snapshot label="Created" value={lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'} />
                            <Snapshot label="Updated" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '-'} />
                        </div>
                    </section>
                </aside>

                <main className="space-y-5">
                    <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">Deal Profile</p>
                                <h2 className="mt-1 text-lg font-black text-brand-navy">Lead details and sales context</h2>
                            </div>
                            <div className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${followUpState === 'overdue' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                <CalendarClock className="h-4 w-4" />
                                {followUpLabel(lead.nextFollowUpAt)}
                            </div>
                        </div>

                        <form action={handleUpdateLead} className="mt-5 grid gap-4 md:grid-cols-2">
                            <input type="hidden" name="id" value={id} />
                            <Field label="First name" name="firstName" defaultValue={lead.firstName} required />
                            <Field label="Last name" name="lastName" defaultValue={lead.lastName || ''} />
                            <Field label="Email" name="email" type="email" defaultValue={lead.email} required />
                            <Field label="Phone" name="phone" defaultValue={lead.phone || ''} />
                            <Field label="Company" name="company" defaultValue={lead.company || ''} />
                            <Field label="Estimated value" name="value" defaultValue={lead.value || ''} />

                            <SelectField label="Status" name="status" defaultValue={lead.status || 'new'}>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="proposal">Proposal</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                            </SelectField>

                            <SelectField label="Priority" name="priority" defaultValue={lead.priority || 'medium'}>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </SelectField>

                            <Field label="Source" name="source" defaultValue={lead.source || ''} />
                            <Field label="Next follow-up" name="nextFollowUpAt" type="datetime-local" defaultValue={toDateTimeLocal(lead.nextFollowUpAt)} />
                            <SelectField label="Owner" name="assignedTo" defaultValue={lead.assignedTo || ''}>
                                <option value="">Unassigned</option>
                                {staff.map((person) => (
                                    <option key={person.id} value={person.id}>{person.name || person.email}</option>
                                ))}
                            </SelectField>
                            <Field label="Service interest" name="serviceInterest" defaultValue={lead.serviceInterest || ''} />
                            <Field label="Lost reason" name="lostReason" defaultValue={lead.lostReason || ''} className="md:col-span-2" />

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Notes</label>
                                <textarea name="notes" defaultValue={lead.notes || ''} rows={6} className="mt-1.5 w-full rounded-sm border border-slate-200 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" />
                            </div>

                            <div className="md:col-span-2">
                                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-brand-navy px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-brand-gold hover:text-brand-navy">
                                    Save Lead
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </section>

                    <ActivityTimeline leadId={id} interactions={interactions} />
                </main>

                <aside className="space-y-5">
                    <section id="conversion" className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Next Actions</p>
                        <div className="mt-4 space-y-2">
                            <ActionLink href={`mailto:${lead.email}`} icon={<Mail className="h-4 w-4" />} title="Send email" body="Continue the conversation from this lead record." />
                            {lead.phone && <ActionLink href={`tel:${lead.phone}`} icon={<Phone className="h-4 w-4" />} title="Call lead" body="Use the timeline to log the outcome after the call." />}
                        </div>
                    </section>

                    <section className="rounded-sm border border-brand-gold/30 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">Conversion</p>
                        <h2 className="mt-1 text-base font-black text-brand-navy">Move this lead into delivery</h2>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            These actions reuse the lead email as the client identity and log the result in the activity timeline.
                        </p>

                        <div className="mt-4 space-y-2 border border-slate-200 bg-slate-50 p-3">
                            <LinkedRecord
                                icon={<UserRound className="h-4 w-4" />}
                                label="Client"
                                href={lead.clientId ? '/admin/users' : undefined}
                                value={lead.clientId ? 'Linked' : 'Not linked'}
                            />
                            <LinkedRecord
                                icon={<FolderOpen className="h-4 w-4" />}
                                label="Project"
                                href={lead.projectId ? `/admin/projects/${lead.projectId}` : undefined}
                                value={lead.projectId ? 'Project created' : 'Not created'}
                            />
                            <LinkedRecord
                                icon={<FileText className="h-4 w-4" />}
                                label="Invoice"
                                href={lead.invoiceId ? `/admin/finance/invoice/${lead.invoiceId}` : undefined}
                                value={lead.invoiceId ? 'Draft linked' : 'Not created'}
                            />
                        </div>

                        <form action={handleConvertClient} className="mt-4">
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:bg-white">
                                <UserRound className="h-4 w-4" />
                                Create / Link Client
                            </button>
                        </form>

                        <form action={handleCreateProject} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                            <input type="hidden" name="leadId" value={lead.id} />
                            <MiniField label="Project title" name="title" defaultValue={`${lead.company || `${lead.firstName} ${lead.lastName}`.trim()} - ${lead.serviceInterest || 'Client Project'}`} />
                            <div className="grid grid-cols-2 gap-3">
                                <MiniField label="Budget" name="budget" defaultValue={lead.value || ''} />
                                <MiniField label="Due date" name="dueDate" type="date" defaultValue="" />
                            </div>
                            <select name="managerId" defaultValue={lead.assignedTo || ''} className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-brand-navy">
                                <option value="">Use current user</option>
                                {staff.map((person) => (
                                    <option key={person.id} value={person.id}>{person.name || person.email}</option>
                                ))}
                            </select>
                            <button className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-navy px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand-gold hover:text-brand-navy">
                                <Building2 className="h-4 w-4" />
                                {lead.projectId ? 'Project Already Linked' : 'Create Project'}
                            </button>
                        </form>

                        <form action={handleCreateInvoice} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                            <input type="hidden" name="leadId" value={lead.id} />
                            <MiniField label="Invoice item" name="itemTitle" defaultValue={lead.serviceInterest || 'Professional Services'} />
                            <div className="grid grid-cols-[1fr_90px] gap-3">
                                <MiniField label="Amount" name="amount" defaultValue={lead.value || ''} />
                                <MiniField label="Currency" name="currency" defaultValue="USD" />
                            </div>
                            <MiniField label="Due date" name="dueDate" type="date" defaultValue="" />
                            <button className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-gold px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-brand-navy transition hover:bg-brand-navy hover:text-white">
                                <Banknote className="h-4 w-4" />
                                {lead.invoiceId ? 'Invoice Already Linked' : 'Create Draft Invoice'}
                            </button>
                        </form>
                    </section>

                    <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Quote Intelligence</p>
                        <div className="mt-4 space-y-3">
                            <QuoteRow label="Request Type" value={quoteDetails['Package / request type'] || lead.serviceInterest || 'Not captured'} />
                            <QuoteRow label="Requested Features" value={quoteDetails['Requested features'] || 'Not captured'} />
                            <QuoteRow label="Budget" value={quoteDetails.Budget || 'Not captured'} />
                            <QuoteRow label="Timeline" value={quoteDetails.Timeline || 'Not captured'} />
                            <QuoteRow label="Callback" value={quoteDetails['Callback preference'] || 'Not captured'} />
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-slate-400">{icon}</span>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-0.5 break-words text-sm font-bold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function Snapshot({ label, value }: { label: string; value: string }) {
    return (
        <div className="border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-black text-brand-navy">{value}</p>
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
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                className="mt-1.5 h-10 w-full rounded-sm border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
            />
        </div>
    );
}

function MiniField({
    label,
    name,
    defaultValue,
    type = 'text',
}: {
    label: string;
    name: string;
    defaultValue: string;
    type?: string;
}) {
    return (
        <div>
            <label className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                className="mt-1.5 h-10 w-full rounded-sm border border-slate-200 px-3 text-xs font-bold text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
            />
        </div>
    );
}

function SelectField({ label, name, defaultValue, children }: { label: string; name: string; defaultValue: string; children: ReactNode }) {
    return (
        <div>
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</label>
            <select name={name} defaultValue={defaultValue} className="mt-1.5 h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10">
                {children}
            </select>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
        new: 'border-slate-200 bg-slate-50 text-slate-700',
        contacted: 'border-amber-200 bg-amber-50 text-amber-700',
        qualified: 'border-blue-200 bg-blue-50 text-blue-700',
        proposal: 'border-brand-gold/30 bg-brand-gold/10 text-amber-800',
        won: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        lost: 'border-rose-200 bg-rose-50 text-rose-700',
    };
    return <span className={`rounded-sm border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${styles[status] || styles.new}`}>{formatLabel(status)}</span>;
}

function PriorityPill({ priority }: { priority: string }) {
    const style = priority === 'high' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-600';
    return <span className={`rounded-sm border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${style}`}>{priority} priority</span>;
}

function ActionLink({ href, icon, title, body }: { href: string; icon: ReactNode; title: string; body: string }) {
    return (
        <Link href={href} className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-3 transition hover:border-brand-gold hover:bg-white">
            <span className="text-brand-gold">{icon}</span>
            <span>
                <span className="block text-sm font-black text-brand-navy">{title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{body}</span>
            </span>
        </Link>
    );
}

function LinkedRecord({
    icon,
    label,
    value,
    href,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    href?: string;
}) {
    const content = (
        <>
            <span className="text-slate-400">{icon}</span>
            <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
                <span className="block truncate text-xs font-black text-brand-navy">{value}</span>
            </span>
            {href && <Link2 className="h-3.5 w-3.5 text-brand-gold" />}
        </>
    );

    if (!href) {
        return <div className="flex items-center gap-3 opacity-70">{content}</div>;
    }

    return (
        <Link href={href} className="flex items-center gap-3 transition hover:bg-white">
            {content}
        </Link>
    );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{value}</p>
        </div>
    );
}

function parseStructuredNotes(notes: string) {
    return notes.split('\n').reduce<Record<string, string>>((acc, line) => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length > 0) acc[key.trim()] = rest.join(':').trim();
        return acc;
    }, {});
}

function getFollowUpState(value: Date | string | null) {
    if (!value) return 'unset';
    const followUp = new Date(value);
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    if (followUp < now) return 'overdue';
    if (followUp <= todayEnd) return 'today';
    return 'future';
}

function followUpLabel(value: Date | string | null) {
    if (!value) return 'No follow-up set';
    const state = getFollowUpState(value);
    const date = new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (state === 'overdue') return `Overdue: ${date}`;
    if (state === 'today') return `Due today: ${date}`;
    return `Follow-up: ${date}`;
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ');
}
