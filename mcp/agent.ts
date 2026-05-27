import { db } from './db.js';
import {
  leads,
  tasks,
  invoices,
  notifications,
  users,
  activityLog,
} from '../src/lib/db/schema';
import { eq, and, sql, lte, gte, count, desc } from 'drizzle-orm';

// ─── Logging ───────────────────────────────────────────

function log(msg: string) {
  console.error(`[AI Agent] ${msg}`);
}

// ─── Lead Follow-up Check ──────────────────────────────

export async function checkStaleLeads(): Promise<string[]> {
  const actions: string[] = [];
  try {
    const now = new Date();
    const staleDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const staleLeads = await db
      .select()
      .from(leads)
      .where(
        and(
          sql`${leads.status} IN ('new', 'contacted')`,
          sql`${leads.updatedAt} < ${staleDate}`,
          sql`${leads.nextFollowUpAt} IS NULL OR ${leads.nextFollowUpAt} < ${now}`
        )
      );

    for (const lead of staleLeads) {
      log(`Lead ${lead.firstName} ${lead.lastName} (${lead.email}) needs follow-up`);

      // Auto-create a task for follow-up
      const [task] = await db
        .insert(tasks)
        .values({
          title: `Follow up with ${lead.firstName} ${lead.lastName}`,
          description: `Lead from ${lead.source || 'unknown source'} has not been updated in over a week. Company: ${lead.company || 'N/A'}, Service interest: ${lead.serviceInterest || 'N/A'}. Contact: ${lead.email}`,
          status: 'todo',
          priority: lead.priority || 'medium',
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Due tomorrow
        })
        .returning({ id: tasks.id });

      actions.push(
        `Created follow-up task for lead "${lead.firstName} ${lead.lastName}" (${lead.email})`
      );

      // Log activity
      await db.insert(activityLog).values({
        action: 'agent_stale_lead_followup',
        details: { leadId: lead.id, taskId: task.id, email: lead.email },
      });
    }
  } catch (error) {
    log(`Error checking stale leads: ${error}`);
  }
  return actions;
}

// ─── Overdue Task Reminder ─────────────────────────────

export async function checkOverdueTasks(): Promise<string[]> {
  const actions: string[] = [];
  try {
    const now = new Date();

    const overdueTasks = await db
      .select()
      .from(tasks)
      .where(and(sql`${tasks.status} != 'done'`, sql`${tasks.dueDate} < ${now}`, sql`${tasks.dueDate} IS NOT NULL`));

    for (const task of overdueTasks) {
      log(`Task "${task.title}" (${task.id}) is overdue`);

      // Create a notification for assignee
      if (task.assigneeId) {
        await db.insert(notifications).values({
          userId: task.assigneeId,
          type: 'task_assigned',
          title: '⚠️ Task Overdue',
          message: `Task "${task.title}" was due ${task.dueDate?.toLocaleDateString()} and is still ${task.status}.`,
          link: `/admin/tasks`,
        });
      }

      actions.push(`Sent overdue reminder for task "${task.title}"`);

      // Log activity
      await db.insert(activityLog).values({
        action: 'agent_overdue_task_reminder',
        details: { taskId: task.id, title: task.title, assigneeId: task.assigneeId },
      });
    }
  } catch (error) {
    log(`Error checking overdue tasks: ${error}`);
  }
  return actions;
}

// ─── Invoice Overdue Reminder ──────────────────────────

export async function checkOverdueInvoices(): Promise<string[]> {
  const actions: string[] = [];
  try {
    const now = new Date();

    const overdueInvoices = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.status, 'sent'), sql`${invoices.dueDate} < ${now}`));

    for (const invoice of overdueInvoices) {
      log(`Invoice "${invoice.invoiceNumber}" (${invoice.id}) is overdue`);

      // Update status to overdue
      await db
        .update(invoices)
        .set({ status: 'overdue', updatedAt: new Date() })
        .where(eq(invoices.id, invoice.id));

      actions.push(`Marked invoice ${invoice.invoiceNumber} as overdue`);

      // Log activity
      await db.insert(activityLog).values({
        action: 'agent_invoice_overdue',
        details: { invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber },
      });
    }
  } catch (error) {
    log(`Error checking overdue invoices: ${error}`);
  }
  return actions;
}

// ─── Weekly Summary Report ─────────────────────────────

export async function generateWeeklySummary(): Promise<string> {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [newLeads] = await db
      .select({ count: count() })
      .from(leads)
      .where(gte(leads.createdAt, weekAgo));

    const [completedTasks] = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(eq(tasks.status, 'done'), gte(tasks.updatedAt, weekAgo)));

    const [revenue] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)` })
      .from(invoices)
      .where(and(eq(invoices.status, 'paid'), gte(invoices.createdAt, weekAgo)));

    const recentActivity = await db
      .select()
      .from(activityLog)
      .where(gte(activityLog.createdAt, weekAgo))
      .orderBy(desc(activityLog.createdAt))
      .limit(10);

    const summary = {
      period: {
        start: weekAgo.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0],
      },
      metrics: {
        newLeads: newLeads?.count || 0,
        completedTasks: completedTasks?.count || 0,
        revenueThisWeek: Number(revenue?.total) || 0,
      },
      recentActivity: recentActivity.map((a) => ({
        action: a.action,
        details: a.details,
        time: a.createdAt?.toISOString(),
      })),
    };

    return JSON.stringify(summary, null, 2);
  } catch (error) {
    return `Error generating summary: ${error}`;
  }
}

// ─── Run All Checks ────────────────────────────────────

export async function runAllChecks(): Promise<string[]> {
  log('Running automated checks...');
  const allActions: string[] = [];

  const leadActions = await checkStaleLeads();
  allActions.push(...leadActions);

  const taskActions = await checkOverdueTasks();
  allActions.push(...taskActions);

  const invoiceActions = await checkOverdueInvoices();
  allActions.push(...invoiceActions);

  if (allActions.length === 0) {
    allActions.push('All checks passed — no actions needed.');
  }

  log(`Checks complete. ${allActions.length} action(s) taken.`);
  return allActions;
}
