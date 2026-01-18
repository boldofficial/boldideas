'use server'

import { db } from '@/lib/db';
import { projectMembers, internalProjects, tasks, users } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

// Get all projects a staff member is assigned to
export async function getStaffProjects(userId: string) {
    try {
        // Get project IDs where user is a member
        const memberProjects = await db.select({
            projectId: projectMembers.projectId
        })
            .from(projectMembers)
            .where(eq(projectMembers.userId, userId));

        const projectIds = memberProjects.map(m => m.projectId);

        if (projectIds.length === 0) {
            return { success: true, data: [] };
        }

        // Get project details with task count
        const projectsWithDetails = await Promise.all(
            projectIds.map(async (projectId) => {
                const [project] = await db.select({
                    id: internalProjects.id,
                    title: internalProjects.title,
                    status: internalProjects.status,
                    type: internalProjects.type,
                    dueDate: internalProjects.dueDate,
                    description: internalProjects.description,
                    managerId: internalProjects.managerId,
                })
                    .from(internalProjects)
                    .where(eq(internalProjects.id, projectId));

                if (!project) return null;

                // Get task count
                const taskResult = await db.select()
                    .from(tasks)
                    .where(eq(tasks.projectId, projectId));
                const taskCount = taskResult.length;

                // Get manager name
                let managerName = null;
                if (project.managerId) {
                    const [manager] = await db.select({ name: users.name })
                        .from(users)
                        .where(eq(users.id, project.managerId));
                    managerName = manager?.name || null;
                }

                return {
                    ...project,
                    taskCount,
                    managerName,
                };
            })
        );

        const validProjects = projectsWithDetails.filter(p => p !== null);

        return { success: true, data: validProjects };
    } catch (error) {
        console.error('getStaffProjects error:', error);
        return { success: false, error: 'Failed to fetch projects' };
    }
}

// Get tasks assigned to a staff member
export async function getStaffTasks(userId: string) {
    try {
        const data = await db.select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            attachmentUrl: tasks.attachmentUrl,
            estimatedMinutes: tasks.estimatedMinutes,
            subtasks: tasks.subtasks,
            projectId: tasks.projectId,
            projectTitle: internalProjects.title,
        })
            .from(tasks)
            .leftJoin(internalProjects, eq(tasks.projectId, internalProjects.id))
            .where(eq(tasks.assigneeId, userId))
            .orderBy(desc(tasks.createdAt));

        return { success: true, data };
    } catch (error) {
        console.error('getStaffTasks error:', error);
        return { success: false, error: 'Failed to fetch tasks' };
    }
}

// Get staff dashboard stats
export async function getStaffStats(userId: string) {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Tasks due today
        const tasksDueToday = await db.select()
            .from(tasks)
            .where(sql`${tasks.assigneeId} = ${userId} AND ${tasks.status} != 'done' AND ${tasks.dueDate} >= ${today} AND ${tasks.dueDate} < ${tomorrow}`);

        // Tasks completed this week
        const completedThisWeek = await db.select()
            .from(tasks)
            .where(sql`${tasks.assigneeId} = ${userId} AND ${tasks.status} = 'done' AND ${tasks.updatedAt} >= ${startOfWeek}`);

        // Active projects count
        const memberProjects = await db.select({ projectId: projectMembers.projectId })
            .from(projectMembers)
            .where(eq(projectMembers.userId, userId));

        // Total assigned tasks (pending)
        const pendingTasks = await db.select()
            .from(tasks)
            .where(sql`${tasks.assigneeId} = ${userId} AND ${tasks.status} != 'done'`);

        // Overdue tasks
        const overdueTasks = await db.select()
            .from(tasks)
            .where(sql`${tasks.assigneeId} = ${userId} AND ${tasks.status} != 'done' AND ${tasks.dueDate} < ${now}`);

        return {
            success: true,
            data: {
                tasksDueToday: tasksDueToday.length,
                completedThisWeek: completedThisWeek.length,
                activeProjects: memberProjects.length,
                pendingTasks: pendingTasks.length,
                overdueTasks: overdueTasks.length,
            }
        };
    } catch (error) {
        console.error('getStaffStats error:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}
