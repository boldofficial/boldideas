'use client';

import { useState, ReactNode } from 'react';
import { LayoutDashboard, FileText, Receipt, ShieldCheck } from 'lucide-react';

interface FinancePageTabsProps {
    dashboardContent: ReactNode;
    invoicesContent: ReactNode;
    expensesContent: ReactNode;
    brandingContent: ReactNode;
}

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'branding', label: 'Branding', icon: ShieldCheck },
];

export default function FinancePageTabs({
    dashboardContent,
    invoicesContent,
    expensesContent,
    brandingContent
}: FinancePageTabsProps) {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white text-brand-navy shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'dashboard' && dashboardContent}
                {activeTab === 'invoices' && invoicesContent}
                {activeTab === 'expenses' && expensesContent}
                {activeTab === 'branding' && brandingContent}
            </div>
        </div>
    );
}
