'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getAllUsers() {
    try {
        const data = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
            role: users.role
        }).from(users).orderBy(desc(users.name));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}
