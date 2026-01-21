import { getInvoices, getClients } from '@/actions/finance';
import { getFinanceAnalytics, getExpenses } from '@/actions/financeEnhancements';
import InvoiceManager from '@/components/admin/InvoiceManager';
import CreateInvoiceModal from '@/components/admin/CreateInvoiceModal';
import FinanceDashboard from '@/components/admin/FinanceDashboard';
import ExpenseManager from '@/components/admin/ExpenseManager';
import FinancePageTabs from '@/components/admin/FinancePageTabs';
import BrandingManager from '@/components/admin/BrandingManager';
import { Landmark } from 'lucide-react';

export const metadata = {
    title: "Finance | Bold Ideas",
};

export default async function FinancePage() {
    const [
        { data: invoices },
        { data: clients },
        { data: analytics },
        { data: expenses }
    ] = await Promise.all([
        getInvoices(),
        getClients(),
        getFinanceAnalytics(),
        getExpenses()
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Finance</h1>
                    <p className="text-slate-500 text-sm mt-2">Manage invoices, payments, and expenses</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                        <Landmark className="w-3 h-3" />
                        <span className="text-xs font-medium">Connected</span>
                    </div>
                    <CreateInvoiceModal clients={clients || []} />
                </div>
            </header>

            <FinancePageTabs
                dashboardContent={
                    analytics ? <FinanceDashboard analytics={analytics} /> : <p>Loading analytics...</p>
                }
                invoicesContent={
                    <InvoiceManager initialInvoices={invoices || []} clients={clients || []} />
                }
                expensesContent={
                    <ExpenseManager initialExpenses={expenses || []} />
                }
                brandingContent={
                    <BrandingManager />
                }
            />
        </div>
    );
}
