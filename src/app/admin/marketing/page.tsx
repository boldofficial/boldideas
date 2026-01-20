import { getCampaigns, getSequences, getAutomations } from '@/actions/marketing';
import MarketingBoard from '@/components/admin/MarketingBoard';

export const metadata = {
    title: 'Marketing Command | Agency OS',
    description: 'Campaign broadcasting and automation sequences.',
};

export default async function MarketingPage() {
    const { data: campaigns } = await getCampaigns();
    const { data: sequences } = await getSequences();
    const { data: automations } = await getAutomations();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Email Marketing</h1>
                    <p className="text-muted-foreground mt-1">Campaign management and automation</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Provider: Resend API
                </div>
            </div>

            <MarketingBoard
                campaigns={campaigns || []}
                sequences={sequences || []}
                automations={automations || []}
            />
        </div>
    );
}
