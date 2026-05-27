import { z } from 'zod';
import { db } from './db.js';
import {
  leads,
  internalProjects,
  tasks,
  invoices,
  users,
  notifications,
  interactions,
  milestones,
  expenses,
  activityLog,
  tickets,
} from '../src/lib/db/schema';
import { eq, desc, count, sql, and, gte, lte } from 'drizzle-orm';

// ─── Helper ────────────────────────────────────────────

function formatLead(l: any) {
  return {
    id: l.id,
    name: `${l.firstName} ${l.lastName}`,
    email: l.email,
    phone: l.phone,
    company: l.company,
    status: l.status,
    source: l.source,
    priority: l.priority,
    serviceInterest: l.serviceInterest,
    value: l.value,
    assignedTo: l.assignedTo,
    nextFollowUpAt: l.nextFollowUpAt?.toISOString(),
    createdAt: l.createdAt?.toISOString(),
  };
}

function formatProject(p: any) {
  return {
    id: p.id,
    title: p.title,
    status: p.status,
    type: p.type,
    clientId: p.clientId,
    managerId: p.managerId,
    startDate: p.startDate?.toISOString(),
    dueDate: p.dueDate?.toISOString(),
    budget: p.budget,
    description: p.description,
    createdAt: p.createdAt?.toISOString(),
  };
}

function formatTask(t: any) {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    projectId: t.projectId,
    assigneeId: t.assigneeId,
    dueDate: t.dueDate?.toISOString(),
    estimatedMinutes: t.estimatedMinutes,
    createdAt: t.createdAt?.toISOString(),
  };
}

// ─── CRM Tools ─────────────────────────────────────────

