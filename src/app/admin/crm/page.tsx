import { getLeads, createLead } from '@/actions/crm';
import CRMClient from '@/components/crm/CRMClient';

// Wrapper for form action type compatibility
async function handleCreateLead(formData: FormData) {
    'use server';
    await createLead(formData);
}

export default async function CRMPage() {
    const { data: leads } = await getLeads();

    return (
        <div className="p-8 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <h1 className="text-3xl font-bold text-slate-800">Pipeline</h1>
                <form action={handleCreateLead} className="flex gap-2">
                    <input name="firstName" placeholder="First Name" className="p-2 border rounded text-sm w-32" required />
                    <input name="lastName" placeholder="Last Name" className="p-2 border rounded text-sm w-32" required />
                    <input name="email" placeholder="Email" className="p-2 border rounded text-sm w-48" required />
                    <input name="value" placeholder="Value ($)" className="p-2 border rounded text-sm w-24" />
                    <button className="bg-brand-navy text-white px-4 py-2 rounded text-sm font-bold">Add Deal</button>
                </form>
            </div>

            <CRMClient leads={leads || []}>
                {/* Optional: Pass server form slot here if needed */}
            </CRMClient>
        </div>
    );
}
