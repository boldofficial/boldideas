'use server';

import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const contentJson = formData.get('content') as string; // JSON string
    const status = formData.get('status') as string; // 'draft' | 'published'

    if (!title || !slug) {
        return { success: false, error: "Title and Slug are required" };
    }

    try {
        await db.insert(posts).values({
            title,
            slug,
            excerpt,
            content: JSON.parse(contentJson),
            status: status || 'draft',
            publishedAt: status === 'published' ? new Date() : null,
        });

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create post:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const contentJson = formData.get('content') as string;
    const status = formData.get('status') as string;

    try {
        await db.update(posts).set({
            title,
            slug,
            excerpt,
            content: JSON.parse(contentJson),
            status,
            publishedAt: status === 'published' ? new Date() : null,
            updatedAt: new Date(),
        }).where(eq(posts.id, id));

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getPosts() {
    try {
        const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
        return { success: true, data: allPosts };
    } catch (error) {
        return { success: false, error: "Failed to fetch posts" };
    }
}

export async function getPost(id: string) {
    try {
        const post = await db.select().from(posts).where(eq(posts.id, id));
        if (post.length === 0) return { success: false, error: "Post not found" };
        return { success: true, data: post[0] };
    } catch (error) {
        return { success: false, error: "Failed to fetch post" };
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const post = await db.select().from(posts).where(eq(posts.slug, slug));
        if (post.length === 0) return { success: false, error: "Post not found" };
        return { success: true, data: post[0] };
    } catch (error) {
        return { success: false, error: "Failed to fetch post" };
    }
}

export async function deletePost(id: string) {
    try {
        await db.delete(posts).where(eq(posts.id, id));
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete post" };
    }
}
