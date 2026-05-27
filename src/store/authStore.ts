
import { create } from 'zustand';
import { authClient } from '@/lib/auth-client';
import { getUserProfile } from '@/actions/users';

export type AppUser = {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
};

interface AuthState {
    user: AppUser | null;
    isAdmin: boolean;
    role: string | null;
    isLoading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: AppUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAdmin: false,
    role: null,
    isLoading: true,

    signIn: async (email: string) => {
        // The sign-in form owns credential submission; this keeps the store API stable.
        // The store update happens via checkAuth or onAuthStateChange
    },

    signOut: async () => {
        await authClient.signOut();
        set({ user: null, isAdmin: false, role: null });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const { data: session } = await authClient.getSession();

            if (session?.user?.id) {
                const profile = await getUserProfile(session.user.id);
                const userRecord = profile.data;
                const role = userRecord?.role || 'user';

                if (role === 'admin') {
                    set({ user: session.user, isAdmin: true, role: 'admin', isLoading: false });
                } else {
                    set({ user: session.user, isAdmin: false, role, isLoading: false });

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
