'use client';

import { toggleUserStatus } from '@/actions/team';
import { useState } from 'react';

type Props = {
    userId: string;
    initialStatus: boolean;
};

export default function UserStatusToggle({ userId, initialStatus }: Props) {
    const [isActive, setIsActive] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        const newStatus = !isActive;
        const result = await toggleUserStatus(userId, newStatus);
        if (result.success) {
            setIsActive(newStatus);
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${
                isActive ? 'bg-brand-navy' : 'bg-slate-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isActive ? 'Deactivate user' : 'Activate user'}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
}
