
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    isAdmin: boolean;
    role: string | null;
    isLoading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAdmin: false,
    role: null,
    isLoading: true,

    signIn: async (email: string) => {
        // This is a placeholder as the actual sign-in happens via Supabase Auth UI / magic link / password
        // The store update happens via checkAuth or onAuthStateChange
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAdmin: false, role: null });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Verify role in 'users' table
                const { data: userRecord, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (userRecord?.role === 'admin') {
                    set({ user: session.user, isAdmin: true, role: 'admin', isLoading: false });
                } else {
                    // User is authenticated but not admin
                    set({ user: session.user, isAdmin: false, role: userRecord?.role || 'user', isLoading: false });

                    // SELF-HEALING: If I am logged in but not admin, check if I should be.
                    // This handles the "I downgraded myself but I am the owner" case.
                    const { claimOrphanedAdminRole } = await import('@/actions/auth');
                    const claimResult = await claimOrphanedAdminRole(session.user.id);

                    if (claimResult.success) {
                        // Refresh state immediately if we claimed it
                        set({ isAdmin: true });
                    }
                }
            } else {
                set({ user: null, isAdmin: false, isLoading: false });
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            set({ user: null, isAdmin: false, isLoading: false });
        }
    },

    setUser: (user) => set({ user }),
}));
