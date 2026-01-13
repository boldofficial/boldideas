
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAdmin, isLoading, checkAuth, signOut } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const init = async () => {
       await checkAuth();
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
       if (!user) {
         router.push('/auth/signin');
       } else if (!isAdmin) {
         router.push('/'); // Redirect non-admins to home
       } else {
         setAuthorized(true);
       }
    }
  }, [user, isAdmin, isLoading, router]);


  if (isLoading || !authorized) {
    return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                <div className="text-brand-gold font-mono text-xs uppercase tracking-widest animate-pulse">
                    Verifying_Clearance...
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
              <Link href="/" className="text-white font-black uppercase tracking-tighter text-xl hover:text-brand-gold transition-colors block">
                  Admin <span className="text-brand-gold">Panel</span>
              </Link>
              <div className="text-[9px] font-mono text-slate-400 mt-1">
                  V 2.0.1 | LEVEL 5 ACCESS
              </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
               <Link href="/admin" className="block px-4 py-3 bg-white/5 border border-white/5 rounded-sm text-xs font-mono text-white hover:bg-white/10 hover:border-brand-gold/50 transition-all uppercase tracking-widest">
                  Dashboard
               </Link>
               <Link href="/admin/inbox" className="block px-4 py-3 bg-white/5 border border-white/5 rounded-sm text-xs font-mono text-white hover:bg-white/10 hover:border-brand-gold/50 transition-all uppercase tracking-widest">
                  Inbox (Messages)
               </Link>
          </nav>

          <div className="p-4 border-t border-brand-gold/10">
              <div className="flex items-center space-x-3 mb-4 px-2">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                      {user?.email?.[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                      <p className="text-white text-xs font-bold truncate">{user?.email}</p>
                      <p className="text-brand-gold text-[9px] uppercase">Administrator</p>
                  </div>
              </div>
              <button 
                onClick={() => signOut().then(() => router.push('/auth/signin'))}
                className="w-full text-left px-4 py-2 text-slate-400 hover:text-red-400 text-xs font-mono uppercase tracking-widest transition-colors flex items-center space-x-2"
              >
                  <span>Logout</span>
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
