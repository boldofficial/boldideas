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
        <div className="perfex-crm min-h-screen bg-[#f4f6f8] px-0 py-0">
            <CRMClient
                leads={leads}
                analyticsData={analyticsData}
                staff={staff}
                createLeadAction={handleCreateLead}
            />
        </div>
    );
}
