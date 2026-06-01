import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export type AppRole = 'admin' | 'staff' | 'client' | 'user';

export class AuthzError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'AuthzError';
    }
}

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return null;
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user?.isActive) {
        return null;
    }

    return user;
}

export async function requireCurrentUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new AuthzError('Authentication required');
    }
    return user;
}

export async function requireRole(roles: AppRole[]) {
    const user = await requireCurrentUser();
    if (!roles.includes((user.role || 'user') as AppRole)) {
        throw new AuthzError('Insufficient permissions');
    }
    return user;
}

export async function requireAdmin() {
    return requireRole(['admin']);
}

export async function requireStaffOrAdmin() {
    return requireRole(['admin', 'staff']);
}

export function authzError(message = 'Unauthorized') {
    return { success: false, error: message };
}
