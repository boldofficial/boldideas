'use server'

import { db } from '@/lib/db';
import { tasks, milestones, internalProjects } from '@/lib/db/schema';
import { eq, and, gte, lte, or } from 'drizzle-orm';

export async function getCalendarData(month: number, year: number) {
    try {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        // Fetch tasks with due dates in this range
        const calendarTasks = await db.select({
            id: tasks.id,
            title: tasks.title,
            dueDate: tasks.dueDate,
            status: tasks.status,
            projectId: tasks.projectId,
            type: gte(tasks.id, tasks.id) // Dummy field to identify as task
        })
            .from(tasks)
            .where(
                and(
                    gte(tasks.dueDate, startDate),
                    lte(tasks.dueDate, endDate)
                )
            );

        // Fetch milestones in this range
        const calendarMilestones = await db.select({
            id: milestones.id,
            title: milestones.title,
            dueDate: milestones.dueDate,
            status: milestones.status,
            projectId: milestones.projectId,
        })
            .from(milestones)
            .where(
                and(
                    gte(milestones.dueDate, startDate),
                    lte(milestones.dueDate, endDate)
                )
            );

        // Map to a unified format
        const items = [
            ...calendarTasks.map(t => ({ ...t, itemType: 'task' })),
            ...calendarMilestones.map(m => ({ ...m, itemType: 'milestone' }))
        ];

        return { success: true, data: items };
    } catch (error) {
        console.error('getCalendarData error:', error);
        return { success: false, error: 'Failed to fetch calendar data' };
    }
}
