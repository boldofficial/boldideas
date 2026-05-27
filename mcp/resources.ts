import { db } from './db.js';
import { leads, internalProjects, tasks, invoices, users } from '../src/lib/db/schema';
import { desc, eq, count, sql } from 'drizzle-orm';

// ─── Helper ────────────────────────────────────────────

function textResponse(text: string) {
  return {
    contents: [{ type: 'text' as const, text }],
  };
}

function jsonResponse(data: any) {
  return textResponse(JSON.stringify(data, null, 2));
}

// ─── Resource Handlers ─────────────────────────────────

export const resourceHandlers: Record<string, (uri: URL) => Promise<{ contents: { type: 'text'; text: string }[] }>> = {
  'bold://leads': async () => {
    const data = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100);
    return jsonResponse(data);
  },
  'bold://projects': async () => {
    const data = await db.select().from(internalProjects).orderBy(desc(internalProjects.createdAt));
    return jsonResponse(data);
  },
  'bold://tasks': async () => {
    const data = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    return jsonResponse(data);
  },
  'bold://invoices': async () => {
    const data = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
    return jsonResponse(data);
  },
  'bold://users': async () => {
    const data = await db.select().from(users).orderBy(desc(users.createdAt));
    return jsonResponse(data);
  },
  'bold://dashboard': async () => {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [projectCount] = await db.select({ count: count() }).from(internalProjects);
    const [taskCount] = await db.select({ count: count() }).from(tasks);
    const [leadCount] = await db.select({ count: count() }).from(leads);
    const [revenue] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)` })
      .from(invoices)
      .where(eq(invoices.status, 'paid'));
    return jsonResponse({
      totalUsers: userCount?.count || 0,
      totalProjects: projectCount?.count || 0,
      totalTasks: taskCount?.count || 0,
      totalLeads: leadCount?.count || 0,
      totalRevenue: Number(revenue?.total) || 0,
    });
  },
};

// ─── Template Resource Handler ─────────────────────────

export async function handleResourceTemplate(
  uri: URL,
  variables: { type?: string; id?: string }
) {
  const { type, id } = variables;

  if (!type || !id) {
    return textResponse(`Missing type or id in resource URI: ${uri.href}`);
  }

  switch (type) {
    case 'leads': {
      const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
      if (!lead) return textResponse('Lead not found');
      return jsonResponse(lead);
    }
    case 'projects': {
      const [project] = await db
        .select()
        .from(internalProjects)
        .where(eq(internalProjects.id, id))
        .limit(1);
      if (!project) return textResponse('Project not found');
      return jsonResponse(project);
    }
    case 'tasks': {
      const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
      if (!task) return textResponse('Task not found');
      return jsonResponse(task);
    }
    default:
      return textResponse(`Unknown resource type: ${type}`);
  }
}
