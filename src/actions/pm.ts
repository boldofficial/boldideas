'use server'

import { db } from '@/lib/db';
import { milestones, internalProjects, tasks, documents, comments, users, projectMembers } from '@/lib/db/schema';
import { eq, desc, asc, and, sql, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createNotification } from './notifications';
import { recordActivity } from './activity';
import { resend } from '@/lib/resend';

export async function deleteProject(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    try {
        await db.delete(internalProjects).where(eq(internalProjects.id, projectId));
    } catch (error) {
        return { success: false, error: 'Failed to delete project' };
    }
    redirect('/admin/projects');
}

export async function updateProject(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const status = formData.get('status') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const budget = formData.get('budget') as string;
    const startDate = formData.get('startDate') as string;
    const dueDate = formData.get('dueDate') as string;
    const managerId = formData.get('managerId') as string;
    const clientId = formData.get('clientId') as string;

    try {
        // Get old clientId before updating
        const [oldProject] = await db.select({ clientId: internalProjects.clientId })
            .from(internalProjects)
            .where(eq(internalProjects.id, projectId))
            .limit(1);

        await db.update(internalProjects).set({
            title,
            status,
            type,
            description,
            budget,
            managerId: managerId === 'unassigned' ? null : managerId,
            clientId: (clientId && clientId !== 'none' && clientId !== 'unassigned') ? clientId : null,
            startDate: startDate ? new Date(startDate) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            updatedAt: new Date(),
        }).where(eq(internalProjects.id, projectId));
        revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/client');

        // Log Activity
        const managerIdVal = managerId === 'unassigned' ? null : managerId;
        await recordActivity({
            userId: managerIdVal || 'system',
            action: 'project_updated',
            projectId,
            details: { title, status }
        });

        // Notify manager of project update
        if (managerIdVal) {
            await createNotification(
                managerIdVal,
                'project_updated',
                'Project Updated',
                `Project "${title}" has been updated`,
                `/admin/projects/${projectId}`
            );
        }

        // Notify client if project is assigned or reassigned
        const newClientId = (clientId && clientId !== 'none' && clientId !== 'unassigned') ? clientId : null;
        const oldClientId = oldProject?.clientId;

        // If client changed from one to another or from null to a client
        if (newClientId && newClientId !== oldClientId) {
            await createNotification(
                newClientId,
                'project_assigned',
                'Project Assigned to You',
                `You have been assigned to project "${title}"`,
                `/client/projects/${projectId}`
            );
        }

        // If client was removed (old client exists but new is null)
        if (oldClientId && !newClientId) {
            await createNotification(
                oldClientId,
                'project_updated',
                'Project Unassigned',
                `You have been removed from project "${title}"`,
                `/client`
            );
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update project' };
    }
}


export async function addProjectFile(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;

    try {
        await db.insert(documents).values({ projectId, name, url, type: 'link' }); // Treat as link for now
        revalidatePath(`/admin/projects/${projectId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to add file' };
    }
}

export async function getProjectFiles(projectId: string) {
    try {
        const data = await db.select().from(documents).where(eq(documents.projectId, projectId)).orderBy(desc(documents.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch files' };
    }
}

export async function postProjectComment(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;
    const attachmentUrlManual = formData.get('attachmentUrl') as string;
    const taskId = formData.get('taskId') as string || null;
    const userId = formData.get('userId') as string;

    let attachmentUrl = attachmentUrlManual || null;

    if (file && file.size > 0 && file.name !== 'undefined') {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `comment-${Date.now()}.${fileExt}`;
            const filePath = `comments/${taskId || 'general'}/${fileName}`;

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error: uploadError } = await supabaseAdmin.storage
                .from('project-files')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    upsert: true
                });

            if (!uploadError) {
                const { data: { publicUrl } } = supabaseAdmin.storage
                    .from('project-files')
                    .getPublicUrl(filePath);
                attachmentUrl = publicUrl;
            }
        } catch (err) {
            console.error("Comment File upload error:", err);
        }
    }

    if (!content && !attachmentUrl) return { success: false };

    try {
        await db.insert(comments).values({
            projectId: (projectId && projectId !== 'null') ? projectId : null,
            content: content || 'Sent an attachment',
            userId: userId || null,
            taskId: taskId || null,
            attachmentUrl: attachmentUrl
        });
        if (projectId) revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/admin/tasks');
        revalidatePath('/staff');

        // Log Activity
        await recordActivity({
            userId: userId || 'system',
            projectId: projectId || undefined,
            taskId: taskId || undefined,
            action: taskId ? 'task_comment_posted' : 'project_comment_posted',
            details: { preview: content?.substring(0, 50) }
        });

        // Notify relevant users of comment
        if (projectId && projectId !== 'null') {
            // Get project manager
            const [project] = await db.select({ managerId: internalProjects.managerId })
                .from(internalProjects)
                .where(eq(internalProjects.id, projectId))
                .limit(1);
            
            if (project?.managerId && project.managerId !== userId) {
                await createNotification(
                    project.managerId,
                    'comment_posted',
                    'New Comment on Project',
                    content?.substring(0, 100) || 'New comment posted',
                    `/admin/projects/${projectId}`
                );
            }
        }

        // If task comment, notify assignee
        if (taskId && taskId !== 'null') {
            const [task] = await db.select({ assigneeId: tasks.assigneeId })
                .from(tasks)
                .where(eq(tasks.id, taskId))
                .limit(1);
            
            if (task?.assigneeId && task.assigneeId !== userId) {
                await createNotification(
                    task.assigneeId,
                    'task_comment_posted',
                    'New Comment on Your Task',
                    content?.substring(0, 100) || 'New comment posted',
                    `/admin/tasks`
                );
            }
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to post comment' };
    }
}

export async function getTaskComments(taskId: string) {
    try {
        const data = await db.select({
            id: comments.id,
            content: comments.content,
            attachmentUrl: comments.attachmentUrl,
            taskId: comments.taskId,
            createdAt: comments.createdAt,
            userName: users.name,
            userAvatar: users.avatarUrl
        })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(eq(comments.taskId, taskId))
            .orderBy(desc(comments.createdAt));

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch task comments' };
    }
}

export async function getProjectComments(projectId: string) {
    try {
        const data = await db.select({
            id: comments.id,
            content: comments.content,
            attachmentUrl: comments.attachmentUrl,
            taskId: comments.taskId,
            createdAt: comments.createdAt,
            userName: users.name,
            userAvatar: users.avatarUrl
        })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(
                projectId === 'null'
                    ? sql`${comments.projectId} IS NULL`
                    : eq(comments.projectId, projectId)
            )
            .orderBy(desc(comments.createdAt));

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch comments' };
    }
}

export async function getProjectMilestones(projectId: string) {
    try {
        const data = await db.select()
            .from(milestones)
            .where(eq(milestones.projectId, projectId))
            .orderBy(asc(milestones.dueDate));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch milestones' };
    }
}

export async function createMilestone(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const dueDate = formData.get('dueDate') as string;

    try {
        await db.insert(milestones).values({
            projectId,
            title,
            dueDate: dueDate ? new Date(dueDate) : null,
            status: 'pending'
        });
        revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/client');

        // Notify project manager
        const [project] = await db.select({ managerId: internalProjects.managerId })
            .from(internalProjects)
            .where(eq(internalProjects.id, projectId))
            .limit(1);
        
        if (project?.managerId) {
            await createNotification(
                project.managerId,
                'milestone_created',
                'New Milestone Created',
                `Milestone "${title}" added to project`,
                `/admin/projects/${projectId}`
            );
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create milestone' };
    }
}

export async function getProjectTasks(projectId: string) {
    try {
        const data = await db.select({
            id: tasks.id,
            projectId: tasks.projectId,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority, // Check if tasks has priority
            dueDate: tasks.dueDate,
            assigneeId: tasks.assigneeId,
            attachmentUrl: tasks.attachmentUrl,
            estimatedMinutes: tasks.estimatedMinutes,
            subtasks: tasks.subtasks,
            createdAt: tasks.createdAt,
            assigneeName: users.name,
            assigneeAvatar: users.avatarUrl
        })
            .from(tasks)
            .leftJoin(users, eq(tasks.assigneeId, users.id))
            .where(
                projectId === 'null'
                    ? sql`${tasks.projectId} IS NULL`
                    : eq(tasks.projectId, projectId)
            )
            .orderBy(desc(tasks.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch tasks' };
    }
}

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function createProjectTask(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const assigneeId = formData.get('assigneeId') as string || null;
    const dueDate = formData.get('dueDate') as string;
    const estimatedMinutes = parseInt(formData.get('estimatedMinutes') as string || '0');
    const subtasks = formData.get('subtasks') ? JSON.parse(formData.get('subtasks') as string) : [];
    const file = formData.get('file') as File;

    let attachmentUrl = null;

    if (file && file.size > 0 && file.name !== 'undefined') {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `task-${Date.now()}.${fileExt}`;
            const filePath = `${projectId || 'standalone'}/${fileName}`;

            // Ensure bucket exists
            const { data: buckets } = await supabaseAdmin.storage.listBuckets();
            if (!buckets?.find(b => b.name === 'project-files')) {
                await supabaseAdmin.storage.createBucket('project-files', { public: true });
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error: uploadError } = await supabaseAdmin.storage
                .from('project-files')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    upsert: true
                });

            if (uploadError) {
                console.error("Task File Upload Error:", uploadError);
            } else {
                const { data: { publicUrl } } = supabaseAdmin.storage
                    .from('project-files')
                    .getPublicUrl(filePath);
                attachmentUrl = publicUrl;
            }
        } catch (err) {
            console.error("File processing error:", err);
        }
    }

    try {
        await db.insert(tasks).values({
            projectId: projectId && projectId !== 'null' ? projectId : null,
            title,
            description: description || null,
            assigneeId: assigneeId === 'unassigned' ? null : assigneeId,
            dueDate: dueDate ? new Date(dueDate) : null,
            attachmentUrl: attachmentUrl,
            estimatedMinutes: estimatedMinutes,
            subtasks: subtasks,
            status: 'todo',
        });

        // Send notification to assignee if set
        if (assigneeId && assigneeId !== 'unassigned' && projectId && projectId !== 'null') {
            // Get project title for notification
            const [project] = await db.select({ title: internalProjects.title })
                .from(internalProjects)
                .where(eq(internalProjects.id, projectId));

            await createNotification(
                assigneeId,
                'task_assigned',
                `New task assigned: ${title}`,
                `You've been assigned a new task on project "${project?.title || 'Unknown'}"`,
                `/admin/projects/${projectId}`
            );

            // Send email notification to assignee
            const [assignee] = await db.select({ email: users.email, name: users.name })
                .from(users)
                .where(eq(users.id, assigneeId))
                .limit(1);

            if (assignee?.email) {
                try {
                    await resend.emails.send({
                        from: process.env.FROM_EMAIL!,
                        to: assignee.email,
                        subject: `New Task Assigned: ${title}`,
                        html: `
                            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                                <h1 style="color: #002D5B; margin-bottom: 20px;">Task Assignment</h1>
                                <p>Hi ${assignee.name || 'Team Member'},</p>
                                <p>You have been assigned a new task:</p>
                                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                                    <h2 style="color: #002D5B; margin: 0 0 10px 0;">${title}</h2>
                                    <p style="color: #64748b; margin: 0;">Project: ${project?.title || 'Standalone Task'}</p>
                                </div>
                                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/projects/${projectId}" 
                                   style="display: inline-block; background: #002D5B; color: #D4AF37; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
                                    View Task
                                </a>
                                <p style="color: #94a3b8; font-size: 12px; margin-top: 40px;">Bold Ideas | Task Management System</p>
                            </div>
                        `
                    });
                } catch (emailError) {
                    console.error('Failed to send task assignment email:', emailError);
                }
            }
        }

        if (projectId && projectId !== 'null') revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/admin/tasks');
        revalidatePath('/staff');

        // Log Activity
        await recordActivity({
            userId: assigneeId === 'unassigned' || !assigneeId ? 'system' : assigneeId,
            projectId: projectId || undefined,
            action: 'task_created',
            details: { title, priority: 'medium', estimatedMinutes } // Default priority in your schema seems to be medium
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to create task' };
    }
}

export async function updateTaskStatus(taskId: string, status: string, projectId: string) {
    try {
        // Get task info before updating
        const [taskInfo] = await db.select({ title: tasks.title, assigneeId: tasks.assigneeId })
            .from(tasks)
            .where(eq(tasks.id, taskId))
            .limit(1);

        await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));
        if (projectId && projectId !== 'null') revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/admin/tasks');
        revalidatePath('/staff');

        // Log Activity
        await recordActivity({
            userId: null, // System activity - no specific user
            projectId: projectId || undefined,
            taskId: taskId || undefined,
            action: status === 'done' ? 'task_completed' : 'task_status_updated',
            details: { newStatus: status }
        });

        // Send email to admins when task is completed
        if (status === 'done' && taskInfo) {
            // Get all admins
            const admins = await db.select({ email: users.email, name: users.name })
                .from(users)
                .where(eq(users.role, 'admin'));

            // Get project title
            let projectTitle = 'Standalone Task';
            if (projectId && projectId !== 'null') {
                const [project] = await db.select({ title: internalProjects.title })
                    .from(internalProjects)
                    .where(eq(internalProjects.id, projectId))
                    .limit(1);
                projectTitle = project?.title || 'Unknown Project';
            }

            // Get assignee name
            let assigneeName = 'Unknown';
            if (taskInfo.assigneeId) {
                const [assignee] = await db.select({ name: users.name })
                    .from(users)
                    .where(eq(users.id, taskInfo.assigneeId))
                    .limit(1);
                assigneeName = assignee?.name || 'Team Member';
            }

            for (const admin of admins) {
                if (admin.email) {
                    try {
                        await resend.emails.send({
                            from: process.env.FROM_EMAIL!,
                            to: admin.email,
                            subject: `Task Completed: ${taskInfo.title}`,
                            html: `
                                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                                    <h1 style="color: #002D5B; margin-bottom: 20px;">✅ Task Completed</h1>
                                    <p>Hi ${admin.name || 'Admin'},</p>
                                    <p>A task has been marked as complete:</p>
                                    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                                        <h2 style="color: #002D5B; margin: 0 0 10px 0;">${taskInfo.title}</h2>
                                        <p style="color: #64748b; margin: 0;">Project: ${projectTitle}</p>
                                        <p style="color: #64748b; margin: 5px 0 0 0;">Completed by: ${assigneeName}</p>
                                    </div>
                                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/projects/${projectId}" 
                                       style="display: inline-block; background: #002D5B; color: #D4AF37; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
                                        View Project
                                    </a>
                                    <p style="color: #94a3b8; font-size: 12px; margin-top: 40px;">Bold Ideas | Task Management System</p>
                                </div>
                            `
                        });
                    } catch (emailError) {
                        console.error('Failed to send task completion email:', emailError);
                    }
                }
            }
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update task' };
    }
}

export async function deleteProjectTask(formData: FormData) {
    const taskId = formData.get('taskId') as string;
    const projectId = formData.get('projectId') as string;
    try {
        await db.delete(tasks).where(eq(tasks.id, taskId));
        if (projectId && projectId !== 'null') revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/admin/tasks');
        revalidatePath('/staff');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete task' };
    }
}

export async function updateProjectTask(formData: FormData) {
    const taskId = formData.get('taskId') as string;
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const assigneeId = formData.get('assigneeId') as string;
    const dueDate = formData.get('dueDate') as string;
    const estimatedMinutes = parseInt(formData.get('estimatedMinutes') as string || '0');
    const subtasks = formData.get('subtasks') ? JSON.parse(formData.get('subtasks') as string) : null;

    try {
        const updateData: any = {
            title,
            description,
            assigneeId: assigneeId === 'unassigned' ? null : assigneeId,
            dueDate: dueDate ? new Date(dueDate) : null,
            estimatedMinutes,
        };
        if (subtasks) updateData.subtasks = subtasks;

        await db.update(tasks).set(updateData).where(eq(tasks.id, taskId));

        if (projectId && projectId !== 'null') revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath('/admin/tasks');
        revalidatePath('/staff');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update task' };
    }
}

export async function getProjectMembers(projectId: string) {
    try {
        const data = await db.select({
            id: projectMembers.id,
            userId: projectMembers.userId,
            role: projectMembers.role,
            addedAt: projectMembers.joinedAt,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl
        })
            .from(projectMembers)
            .leftJoin(users, eq(projectMembers.userId, users.id))
            .where(eq(projectMembers.projectId, projectId));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch members' };
    }
}

export async function addProjectMember(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const userId = formData.get('userId') as string;
    const role = formData.get('role') as string || 'member';

    try {
        const existing = await db.select().from(projectMembers)
            .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));

        if (existing.length > 0) return { success: false, error: 'User already added' };

        await db.insert(projectMembers).values({ projectId, userId, role });
        revalidatePath(`/admin/projects/${projectId}`);

        // Notify new member
        const [project] = await db.select({ title: internalProjects.title })
            .from(internalProjects)
            .where(eq(internalProjects.id, projectId))
            .limit(1);
        
        await createNotification(
            userId,
            'added_to_project',
            'Added to Project',
            `You have been added to project "${project?.title || 'Unknown'}"`,
            `/admin/projects/${projectId}`
        );

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to add member' };
    }
}

export async function removeProjectMember(formData: FormData) {
    const memberId = formData.get('memberId') as string;
    const projectId = formData.get('projectId') as string;

    try {
        await db.delete(projectMembers).where(eq(projectMembers.id, memberId));
        revalidatePath(`/admin/projects/${projectId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to remove member' };
    }
}

