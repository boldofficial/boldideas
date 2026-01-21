'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/actions/users';
import ProfileSettings from '@/components/common/ProfileSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, Info, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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
            <div className="flex items-center justify-center p-20 min-h-[400px]">
                <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin shadow-sm"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8">
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="py-16 text-center">
                        <p className="text-slate-500 font-medium">Failed to load profile settings</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/client" className="hover:text-brand-navy transition-colors">Portal Home</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-navy font-semibold">Account Settings</span>
            </div>

            {/* Centered Profile Header */}
            <div className="text-center pb-8 border-b border-slate-100">
                <h1 className="text-3xl font-black text-brand-navy tracking-tight uppercase sm:text-4xl">
                    Account Settings
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">Manage your profile and platform preferences</p>
            </div>

            {/* Two Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content - Form */}
                <div className="lg:col-span-2">
                    <ProfileSettings user={profile} onUpdate={fetchProfile} />
                </div>

                {/* Sidebar - Info Cards */}
                <div className="space-y-6">
                    {/* Account Summary Card */}
                    <Card className="border-l-4 border-l-brand-navy shadow-sm overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-brand-navy flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Account Status</p>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold tracking-wider px-3 py-1">
                                    ACTIVE
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Account Type</p>
                                    <p className="font-bold text-brand-navy capitalize text-sm">{profile.role || 'Client'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Member Since</p>
                                    <p className="font-bold text-brand-navy text-sm">
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
                            
                            <div className="pt-4 border-t border-slate-100 italic">
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Need to delete your account? Please contact our support team for secure account termination processing.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Tip Card */}
                    <Card className="bg-brand-navy border-none text-white shadow-xl">
                        <CardContent className="p-6">
                            <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center mb-4">
                                <CreditCard className="w-5 h-5 text-brand-gold" />
                            </div>
                            <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Security Tip</h3>
                            <p className="text-white/70 text-xs leading-relaxed font-medium">
                                Keep your profile information up to date to ensure seamless communication and project deliveries. Never share your credentials with anyone.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
