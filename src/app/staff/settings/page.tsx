'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/actions/users';
import ProfileSettings from '@/components/common/ProfileSettings';

export default function StaffSettingsPage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);

    const fetchProfile = async () => {
        if (user) {
            const { data } = await getUserProfile(user.id);
            setProfile(data);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    if (!profile) return <div>Loading Profile...</div>;

    return (
        <div>
            <h1 className="text-2xl font-black text-[#0A1128] mb-8 uppercase tracking-tight">Operative Settings</h1>
            <ProfileSettings user={profile} onUpdate={fetchProfile} />
        </div>
    );
}
