'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/actions/users';
import ProfileSettings from '@/components/common/ProfileSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, ChevronRight, Activity, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function AdminSettingsPage() {
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
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardContent className="py-16 text-center">
                        <p className="text-slate-500 font-medium">Failed to load admin profile settings</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/admin" className="hover:text-brand-navy transition-colors">Admin Dashboard</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-navy font-semibold">Settings</span>
            </div>

            {/* Centered Profile Header */}
            <div className="text-center pb-8 border-b border-slate-100">
                <h1 className="text-3xl font-black text-brand-navy tracking-tight uppercase sm:text-4xl">
                    Admin Settings
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">Manage your administrative profile and system preferences</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content - Form */}
                <div className="lg:col-span-2">
                    <ProfileSettings user={profile} onUpdate={fetchProfile} />
                </div>

                {/* Sidebar - Admin Info */}
                <div className="space-y-6">
                    {/* Admin Account Card */}
                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-brand-navy flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                Admin Privileges
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Authority Level</p>
                                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none font-bold tracking-wider px-3 py-1">
                                    SUPER ADMIN
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">System Role</p>
                                    <p className="font-bold text-brand-navy capitalize text-sm">{profile.role || 'Admin'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Account Created</p>
                                    <p className="font-bold text-brand-navy text-sm">
                                        {profile.createdAt 
                                            ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                                                month: 'long', 
                                                day: 'numeric',
                                                year: 'numeric' 
                                            })
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                                    As an administrator, you have full override capabilities throughout the ecosystem.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Activity Hint */}
                    <Card className="bg-brand-navy border-none text-white shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">System Load</p>
                                    <p className="text-lg font-black text-emerald-400">NOMINAL</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-white mb-2 uppercase tracking-tight flex items-center gap-2 text-sm">
                                <Terminal className="w-4 h-4 text-brand-gold" />
                                Admin Console
                            </h3>
                            <p className="text-white/70 text-xs leading-relaxed font-medium">
                                Monitor system performance and user logs from your centralized dashboard.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
