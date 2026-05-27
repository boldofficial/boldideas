'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { getUserProfile } from '@/actions/users';
import NotificationBell from '@/components/NotificationBell';
import { LayoutDashboard, FolderKanban, MessageCircle, LogOut, Ticket, Settings } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isLoading, checkAuth, signOut } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
        return;
      }

      // Only allow client role (and admin for testing)
      if (role !== 'client' && role !== 'admin') {
        router.push('/');
        return;
      }

      setAuthorized(true);
    }
  }, [user, role, isLoading, router]);

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then(({ data }) => setProfile(data));
    }
  }, [user]);

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="text-brand-gold text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/client', label: 'Dashboard', icon: LayoutDashboard, exactMatch: true },
    { href: '/client/projects', label: 'My Projects', icon: FolderKanban },
    { href: '/client/tickets', label: 'Tickets', icon: Ticket },
    { href: '/client/messages', label: 'Messages', icon: MessageCircle },
    { href: '/client/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string, exactMatch?: boolean) => {
    if (exactMatch) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Client Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex flex-col fixed inset-y-0 left-0 z-50 border-r border-brand-gold/10">
        <div className="p-6 border-b border-brand-gold/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-brand-gold font-bold">{user?.email?.[0].toUpperCase()}</span>
                )}
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">{profile?.name || 'Client'}</h2>
                <p className="text-xs text-brand-gold">Client Portal</p>
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  isActive(item.href, item.exactMatch)
                    ? 'bg-brand-gold text-brand-navy shadow-lg shadow-brand-gold/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-gold/10">
          <Link href="/" className="block text-center text-xs text-slate-500 hover:text-brand-gold mb-4 transition-colors">
            Bold <span className="text-brand-gold">Ideas</span>
          </Link>
          <button
            onClick={() => signOut().then(() => router.push('/signin'))}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
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
