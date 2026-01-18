'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    try {
        const data = await db.select().from(users).orderBy(desc(users.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}

export async function updateUserRole(userId: string, role: string) {
    // Validate role
    const validRoles = ['admin', 'staff', 'user'];
    if (!validRoles.includes(role)) {
        return { success: false, error: 'Invalid role' };
    }

    try {
        await db.update(users).set({ role }).where(eq(users.id, userId));
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update user role' };
    }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
    try {
        await db.update(users).set({ isActive }).where(eq(users.id, userId));
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update user status' };
    }
}
