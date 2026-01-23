'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { getUserProfile } from '@/actions/users';
import NotificationBell from '@/components/NotificationBell';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, role, isLoading, checkAuth, signOut } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/signin');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            getUserProfile(user.id).then(({ data }) => setProfile(data));
        }
    }, [user]);

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Staff Sidebar */}
            <aside className="w-64 bg-[#0A1128] text-white flex flex-col fixed inset-y-0 left-0 z-50 border-r border-[#D4AF37]/10">
                <div className="p-6 border-b border-[#D4AF37]/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden">
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[#D4AF37] font-bold">{user?.email?.[0].toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-sm text-white">{profile?.name || 'Team Member'}</h2>
                                <p className="text-xs text-brand-gold">Team Member</p>
                            </div>
                        </div>
                        <NotificationBell />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/staff"
                        className={`block px-4 py-3 rounded-md text-sm font-medium transition-all ${pathname === '/staff'
                            ? 'bg-[#D4AF37] text-[#0A1128] shadow-lg shadow-[#D4AF37]/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        My Tasks
                    </Link>
                    <Link
                        href="/staff/projects"
                        className={`block px-4 py-3 rounded-md text-sm font-medium transition-all ${pathname === '/staff/projects'
                            ? 'bg-[#D4AF37] text-[#0A1128] shadow-lg shadow-[#D4AF37]/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        My Projects
                    </Link>
                    <Link
                        href="/admin/tickets"
                        className={`block px-4 py-3 rounded-md text-sm font-medium transition-all ${pathname?.startsWith('/admin/tickets')
                            ? 'bg-[#D4AF37] text-[#0A1128] shadow-lg shadow-[#D4AF37]/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Tickets
                    </Link>
                    <Link
                        href="/staff/inbox"
                        className={`block px-4 py-3 rounded-md text-sm font-medium transition-all ${pathname === '/staff/inbox'
                            ? 'bg-[#D4AF37] text-[#0A1128] shadow-lg shadow-[#D4AF37]/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Inbox
                    </Link>
                    <Link
                        href="/staff/settings"
                        className={`block px-4 py-3 rounded-md text-sm font-medium transition-all ${pathname === '/staff/settings'
                            ? 'bg-[#D4AF37] text-[#0A1128] shadow-lg shadow-[#D4AF37]/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#D4AF37]/10">
                    <button
                        onClick={() => signOut().then(() => router.push('/signin'))}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md text-sm font-medium transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
