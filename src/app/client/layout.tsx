'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { getUserProfile } from '@/actions/users';
import NotificationBell from '@/components/NotificationBell';
import SidebarBadgeDropdown from '@/components/admin/SidebarBadgeDropdown';
import { getUnreadMessageCount } from '@/actions/directMessages';
import { getOpenTicketCount } from '@/actions/tickets';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Ticket,
  MessageCircle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  LogOut,
  Plus,
} from 'lucide-react';

const SIDEBAR_STORAGE_KEY = 'client_sidebar_collapsed';

// ─── Navigation data ──────────────────────────────────────

interface ClientNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  fuzzy?: boolean;
  badgeKey?: 'messages' | 'tickets';
}

const navLinks: ClientNavItem[] = [
  { label: 'Dashboard',    href: '/client',               icon: LayoutDashboard },
  { label: 'My Projects',  href: '/client/projects',     icon: FolderKanban,    fuzzy: true },
  { label: 'My Invoices',  href: '/client/invoices',     icon: FileText,        fuzzy: true },
  { label: 'Tickets',      href: '/client/tickets',      icon: Ticket,          fuzzy: true, badgeKey: 'tickets' },
  { label: 'Messages',     href: '/client/messages',     icon: MessageCircle,              badgeKey: 'messages' },
  { label: 'Settings',     href: '/client/settings',     icon: Settings,        fuzzy: true },
];

// ─── Nav link helper ──────────────────────────────────────

