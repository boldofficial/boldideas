'use server'

import { db } from '@/lib/db';
import { internalProjects, tasks, campaigns, projectMembers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

// --- Projects ---
export async function getInternalProjects(clientId?: string) {
    try {
        let query = db.select().from(internalProjects);
        if (clientId) {
            // @ts-ignore - drizzle type inference sometimes complex with dynamic queries
            query = query.where(eq(internalProjects.clientId, clientId));
        }
        const projData = await query.orderBy(desc(internalProjects.createdAt));

        // Augment with task counts for progress calculation
        const data = await Promise.all(projData.map(async (project) => {
            const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, project.id));
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter(t => t.status === 'done').length;
            return {
                ...project,
                totalTasks,
                completedTasks,
                progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
            };
        }));

        return { success: true, data };
    } catch (error) {
        console.error('getInternalProjects error:', error);
        return { success: false, error: 'Failed to fetch projects' };
    }
}

export async function createInternalProject(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string || 'active';
    const type = formData.get('type') as string || 'internal';
    const budget = formData.get('budget') as string;
    const managerId = formData.get('managerId') as string;
    const clientId = formData.get('clientId') as string;
    const startDate = formData.get('startDate') as string;
    const dueDate = formData.get('dueDate') as string;
    const memberIds = formData.get('memberIds') as string; // Expecting JSON array or comma-separated

    try {
        const [project] = await db.insert(internalProjects).values({
            title,
            description,
            status,
            type,
            budget,
            managerId: managerId === 'unassigned' ? null : managerId,
            clientId: (clientId && clientId !== 'none' && clientId !== 'unassigned') ? clientId : null,
            startDate: startDate ? new Date(startDate) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
        }).returning({ id: internalProjects.id });

        if (project && memberIds) {
            const members = JSON.parse(memberIds);
            if (Array.isArray(members) && members.length > 0) {
                await db.insert(projectMembers).values(
                    members.map((userId: string) => ({
                        projectId: project.id,
                        userId,
                        role: 'member'
                    }))
                );
            }
        }

        // Notify client if project is assigned to them
        const finalClientId = (clientId && clientId !== 'none' && clientId !== 'unassigned') ? clientId : null;
        if (finalClientId && project) {
            await createNotification(
                finalClientId,
                'project_assigned',
                'New Project Assigned',
                `You have been assigned to project "${title}"`,
                `/client/projects/${project.id}`
            );
        }

        revalidatePath('/admin/projects');
        revalidatePath('/client');
        return { success: true };
    } catch (error) {
        console.error("Create Project Error:", error);
        return { success: false, error: 'Failed to create project' };
    }
}

// --- Tasks ---
export async function getTasks(assigneeId?: string) {
    try {
        let query = db.select().from(tasks);
        if (assigneeId) {
            // @ts-ignore
            query = query.where(eq(tasks.assigneeId, assigneeId));
        }
        const data = await query.orderBy(desc(tasks.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch tasks' };
    }
}

export async function createTask(formData: FormData) {
    const title = formData.get('title') as string;
    const status = formData.get('status') as string || 'todo';
    const priority = formData.get('priority') as string || 'medium';

    try {
        await db.insert(tasks).values({
            title,
            status,
            priority
        });
        revalidatePath('/admin/tasks');
        revalidatePath('/staff'); // Also update staff dashboard
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create task' };
    }
}

// --- Marketing ---
export async function getCampaigns() {
    try {
        const data = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch campaigns' };
    }
}

export async function createCampaign(formData: FormData) {
    const subject = formData.get('subject') as string;
    const content = formData.get('content') as string;

    try {
        await db.insert(campaigns).values({
            subject,
            content,
            status: 'draft'
        });
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create campaign' };
    }
}
