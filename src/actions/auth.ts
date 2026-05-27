'use server'

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export async function setupAdminAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { success: false, error: "Missing required fields." };
    }

    try {
        const result = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'));
        const adminCount = result[0]?.count || 0;

        if (adminCount > 0) {
            return { error: "System initialized. Redirecting to login...", redirect: '/signin' };
        }

        const authData = await auth.api.signUpEmail({
            body: { email, password, name },
        });

        if (!authData.user) throw new Error("Failed to create user in Auth system.");

        await db.update(users)
            .set({ role: 'admin', name, isActive: true })
            .where(eq(users.id, authData.user.id));

        return { success: true };
    } catch (error: unknown) {
        console.error("Setup Admin Action Error:", error);
        const message = getErrorMessage(error, 'Failed to create admin.');

        if (message.toLowerCase().includes('already')) {
            return { error: "User exists. Redirecting to login...", redirect: '/signin' };
        }

        return { success: false, error: message };
    }
}

export async function sendPasswordResetAction(email: string) {
    if (!email) return { success: false, error: "Email is required." };

    try {
        const user = await db.query.users.findFirst({
            where: (u, { eq, and }) => and(eq(u.email, email), eq(u.role, 'admin'))
        });

        if (!user) return { success: true };

        await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Reset Action Error:", error);
        return { success: false, error: "System failure." };
    }
}

export async function checkAdminStatus() {
    try {
        const result = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'));
        const adminCount = result[0]?.count || 0;
        return { adminExists: adminCount > 0 };
    } catch (error) {
        console.error("Check Admin Error:", error);
        return { adminExists: false };
    }
}

export async function claimOrphanedAdminRole(userId: string) {
    if (!userId) return { success: false };

    try {
        const result = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'));
        const adminCount = result[0]?.count || 0;

        if (adminCount > 0) {
            return { success: false, error: "Admins already exist." };
        }

        await db.update(users)
            .set({ role: 'admin' })
            .where(eq(users.id, userId));

        return { success: true };
    } catch (error) {
        console.error("Claim Admin Error:", error);
        return { success: false };
    }
}

export async function signUpAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { success: false, error: "Missing required fields." };
    }

    try {
        const authData = await auth.api.signUpEmail({
            body: { email, password, name },
        });

        if (!authData.user) throw new Error("Failed to create user in Auth system.");

        await db.update(users)
            .set({ role: 'user', name, isActive: true })
            .where(eq(users.id, authData.user.id));

        return { success: true };
    } catch (error: unknown) {
        console.error("Sign Up Error:", error);
        const message = getErrorMessage(error, 'Failed to sign up.');

        if (message.toLowerCase().includes('already')) {
            return { error: "User already exists. Redirecting to login...", redirect: '/signin' };
        }

        return { success: false, error: message };
    }
}
