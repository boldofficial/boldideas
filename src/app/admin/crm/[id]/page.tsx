import { getLead, getInteractions, addInteraction } from '@/actions/crm';

// Wrapper for form action type compatibility
async function handleAddInteraction(formData: FormData) {
    'use server';
    await addInteraction(formData);
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: lead } = await getLead(id);
    const { data: interactions } = await getInteractions(id);

    if (!lead) return <div>Lead not found</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{lead.firstName} {lead.lastName}</h1>
                    <p className="text-slate-500">{lead.company} • {lead.email}</p>
                </div>
                <span className="bg-brand-navy text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-widest">{lead.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow border border-slate-200">
                    <h2 className="font-bold text-lg mb-4">Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 uppercase">Phone</label>
                            <p>{lead.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase">Value</label>
                            <p className="font-mono text-green-700 font-bold">${lead.value || '0'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase">Source</label>
                            <p>{lead.source || 'Direct'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase">Notes</label>
                            <p className="text-sm text-slate-600">{lead.notes || 'No notes.'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded shadow border border-slate-200">
                    <h2 className="font-bold text-lg mb-4">Interactions</h2>

                    <form action={handleAddInteraction} className="mb-6 space-y-2">
                        <input type="hidden" name="leadId" value={id} />
                        <div className="flex gap-2">
                            <select name="type" className="p-2 border rounded text-sm bg-white" required>
                                <option value="note">Note</option>
                                <option value="call">Call</option>
                                <option value="email">Email</option>
                                <option value="meeting">Meeting</option>
                            </select>
                            <input name="notes" placeholder="Log details..." className="flex-1 p-2 border rounded text-sm" required />
                            <button className="bg-brand-navy text-white px-3 py-1 rounded text-sm font-bold">Add</button>
                        </div>
                    </form>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {interactions?.map((item: any) => (
                            <div key={item.id} className="bg-white p-4 rounded border border-slate-200 text-sm">
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold uppercase text-xs text-slate-500">{item.type}</span>
                                    <span className="text-slate-400 text-xs">{new Date(item.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-slate-800">{item.notes}</p>
                            </div>
                        ))}
                        {(!interactions || interactions.length === 0) && (
                            <p className="text-center text-slate-400 italic text-sm py-4">No interactions logged yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
