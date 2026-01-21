'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/actions/users';
import ProfileSettings from '@/components/common/ProfileSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings } from 'lucide-react';

export default function ClientSettingsPage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        if (user) {
            setLoading(true);
            const { data } = await getUserProfile(user.id);
            setProfile(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <Card>
                <CardContent className="py-16 text-center text-slate-400">
                    <p>Failed to load profile settings</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-brand-navy" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-brand-navy">Account Settings</h1>
                    <p className="text-slate-500 text-sm">Manage your profile and preferences</p>
                </div>
            </div>

            {/* Profile Settings Component */}
            <ProfileSettings user={profile} onUpdate={fetchProfile} />

            {/* Account Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-brand-navy flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Account Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 uppercase text-xs tracking-wide mb-1">Account Type</p>
                            <p className="font-medium capitalize">{profile.role || 'Client'}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 uppercase text-xs tracking-wide mb-1">Member Since</p>
                            <p className="font-medium">
                                {profile.createdAt 
                                    ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })
                                    : '-'
                                }
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 pt-2 border-t">
                        Need to delete your account? Please contact our support team.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
