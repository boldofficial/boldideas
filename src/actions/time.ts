'use server'

import { db } from '@/lib/db';
import { timeLogs, tasks } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { recordActivity } from './activity';

export async function logTime({
    taskId,
    userId,
    startTime,
    endTime,
    duration,
    description
}: {
    taskId: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    duration?: string;
    description?: string;
}) {
    try {
        await db.insert(timeLogs).values({
            taskId,
            userId,
            startTime,
            endTime: endTime || null,
            duration: duration || null,
            description: description || null
        });

        // Get task info for activity log
        const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));

        // Log Activity
        await recordActivity({
            userId,
            projectId: task?.projectId || undefined,
            taskId,
            action: 'time_logged',
            details: { duration: duration || 'Session recorded' }
        });

        revalidatePath('/staff');
        if (task?.projectId) revalidatePath(`/admin/projects/${task.projectId}`);

        return { success: true };
    } catch (error) {
        console.error('logTime error:', error);
        return { success: false, error: 'Failed to log time' };
    }
}

export async function getTaskTimeLogs(taskId: string) {
    try {
        const data = await db.select()
            .from(timeLogs)
            .where(eq(timeLogs.taskId, taskId))
            .orderBy(desc(timeLogs.createdAt));

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch time logs' };
    }
}

export async function getTotalTaskTime(taskId: string) {
    try {
        const logs = await db.select({
            duration: timeLogs.duration
        })
            .from(timeLogs)
            .where(eq(timeLogs.taskId, taskId));

        const totalSeconds = logs.reduce((acc, log) => {
            return acc + (log.duration ? parseInt(log.duration) : 0);
        }, 0);

        return { success: true, totalSeconds };
    } catch (error) {
        return { success: false, totalSeconds: 0 };
    }
}
