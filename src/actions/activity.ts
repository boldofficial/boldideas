'use server'

import { db } from '@/lib/db';
import { activityLog, users } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function recordActivity({
    userId,
    action,
    details,
    projectId,
    taskId
}: {
    userId: string | null;
    action: string;
    details?: any;
    projectId?: string;
    taskId?: string;
}) {
    try {
        await db.insert(activityLog).values({
            userId: userId || null, // Allow null for system activities
            action,
            details: details || {},
            projectId: projectId || null,
            taskId: taskId || null
        });

        if (projectId) revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/admin');
        revalidatePath('/staff');

        return { success: true };
    } catch (error) {
        console.error('recordActivity error:', error);
        return { success: false, error: 'Failed to record activity' };
    }
}

export async function getGlobalActivity(limit = 20) {
    try {
        const data = await db.select({
            id: activityLog.id,
            action: activityLog.action,
            details: activityLog.details,
            createdAt: activityLog.createdAt,
            userName: users.name,
            userAvatar: users.avatarUrl
        })
            .from(activityLog)
            .leftJoin(users, eq(activityLog.userId, users.id))
            .orderBy(desc(activityLog.createdAt))
            .limit(limit);

        return { success: true, data };
    } catch (error) {
        console.error('getGlobalActivity error:', error);
        return { success: false, error: 'Failed to fetch global activity' };
    }
}

export async function getProjectActivity(projectId: string) {
    try {
        const data = await db.select({
            id: activityLog.id,
            action: activityLog.action,
            details: activityLog.details,
            createdAt: activityLog.createdAt,
            userName: users.name,
            userAvatar: users.avatarUrl
        })
            .from(activityLog)
            .leftJoin(users, eq(activityLog.userId, users.id))
            .where(eq(activityLog.projectId, projectId))
            .orderBy(desc(activityLog.createdAt));

        return { success: true, data };
    } catch (error) {
        console.error('getProjectActivity error:', error);
        return { success: false, error: 'Failed to fetch project activity' };
    }
}
