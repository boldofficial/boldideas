'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Ensure bucket exists
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        if (!buckets?.find(b => b.name === 'avatars')) {
            await supabaseAdmin.storage.createBucket('avatars', { public: true });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
            .from('avatars')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error("Upload Error:", error);
        return { success: false, error: error.message };
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
