'use server'

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { accounts, users } from '@/lib/db/schema';
import { and, eq, count, sql } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';

function getErrorMessage(error: unknown, fallback: string) {
    if (!(error instanceof Error)) return fallback;

    const cause = error.cause;
    if (cause instanceof Error && cause.message) {
        return `${error.message} Cause: ${cause.message}`;
    }

    return error.message;
}

async function ensureUserAdminColumns() {
    const columnStatements = [
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user'`,
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true`,
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_url" text`,
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text`,
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "address" text`,
    ];

    try {
        for (const statement of columnStatements) {
            await db.execute(statement);
        }
    } catch (error) {
        const message = getErrorMessage(error, 'Unable to repair the users table.');
        throw new Error(
            `The users table is missing admin columns and the app could not add them automatically. Run the latest database migration, then try setup again. ${message}`
        );
    }
}

export async function setupAdminAction(formData: FormData) {
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = formData.get('password') as string;
    const name = String(formData.get('name') || '').trim();

    if (!email || !password || !name) {
        return { success: false, error: "Missing required fields." };
    }

    try {
        await ensureUserAdminColumns();

        const result = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'));
        const adminCount = result[0]?.count || 0;

        if (adminCount > 0) {
            return { error: "System initialized. Redirecting to login...", redirect: '/signin' };
        }

        const existingUser = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, email),
        });

        if (existingUser) {
            const passwordHash = await hashPassword(password);
            const existingCredential = await db.query.accounts.findFirst({
                where: (a, { and, eq }) => and(
                    eq(a.userId, existingUser.id),
                    eq(a.providerId, 'credential')
                ),
            });

            await db.update(users)
                .set({ role: 'admin', name, isActive: true })
                .where(eq(users.id, existingUser.id));

            if (existingCredential) {
                await db.update(accounts)
                    .set({ password: passwordHash, updatedAt: new Date() })
                    .where(and(
                        eq(accounts.userId, existingUser.id),
                        eq(accounts.providerId, 'credential')
                    ));
            } else {
                await db.insert(accounts).values({
                    userId: existingUser.id,
                    providerId: 'credential',
                    accountId: existingUser.id,
                    password: passwordHash,
                });
            }

            return { success: true };
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
