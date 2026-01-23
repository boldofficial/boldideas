
'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';
import { resend } from '@/lib/resend';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

/**
 * Server Action to setup the initial Admin account.
 */
export async function setupAdminAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { success: false, error: "Missing required fields." };
    }

    try {
        // 1. Check existing admin (Drizzle)
        const result = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'));
        const adminCount = result[0]?.count || 0;

        if (adminCount > 0) {
            return { error: "System initialized. Redirecting to login...", redirect: '/signin' };
        }

        // 2. Create Auth User (Supabase Admin SDK)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name }
        });

        if (authError) {
            // Handle "User already exists" safely
            if (authError.message.includes("already registered") || authError.status === 400) {
                return { error: "User exists. Redirecting to login...", redirect: '/signin' };
            }
            throw authError;
        }

        if (!authData.user) throw new Error("Failed to create user in Auth system.");

        // 3. Insert Public User (Drizzle) - Normal Flow
        // Check if trigger handled it
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, authData.user.id)
        });

        if (existingUser) {
            await db.update(users)
                .set({ role: 'admin', name })
                .where(eq(users.id, authData.user.id));
        } else {
            await db.insert(users).values({
                id: authData.user.id,
                email,
                role: 'admin',
                name,
                isActive: true
            });
        }

        return { success: true };

    } catch (error: any) {
        console.error("Setup Admin Action Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Server Action to send Password Reset Email via Resend.
 */
export async function sendPasswordResetAction(email: string) {
    if (!email) return { success: false, error: "Email is required." };

    try {
        // 1. Check existence/role using Drizzle
        const user = await db.query.users.findFirst({
            where: (u, { eq, and }) => and(eq(u.email, email), eq(u.role, 'admin'))
        });

        if (!user) {
            // Security: Fake success
            return { success: true };
        }

        // 2. Generate Link
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
            }
        });

        if (error || !data.properties?.action_link) throw new Error("Failed to generate link");

        // 3. Send Email via Resend
        await resend.emails.send({
            from: process.env.FROM_EMAIL!,
            to: email,
            subject: 'ACTION REQUIRED: Admin Access Recovery',
            html: `
                <div style="font-family: monospace; background-color: #0A1128; color: #ffffff; padding: 40px;">
                    <h1 style="color: #D4AF37; margin-bottom: 20px;">RECOVERY_PROTOCOL_INITIATED</h1>
                    <p>An access recovery request was received for the Admin Terminal.</p>
                    <p>Identity: <strong>${email}</strong></p>
                    <br/>
                    <a href="${data.properties.action_link}" style="background-color: #D4AF37; color: #0A1128; padding: 15px 30px; text-decoration: none; font-weight: bold; display: inline-block;">
                        ESTABLISH_RECOVERY_UPLINK
                    </a>
                    <br/><br/>
                    <p style="color: #64748b; font-size: 10px;">
                        SECURE RECOVERY EMAIL // IF THIS WAS NOT YOU, TERMINATE IMMEDIATELY.
                    </p>
                </div>
            `
        });

        return { success: true };

    } catch (error: any) {
        console.error("Reset Action Error:", error);
        return { success: false, error: "System failure." };
    }
}

/**
 * Server Action to check if an admin exists.
 */
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

/**
 * Server Action to securely claim Admin role if the system is headless (0 admins).
 * This acts as the "Self-Healing" mechanism post-login.
 */
export async function claimOrphanedAdminRole(userId: string) {
    if (!userId) return { success: false };

    try {
        // 1. SECURITY CRITICAL: Ensure NO admins exist.
        const result = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'));
        const adminCount = result[0]?.count || 0;

        if (adminCount > 0) {
            // System is healthy, do not allow arbitrary promotion.
            return { success: false, error: "Admins already exist." };
        }

        // 2. Double check validity of the user in public table
        // We can just try to update. If they don't exist, it does nothing.

        await db.update(users)
            .set({ role: 'admin' })
            .where(eq(users.id, userId));

        return { success: true };
    } catch (error) {
        console.error("Claim Admin Error:", error);
        return { success: false };
    }
}

/**
 * Server Action to Register a new user.
 */
export async function signUpAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { success: false, error: "Missing required fields." };
    }

    try {
        // 1. Create Auth User (Supabase Admin SDK)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name }
        });

        if (authError) {
            if (authError.message.includes("already registered") || authError.status === 400) {
                return { error: "User already exists. Redirecting to login...", redirect: '/auth/signin' };
            }
            throw authError;
        }

        if (!authData.user) throw new Error("Failed to create user in Auth system.");

        // 2. Insert Public User (Drizzle)
        await db.insert(users).values({
            id: authData.user.id,
            email,
            role: 'user', // Default role for manual signups
            name,
            isActive: true
        });

        return { success: true };

    } catch (error: any) {
        console.error("Sign Up Error:", error);
        return { success: false, error: error.message };
    }
}
