'use client';

import { useAuthStore } from '@/store/authStore';

export default function DashboardGreeting() {
    const { user } = useAuthStore();

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const name = user?.name || user?.email?.split('@')[0] || 'there';

    return (
        <h1 className="text-3xl font-bold text-brand-navy">
            {greeting}, {name}!
        </h1>
    );
}