function NavLink({
  item,
  collapsed,
  pathname,
  badgeCounts,
  onNavigate,
}: {
  item: ClientNavItem;
  collapsed: boolean;
  pathname: string;
  badgeCounts?: Record<string, number>;
  onNavigate?: () => void;
}) {
  const isActive = item.fuzzy
    ? pathname?.startsWith(item.href)
    : pathname === item.href;

  const badgeKey = item.badgeKey;
  const badgeCount = badgeKey && badgeCounts ? badgeCounts[badgeKey] : 0;
  const hasBadge = badgeKey && badgeCount > 0;

  const linkClasses = `
    flex items-center gap-3 rounded transition-all
    ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-2.5 flex-1 min-w-0'}
    ${isActive
      ? 'bg-brand-gold text-brand-navy font-semibold'
      : collapsed
        ? 'text-slate-400 hover:text-brand-gold hover:bg-white/5'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }
  `;

  if (collapsed) {
    return (
      <div className="relative flex items-center justify-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          title={item.label}
          className={linkClasses}
        >
          <item.icon className="w-5 h-5 shrink-0" />
        </Link>
        {hasBadge && (
          <div className="absolute inset-0 pointer-events-none">
            <SidebarBadgeDropdown
              badgeKey={badgeKey!}
              count={badgeCount}
              collapsed={true}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-3">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={linkClasses}
      >
        <item.icon className="w-4 h-4 shrink-0" />
        <span className="text-sm truncate">{item.label}</span>
      </Link>
      {hasBadge && (
        <SidebarBadgeDropdown
          badgeKey={badgeKey!}
          count={badgeCount}
          collapsed={false}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// ─── Layout component ─────────────────────────────────────

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isLoading, checkAuth, signOut } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);

  // Sidebar state
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  // Badge counts
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({
    messages: 0,
    tickets: 0,
  });

  // ── Auth ──
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
        return;
      }
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

  // ── Fetch badge counts ──
  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const [msgRes, tktRes] = await Promise.all([
        getUnreadMessageCount(user.id),
        getOpenTicketCount(),
      ]);
      setBadgeCounts({
        messages: msgRes.count ?? 0,
        tickets: tktRes.count ?? 0,
      });
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // ── Init collapsed from localStorage + detect mobile ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored !== null) {
        setCollapsed(stored === 'true');
      }
    } catch {
      // localStorage unavailable
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  // Close mobile sidebar & quick-create on navigation
  useEffect(() => {
    setMobileOpen(false);
    setQuickCreateOpen(false);
  }, [pathname]);

  // Close quick-create on Escape key
  useEffect(() => {
    if (!quickCreateOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickCreateOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [quickCreateOpen]);

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

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-brand-navy text-white border-r border-brand-gold/10
          fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300
          ${isMobile
            ? mobileOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full w-64'
            : `${sidebarWidth}`
          }
        `}
      >
        {/* ── Header ── */}
        <div className={`border-b border-brand-gold/10 ${collapsed && !isMobile ? 'p-3' : 'p-6'}`}>
          <div className={`flex items-center ${collapsed && !isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
            {!collapsed || isMobile ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center overflow-hidden shrink-0">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-gold font-bold">{user?.email?.[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm text-white truncate">{profile?.name || 'Client'}</h2>
                  <p className="text-xs text-brand-gold">Client Portal</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-gold font-bold text-sm">{user?.email?.[0].toUpperCase()}</span>
                  )}
                </div>
              </div>
            )}

            {/* Toggle buttons */}
            {!isMobile && (
              <button
                onClick={toggleCollapsed}
                className="text-slate-400 hover:text-brand-gold transition-colors p-1 rounded hover:bg-white/5"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            )}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {!isMobile && !collapsed && <NotificationBell />}
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className={`flex-1 overflow-y-auto ${collapsed && !isMobile ? 'p-2 space-y-1' : 'p-4 space-y-1'}`}>
          {navLinks.map(item => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed && !isMobile}
              pathname={pathname}
              badgeCounts={badgeCounts}
              onNavigate={() => isMobile && setMobileOpen(false)}
            />
          ))}

          {/* ── Quick Create ── */}
          <div className={`border-t border-brand-gold/10 pt-3 mt-3 ${collapsed && !isMobile ? 'px-0' : ''}`}>
            <div className="relative">
              <button
                onClick={() => setQuickCreateOpen(prev => !prev)}
                className={`
                  w-full flex items-center gap-2 rounded-md text-sm font-medium transition-all
                  ${collapsed && !isMobile
                    ? 'justify-center px-0 py-2 text-slate-400 hover:text-brand-gold hover:bg-white/5'
                    : 'px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 border border-dashed border-brand-gold/20 hover:border-brand-gold/40'
                  }
                `}
                title={collapsed && !isMobile ? 'Quick Create' : undefined}
              >
                <Plus className="w-4 h-4 shrink-0" />
                {(!collapsed || isMobile) && <span>Quick Create</span>}
              </button>

              {/* Dropdown */}
              {quickCreateOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-[60]" onClick={() => setQuickCreateOpen(false)} />

                  {/* Panel */}
                  <div
                    className={`
                      absolute z-[70] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]
                      border border-slate-200 overflow-hidden min-w-[220px]
                      animate-in fade-in zoom-in-95 duration-200
                      ${collapsed && !isMobile
                        ? 'left-full ml-3 bottom-0'
                        : 'left-0 bottom-full mb-2'
                      }
                    `}
                  >
                    <Link
                      href="/client/tickets/new"
                      onClick={() => setQuickCreateOpen(false)}
                      className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center transition-transform group-hover:scale-110">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-brand-navy">New Ticket</p>
                        <p className="text-[10px] text-slate-400">Submit a support request</p>
                      </div>
                    </Link>
                    <div className="border-t border-slate-100" />
                    <Link
                      href="/client/projects"
                      onClick={() => setQuickCreateOpen(false)}
                      className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center transition-transform group-hover:scale-110">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-brand-navy">View Projects</p>
                        <p className="text-[10px] text-slate-400">Browse your active projects</p>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ── User section ── */}
        <div className={`border-t border-brand-gold/10 ${collapsed && !isMobile ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'space-x-3'} mb-3 px-2`}>
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold overflow-hidden border border-brand-gold/30 shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.email?.[0].toUpperCase()
              )}
            </div>
            {(!collapsed || isMobile) && (
              <div className="overflow-hidden min-w-0">
                <p className="text-white text-sm truncate">{user?.email}</p>
                <p className="text-brand-gold text-xs">Client Portal</p>
              </div>
            )}
          </div>
          <Link
            href="/"
            className={`block text-center text-xs text-slate-500 hover:text-brand-gold mb-3 transition-colors ${collapsed && !isMobile ? 'hidden' : ''}`}
          >
            Bold <span className="text-brand-gold">Ideas</span>
          </Link>
          <button
            onClick={() => signOut().then(() => router.push('/signin'))}
            className={`
              w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md text-sm font-medium transition-all
              flex items-center gap-2
              ${collapsed && !isMobile ? 'justify-center px-0 py-2' : 'px-4 py-2'}
            `}
            title={collapsed && !isMobile ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        className={`
          flex-1 min-w-0 p-8 relative transition-all duration-300
          ${isMobile ? 'ml-0' : collapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {/* Mobile top bar with hamburger */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:text-brand-navy transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </div>
        )}

        {/* Desktop top bar when sidebar is collapsed */}
        {!isMobile && collapsed && (
          <div className="flex items-center justify-end mb-4">
            <NotificationBell />
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
