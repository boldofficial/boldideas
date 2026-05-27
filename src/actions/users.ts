'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { savePublicUpload } from '@/lib/uploads';

export async function updateUserProfile(userId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const address = formData.get('address') as string;
    const avatarUrl = formData.get('avatarUrl') as string;

    console.log("Updating profile for:", userId, { name, bio, address, avatarUrl });

    try {
        await db.update(users)
            .set({
                name,
                bio,
                address,
                avatarUrl: avatarUrl || null
            })
            .where(eq(users.id, userId));

        revalidatePath('/staff');
        revalidatePath('/admin');
        revalidatePath('/client');
        return { success: true };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { success: false, error: 'Failed to update user profile' };
    }
}

export async function uploadAvatar(formData: FormData) {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) return { success: false, error: "Missing file or user ID" };

    try {
        const url = await savePublicUpload(file, 'avatars', userId);
        return { success: true, url };
    } catch (error: unknown) {
        console.error("Upload Error:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: 'Failed to fetch profile' };
    }
}

// Admin only: Get all users
export async function getAllUsers() {
    try {
        const allUsers = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            isActive: users.isActive,
            avatarUrl: users.avatarUrl,
            createdAt: users.createdAt,
        }).from(users).orderBy(users.createdAt);
        return { success: true, data: allUsers };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}

// Admin only: Delete a user account
export async function deleteUser(userId: string, adminId: string) {
    try {
        // Verify admin is making the request
        const [admin] = await db.select({ role: users.role })
            .from(users)
            .where(eq(users.id, adminId));
        
        if (!admin || admin.role !== 'admin') {
            return { success: false, error: 'Unauthorized: Admin access required' };
        }

        // Don't allow deleting yourself
        if (userId === adminId) {
            return { success: false, error: 'Cannot delete your own account' };
        }

        // Delete from database
        await db.delete(users).where(eq(users.id, userId));

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, newRole: string, adminId: string) {
    try {
        // Verify admin
        const [admin] = await db.select({ role: users.role })
            .from(users)
            .where(eq(users.id, adminId));
        
        if (!admin || admin.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        await db.update(users)
            .set({ role: newRole })
            .where(eq(users.id, userId));

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update role' };
    }
}

