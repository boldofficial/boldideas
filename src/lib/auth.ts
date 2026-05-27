import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/lib/db';
import { accounts, sessions, users, verifications } from '@/lib/db/schema';
import { resend } from '@/lib/resend';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const auth = betterAuth({
    baseURL: appUrl,
    trustedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        appUrl,
    ],
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: 'pg',
        camelCase: true,
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
        },
    }),
    user: {
        modelName: 'user',
        fields: {
            image: 'avatarUrl',
        },
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false,
            },
            isActive: {
                type: 'boolean',
                required: false,
                defaultValue: true,
                input: false,
            },
            bio: {
                type: 'string',
                required: false,
                input: false,
            },
            address: {
                type: 'string',
                required: false,
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        revokeSessionsOnPasswordReset: true,
        async sendResetPassword({ user, url }) {
            await resend.emails.send({
                from: process.env.FROM_EMAIL!,
                to: user.email,
                subject: 'ACTION REQUIRED: Admin Access Recovery',
                html: `
                    <div style="font-family: monospace; background-color: #0A1128; color: #ffffff; padding: 40px;">
                        <h1 style="color: #D4AF37; margin-bottom: 20px;">RECOVERY_PROTOCOL_INITIATED</h1>
                        <p>An access recovery request was received for the Admin Terminal.</p>
                        <p>Identity: <strong>${user.email}</strong></p>
                        <br/>
                        <a href="${url}" style="background-color: #D4AF37; color: #0A1128; padding: 15px 30px; text-decoration: none; font-weight: bold; display: inline-block;">
                            ESTABLISH_RECOVERY_UPLINK
                        </a>
                        <br/><br/>
                        <p style="color: #64748b; font-size: 10px;">
                            SECURE RECOVERY EMAIL // IF THIS WAS NOT YOU, TERMINATE IMMEDIATELY.
                        </p>
                    </div>
                `,
            });
        },
    },
    plugins: [nextCookies()],
    advanced: {
        database: {
            generateId: 'uuid',
        },
    },
});

export type AuthSession = typeof auth.$Infer.Session;
