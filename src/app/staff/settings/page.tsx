'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/actions/users';
import ProfileSettings from '@/components/common/ProfileSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Briefcase, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function StaffSettingsPage() {
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
                        <p className="text-slate-500 font-medium">Failed to load operative profile settings</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/staff" className="hover:text-brand-navy transition-colors">Staff Portal</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-navy font-semibold">Settings</span>
            </div>

            {/* Centered Profile Header */}
            <div className="text-center pb-8 border-b border-slate-100">
                <h1 className="text-3xl font-black text-brand-navy tracking-tight uppercase sm:text-4xl">
                    Operative Settings
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">Manage your professional profile and operational preferences</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content - Form */}
                <div className="lg:col-span-2">
                    <ProfileSettings user={profile} onUpdate={fetchProfile} />
                </div>

                {/* Sidebar - Staff Info */}
                <div className="space-y-6">
                    {/* Operative Stats Card */}
                    <Card className="border-l-4 border-l-brand-gold shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-brand-navy flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Operational Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Duty Status</p>
                                <Badge className="bg-brand-navy text-white hover:bg-brand-navy border-none font-bold tracking-wider px-3 py-1">
                                    ON DUTY
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Position</p>
                                    <p className="font-bold text-brand-navy capitalize text-sm">{profile.role || 'Staff'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Service Start</p>
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
                            
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-brand-gold">
                                    <Award className="w-4 h-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Certified Operative</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Tip */}
                    <Card className="bg-brand-navy border-none text-white shadow-xl">
                        <CardContent className="p-6">
                            <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-brand-gold" />
                            </div>
                            <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Performance Tip</h3>
                            <p className="text-white/70 text-xs leading-relaxed font-medium">
                                Detailed operational notes help the orchestration team assign projects that better match your specific skill set and specialization.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
