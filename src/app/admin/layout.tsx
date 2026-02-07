
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import { getUserProfile } from '@/actions/users';
import { Settings } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, role, isLoading, checkAuth, signOut } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
        return;
      }

      // 1. Basic Admin/Staff Check
      if (!isAdmin && role !== 'staff') {
        router.push('/');
        return;
      }

      // 2. RBAC - Restricted Routes for Staff
      const restrictedRoutes = ['/admin/finance', '/admin/team'];
      if (role === 'staff' && restrictedRoutes.some(r => pathname.startsWith(r))) {
        router.push('/admin'); // Redirect staff back to dashboard if they try to access sensitive areas
        return;
      }

      setAuthorized(true);
    }
  }, [user, isAdmin, role, isLoading, router, pathname]);

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
          <div className="text-brand-gold text-sm">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - could be a separate component */}
      <aside className="w-64 bg-brand-navy border-r border-brand-gold/10 fixed inset-y-0 left-0 z-50 flex flex-col">
        <div className="p-6 border-b border-brand-gold/10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-white font-bold text-xl hover:text-brand-gold transition-colors block">
                Bold <span className="text-brand-gold">Ideas</span>
              </Link>
              <div className="text-xs text-slate-400 mt-1">
                {role === 'admin' ? 'Administrator' : 'Team Member'}
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Main Links */}
          <Link 
            href="/admin" 
            className={`block px-4 py-3 rounded text-sm transition-all ${
              pathname === '/admin' 
                ? 'bg-brand-gold text-brand-navy font-semibold' 
                : 'bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-brand-gold/50'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/messages" 
            className={`block px-4 py-3 rounded text-sm transition-all ${
              pathname === '/admin/messages' 
                ? 'bg-brand-gold text-brand-navy font-semibold' 
                : 'bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-brand-gold/50'
            }`}
          >
            Messages
          </Link>
          {/* <Link 
            href="/admin/inbox" 
            className={`block px-4 py-3 rounded text-sm transition-all ${
              pathname === '/admin/inbox' 
                ? 'bg-brand-gold text-brand-navy font-semibold' 
                : 'bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-brand-gold/50'
            }`}
          >
            Contact Inbox
          </Link> */}
          <Link 
            href="/admin/blog" 
            className={`block px-4 py-3 rounded text-sm transition-all ${
              pathname?.startsWith('/admin/blog') 
                ? 'bg-brand-gold text-brand-navy font-semibold' 
                : 'bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-brand-gold/50'
            }`}
          >
            Blog
          </Link>

          {/* Agency OS Modules */}
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs text-slate-500 uppercase tracking-wide mb-2">Modules</p>
            <Link 
              href="/admin/crm" 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname?.startsWith('/admin/crm') 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              CRM / Leads
            </Link>
            <Link 
              href="/admin/projects" 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname?.startsWith('/admin/projects') 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              Projects
            </Link>
            <Link 
              href="/admin/tasks" 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname === '/admin/tasks' 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              Tasks
            </Link>
            <Link 
              href="/admin/tickets" 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname?.startsWith('/admin/tickets') 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              Tickets
            </Link>
            <Link 
              href="/admin/marketing" 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname?.startsWith('/admin/marketing') 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              Email Marketing
            </Link>
            <Link 
              href="/admin/calendar" 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname === '/admin/calendar' 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              Calendar
            </Link>

            {/* Restricted Modules - Admin Only */}
            {role === 'admin' && (
              <>
                <Link 
                  href="/admin/finance" 
                  className={`block px-4 py-2 rounded text-sm transition-colors ${
                    pathname?.startsWith('/admin/finance') 
                      ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                      : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
                  }`}
                >
                  Finance
                </Link>
                <Link 
                  href="/admin/team" 
                  className={`block px-4 py-2 rounded text-sm transition-colors ${
                    pathname?.startsWith('/admin/team') 
                      ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                      : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
                  }`}
                >
                  Team
                </Link>
              </>
            )}

            <Link 
              href={role === 'admin' ? "/admin/settings" : "/staff/settings"} 
              className={`block px-4 py-2 rounded text-sm transition-colors ${
                pathname?.includes('/settings') 
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold' 
                  : 'text-slate-300 hover:text-brand-gold hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-brand-gold/10">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold overflow-hidden border border-brand-gold/30">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.email?.[0].toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{user?.email}</p>
              <p className="text-brand-gold text-xs">{role === 'admin' ? 'Admin' : 'Team'}</p>
            </div>
          </div>
          <button
            onClick={() => signOut().then(() => router.push('/signin'))}
            className="w-full text-left px-4 py-2 text-slate-400 hover:text-red-400 text-sm transition-colors flex items-center space-x-2"
          >
            <span>Sign Out</span>
            <span>&gt;</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