export const crmTools = [
  {
    name: 'crm_list_leads',
    config: {
      description: 'List all CRM leads with optional status filter',
      inputSchema: z.object({
        status: z.string().optional().describe('Filter by status: new, contacted, qualified, proposal, won, lost'),
        limit: z.number().optional().default(50).describe('Maximum number of leads to return'),
        includeLost: z.boolean().optional().default(false).describe('Include lost leads'),
      }),
    },
    handler: async (args: { status?: string; limit?: number; includeLost?: boolean }) => {
      try {
        let query = db.select().from(leads).orderBy(desc(leads.createdAt));
        if (args.status) {
          query = query.where(eq(leads.status, args.status)) as any;
        }
        if (!args.includeLost) {
          query = query.where(sql`${leads.status} != 'lost'`) as any;
        }
        const data = await query.limit(args.limit || 50);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(data.map(formatLead), null, 2) }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'crm_get_lead',
    config: {
      description: 'Get a single lead by ID with interactions',
      inputSchema: z.object({
        id: z.string().describe('Lead ID'),
      }),
    },
    handler: async (args: { id: string }) => {
      try {
        const [lead] = await db.select().from(leads).where(eq(leads.id, args.id)).limit(1);
        if (!lead) return { content: [{ type: 'text' as const, text: 'Lead not found' }], isError: true };
        const leadInteractions = await db
          .select()
          .from(interactions)
          .where(eq(interactions.leadId, args.id))
          .orderBy(desc(interactions.createdAt));
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ ...formatLead(lead), interactions: leadInteractions }, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'crm_create_lead',
    config: {
      description: 'Create a new lead in the CRM',
      inputSchema: z.object({
        firstName: z.string().describe('First name'),
        lastName: z.string().optional().default('').describe('Last name'),
        email: z.string().email().describe('Email address'),
        phone: z.string().optional().describe('Phone number'),
        company: z.string().optional().describe('Company name'),
        source: z.string().optional().describe('Lead source (website, referral, ads, etc.)'),
        serviceInterest: z.string().optional().describe('Service they are interested in'),
        notes: z.string().optional().describe('Notes about the lead'),
        value: z.string().optional().describe('Estimated deal value'),
      }),
    },
    handler: async (args: any) => {
      try {
        const [lead] = await db
          .insert(leads)
          .values({
            firstName: args.firstName,
            lastName: args.lastName || '',
            email: args.email,
            phone: args.phone,
            company: args.company,
            source: args.source || 'api',
            serviceInterest: args.serviceInterest,
            notes: args.notes,
            value: args.value,
          })
          .returning();
        return { content: [{ type: 'text' as const, text: JSON.stringify(formatLead(lead), null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'crm_update_lead_status',
    config: {
      description: 'Update a lead status and optionally log an interaction',
      inputSchema: z.object({
        id: z.string().describe('Lead ID'),
        status: z.string().describe('New status: new, contacted, qualified, proposal, won, lost'),
        note: z.string().optional().describe('Optional note for the status change'),
      }),
    },
    handler: async (args: { id: string; status: string; note?: string }) => {
      try {
        await db.update(leads).set({ status: args.status, updatedAt: new Date() }).where(eq(leads.id, args.id));
        if (args.note) {
          await db.insert(interactions).values({
            leadId: args.id,
            type: 'note',
            notes: `Status changed to ${args.status}: ${args.note}`,
          });
        }
        return { content: [{ type: 'text' as const, text: `Lead ${args.id} updated to status: ${args.status}` }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
];

// ─── Project Tools ─────────────────────────────────────

export const projectTools = [
  {
    name: 'pm_list_projects',
    config: {
      description: 'List all internal projects',
      inputSchema: z.object({
        status: z.string().optional().describe('Filter by status: planning, active, on_hold, completed, cancelled'),
      }),
    },
    handler: async (args: { status?: string }) => {
      try {
        let query = db.select().from(internalProjects).orderBy(desc(internalProjects.createdAt));
        if (args.status) query = query.where(eq(internalProjects.status, args.status)) as any;
        const data = await query;
        return { content: [{ type: 'text' as const, text: JSON.stringify(data.map(formatProject), null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'pm_get_project',
    config: {
      description: 'Get a single project with its tasks and milestones',
      inputSchema: z.object({ id: z.string().describe('Project ID') }),
    },
    handler: async (args: { id: string }) => {
      try {
        const [project] = await db.select().from(internalProjects).where(eq(internalProjects.id, args.id)).limit(1);
        if (!project) return { content: [{ type: 'text' as const, text: 'Project not found' }], isError: true };
        const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, args.id)).orderBy(desc(tasks.createdAt));
        const projectMilestones = await db
          .select()
          .from(milestones)
          .where(eq(milestones.projectId, args.id))
          .orderBy(milestones.dueDate);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                { ...formatProject(project), tasks: projectTasks.map(formatTask), milestones: projectMilestones },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'pm_update_project_status',
    config: {
      description: 'Update a project status',
      inputSchema: z.object({
        id: z.string().describe('Project ID'),
        status: z.string().describe('New status: planning, active, on_hold, completed, cancelled'),
      }),
    },
    handler: async (args: { id: string; status: string }) => {
      try {
        await db
          .update(internalProjects)
          .set({ status: args.status, updatedAt: new Date() })
          .where(eq(internalProjects.id, args.id));
        return { content: [{ type: 'text' as const, text: `Project ${args.id} updated to status: ${args.status}` }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
];

// ─── Task Tools ────────────────────────────────────────

export const taskTools = [
  {
    name: 'tasks_list',
    config: {
      description: 'List tasks with optional filters',
      inputSchema: z.object({
        status: z.string().optional().describe('Filter by status: todo, in_progress, review, done'),
        projectId: z.string().optional().describe('Filter by project ID'),
        assigneeId: z.string().optional().describe('Filter by assignee user ID'),
      }),
    },
    handler: async (args: { status?: string; projectId?: string; assigneeId?: string }) => {
      try {
        let query = db.select().from(tasks).orderBy(desc(tasks.createdAt));
        if (args.status) query = query.where(eq(tasks.status, args.status)) as any;
        if (args.projectId) query = query.where(eq(tasks.projectId, args.projectId)) as any;
        if (args.assigneeId) query = query.where(eq(tasks.assigneeId, args.assigneeId)) as any;
        const data = await query;
        return { content: [{ type: 'text' as const, text: JSON.stringify(data.map(formatTask), null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'tasks_create',
    config: {
      description: 'Create a new task',
      inputSchema: z.object({
        title: z.string().describe('Task title'),
        description: z.string().optional().describe('Task description'),
        status: z.string().optional().default('todo').describe('Status: todo, in_progress, review, done'),
        priority: z.string().optional().default('medium').describe('Priority: low, medium, high, urgent'),
        projectId: z.string().optional().describe('Project ID to assign this task to'),
        assigneeId: z.string().optional().describe('User ID to assign this task to'),
        dueDate: z.string().optional().describe('Due date (ISO string)'),
      }),
    },
    handler: async (args: any) => {
      try {
        const [task] = await db
          .insert(tasks)
          .values({
            title: args.title,
            description: args.description,
            status: args.status || 'todo',
            priority: args.priority || 'medium',
            projectId: args.projectId,
            assigneeId: args.assigneeId,
            dueDate: args.dueDate ? new Date(args.dueDate) : null,
          })
          .returning();
        return { content: [{ type: 'text' as const, text: JSON.stringify(formatTask(task), null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'tasks_update_status',
    config: {
      description: 'Update a task status',
      inputSchema: z.object({
        id: z.string().describe('Task ID'),
        status: z.string().describe('New status: todo, in_progress, review, done'),
      }),
    },
    handler: async (args: { id: string; status: string }) => {
      try {
        await db.update(tasks).set({ status: args.status, updatedAt: new Date() }).where(eq(tasks.id, args.id));
        return { content: [{ type: 'text' as const, text: `Task ${args.id} updated to status: ${args.status}` }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
];

// ─── Finance Tools ─────────────────────────────────────

export const financeTools = [
  {
    name: 'finance_list_invoices',
    config: {
      description: 'List invoices with optional status filter',
      inputSchema: z.object({
        status: z.string().optional().describe('Filter by status: draft, sent, paid, overdue, cancelled'),
      }),
    },
    handler: async (args: { status?: string }) => {
      try {
        let query = db.select().from(invoices).orderBy(desc(invoices.createdAt));
        if (args.status) query = query.where(eq(invoices.status, args.status)) as any;
        const data = await query;
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                data.map((inv: any) => ({
                  id: inv.id,
                  invoiceNumber: inv.invoiceNumber,
                  status: inv.status,
                  totalAmount: inv.totalAmount,
                  currency: inv.currency,
                  clientId: inv.clientId,
                  dueDate: inv.dueDate?.toISOString(),
                  createdAt: inv.createdAt?.toISOString(),
                })),
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'finance_get_revenue_metrics',
    config: {
      description: 'Get revenue metrics including monthly totals and pending amounts',
      inputSchema: z.object({}),
    },
    handler: async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [monthlyRevenue] = await db
          .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)` })
          .from(invoices)
          .where(and(eq(invoices.status, 'paid'), gte(invoices.createdAt, startOfMonth)));

        const [pendingInvoices] = await db
          .select({
            total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)`,
            count: count(),
          })
          .from(invoices)
          .where(sql`${invoices.status} NOT IN ('paid', 'cancelled')`);

        const [totalPaid] = await db
          .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)` })
          .from(invoices)
          .where(eq(invoices.status, 'paid'));

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  revenueThisMonth: Number(monthlyRevenue?.total) || 0,
                  pendingInvoicesValue: Number(pendingInvoices?.total) || 0,
                  pendingInvoicesCount: pendingInvoices?.count || 0,
                  totalRevenue: Number(totalPaid?.total) || 0,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
];

// ─── Communication Tools ───────────────────────────────

export const communicationTools = [
  {
    name: 'notify_send',
    config: {
      description: 'Send an in-app notification to a user',
      inputSchema: z.object({
        userId: z.string().describe('Recipient user ID'),
        title: z.string().describe('Notification title'),
        message: z.string().describe('Notification message'),
        type: z.string().optional().default('announcement').describe('Notification type'),
        link: z.string().optional().describe('Optional link to navigate to'),
      }),
    },
    handler: async (args: { userId: string; title: string; message: string; type?: string; link?: string }) => {
      try {
        await db.insert(notifications).values({
          userId: args.userId,
          title: args.title,
          message: args.message,
          type: args.type || 'announcement',
          link: args.link,
        });
        return { content: [{ type: 'text' as const, text: `Notification sent to user ${args.userId}` }] };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
  {
    name: 'analytics_get_dashboard',
    config: {
      description: 'Get high-level dashboard summary metrics',
      inputSchema: z.object({}),
    },
    handler: async () => {
      try {
        const [userCount] = await db.select({ count: count() }).from(users);
        const [activeProjectCount] = await db
          .select({ count: count() })
          .from(internalProjects)
          .where(eq(internalProjects.status, 'active'));
        const [pendingTasks] = await db
          .select({ count: count() })
          .from(tasks)
          .where(sql`${tasks.status} != 'done'`);
        const totalLeads = await db.select({ count: count() }).from(leads);
        const [revenue] = await db
          .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)` })
          .from(invoices)
          .where(eq(invoices.status, 'paid'));

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  totalUsers: userCount?.count || 0,
                  activeProjects: activeProjectCount?.count || 0,
                  pendingTasks: pendingTasks?.count || 0,
                  totalLeads: totalLeads[0]?.count || 0,
                  totalRevenue: Number(revenue?.total) || 0,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true };
      }
    },
  },
];
