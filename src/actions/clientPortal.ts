'use server';

import { db } from '@/lib/db';
import { internalProjects, tasks, projectFiles, users } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

// Types
export type ClientProject = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date | null;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  managerName: string | null;
};

export type ProjectFile = {
  id: string;
  name: string;
  url: string;
  type: string | null;
  sizeBytes: number | null;
  createdAt: Date | null;
  uploadedByName: string | null;
};

/**
 * Get all projects assigned to a specific client
 */
export async function getClientProjects(clientId: string) {
  try {
    console.log('🔍 DEBUG getClientProjects: clientId =', clientId);
    
    const projects = await db
      .select({
        id: internalProjects.id,
        title: internalProjects.title,
        description: internalProjects.description,
        status: internalProjects.status,
        startDate: internalProjects.startDate,
        dueDate: internalProjects.dueDate,
        createdAt: internalProjects.createdAt,
        managerName: users.name,
      })
      .from(internalProjects)
      .leftJoin(users, eq(internalProjects.managerId, users.id))
      .where(eq(internalProjects.clientId, clientId))
      .orderBy(desc(internalProjects.createdAt));

    console.log('🔍 DEBUG getClientProjects: Found', projects.length, 'projects');
    console.log('🔍 DEBUG getClientProjects: Projects =', projects);

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const projectTasks = await db
          .select({ status: tasks.status })
          .from(tasks)
          .where(eq(tasks.projectId, project.id));

        const totalTasks = projectTasks.length;
        const completedTasks = projectTasks.filter(t => t.status === 'done').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project,
          progress,
          totalTasks,
          completedTasks,
        };
      })
    );

    return { success: true, data: projectsWithProgress };
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return { success: false, error: 'Failed to fetch projects' };
  }
}

/**
 * Get a single project detail by ID (with client access check)
 */
export async function getClientProject(projectId: string, clientId: string) {
  try {
    const project = await db
      .select({
        id: internalProjects.id,
        title: internalProjects.title,
        description: internalProjects.description,
        status: internalProjects.status,
        startDate: internalProjects.startDate,
        dueDate: internalProjects.dueDate,
        budget: internalProjects.budget,
        createdAt: internalProjects.createdAt,
        managerName: users.name,
        clientId: internalProjects.clientId,
      })
      .from(internalProjects)
      .leftJoin(users, eq(internalProjects.managerId, users.id))
      .where(
        and(
          eq(internalProjects.id, projectId),
          eq(internalProjects.clientId, clientId)
        )
      )
      .limit(1);

    if (project.length === 0) {
      return { success: false, error: 'Project not found or access denied' };
    }

    // Get tasks for progress calculation
    const projectTasks = await db
      .select({ status: tasks.status })
      .from(tasks)
      .where(eq(tasks.projectId, projectId));

    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'done').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      success: true,
      data: {
        ...project[0],
        progress,
        totalTasks,
        completedTasks,
      },
    };
  } catch (error) {
    console.error('Error fetching client project:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
}

/**
 * Get tasks for a project (client-visible summary only)
 */
export async function getClientProjectTasks(projectId: string, clientId: string) {
  try {
    // First verify client has access to this project
    const project = await db
      .select({ id: internalProjects.id })
      .from(internalProjects)
      .where(
        and(
          eq(internalProjects.id, projectId),
          eq(internalProjects.clientId, clientId)
        )
      )
      .limit(1);

    if (project.length === 0) {
      return { success: false, error: 'Access denied' };
    }

    const projectTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
      })
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));

    return { success: true, data: projectTasks };
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}

/**
 * Get files for a project
 */
export async function getProjectFiles(projectId: string, clientId: string) {
  try {
    // First verify client has access to this project
    const project = await db
      .select({ id: internalProjects.id })
      .from(internalProjects)
      .where(
        and(
          eq(internalProjects.id, projectId),
          eq(internalProjects.clientId, clientId)
        )
      )
      .limit(1);

    if (project.length === 0) {
      return { success: false, error: 'Access denied' };
    }

    const files = await db
      .select({
        id: projectFiles.id,
        name: projectFiles.name,
        url: projectFiles.url,
        type: projectFiles.type,
        sizeBytes: projectFiles.sizeBytes,
        createdAt: projectFiles.createdAt,
        uploadedByName: users.name,
      })
      .from(projectFiles)
      .leftJoin(users, eq(projectFiles.uploadedBy, users.id))
      .where(eq(projectFiles.projectId, projectId))
      .orderBy(desc(projectFiles.createdAt));

    return { success: true, data: files };
  } catch (error) {
    console.error('Error fetching project files:', error);
    return { success: false, error: 'Failed to fetch files' };
  }
}
