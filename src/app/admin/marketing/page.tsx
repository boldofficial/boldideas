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
        <div className="p-8 h-full">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Marketing_Ops</h1>
                    <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">Outbound_Transmission_Control_Center</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Provider: RESEND_API</span>
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
