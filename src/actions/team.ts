'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

const ITEMS_PER_PAGE = 20;

export async function getUsers(page: number = 1) {
    try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const data = await db.select().from(users)
            .orderBy(desc(users.createdAt))
            .limit(ITEMS_PER_PAGE)
            .offset(offset);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}

export async function getClientUsers() {
    try {
        const data = await db.select().from(users)
            .where(eq(users.role, 'client'))
            .orderBy(desc(users.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch clients' };
    }
}

export async function getUsersCount() {
    try {
        const [result] = await db.select({ count: count() }).from(users);
        return { success: true, count: result.count };
    } catch (error) {
        return { success: false, count: 0 };
    }
}

export async function updateUserRole(userId: string, role: string) {
    // Validate role
    const validRoles = ['admin', 'staff', 'client', 'user'];
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

export async function getUserById(userId: string) {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: 'Failed to fetch user' };
    }
}

export type UserUpdateData = {
    name?: string;
    bio?: string;
    address?: string;
    avatarUrl?: string;
};

export async function updateUser(userId: string, data: UserUpdateData) {
    try {
        await db.update(users).set(data).where(eq(users.id, userId));
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update user' };
    }
}

export async function deleteUser(userId: string) {
    try {
        // Soft delete by setting isActive to false
        await db.update(users).set({ isActive: false }).where(eq(users.id, userId));
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete user' };
    }
}

export async function hardDeleteUser(userId: string) {
    try {
        // Delete from Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (authError) {
            console.error('Auth delete error:', authError);
            // We continue even if auth delete fails, as they might not exist in Auth but exist in DB
        }

        // Permanently delete user from database
        await db.delete(users).where(eq(users.id, userId));
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        // May fail due to foreign key constraints
        console.error('Hard delete error:', error);
        return { success: false, error: 'Failed to permanently delete user. They may have related records.' };
    }
}
