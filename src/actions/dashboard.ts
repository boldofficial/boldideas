'use server';

import { db } from '@/lib/db';
import { users, internalProjects, tasks, invoices, leads } from '@/lib/db/schema';
import { eq, count, sql, and, gte, lte } from 'drizzle-orm';
import { requireStaffOrAdmin } from '@/lib/authz';

export async function getDashboardMetrics() {
    try {
        await requireStaffOrAdmin();
        // Get current date info for time-based queries
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Total Users
        const [userCount] = await db.select({ count: count() }).from(users);

        // Active Projects
        const [activeProjectCount] = await db
            .select({ count: count() })
            .from(internalProjects)
            .where(eq(internalProjects.status, 'active'));

        // Total Projects
        const [totalProjectCount] = await db.select({ count: count() }).from(internalProjects);

        // Tasks Completed This Week
        const [completedTasksThisWeek] = await db
            .select({ count: count() })
            .from(tasks)
            .where(
                and(
                    eq(tasks.status, 'done'),
                    gte(tasks.updatedAt, startOfWeek)
                )
            );

        // Pending Tasks (not done)
        const [pendingTasks] = await db
            .select({ count: count() })
            .from(tasks)
            .where(sql`${tasks.status} != 'done'`);

        // Revenue This Month (paid invoices)
        const [revenueResult] = await db
            .select({
                total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)`
            })
            .from(invoices)
            .where(
                and(
                    eq(invoices.status, 'paid'),
                    gte(invoices.createdAt, startOfMonth)
                )
            );

        // Pending Invoices Value
        const [pendingInvoicesResult] = await db
            .select({
                total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)`,
                count: count()
            })
            .from(invoices)
            .where(sql`${invoices.status} NOT IN ('paid', 'cancelled')`);

        // Overdue Tasks
        const [overdueTasks] = await db
            .select({ count: count() })
            .from(tasks)
            .where(
                and(
                    sql`${tasks.status} != 'done'`,
                    sql`${tasks.dueDate} < NOW()`
                )
            );

        // ── Chart Data: Monthly Revenue Trend (last 6 months) ──
        const revenueTrend: { month: string; revenue: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
            const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
            const [result] = await db
                .select({
                    total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)`
                })
                .from(invoices)
                .where(
                    and(
                        eq(invoices.status, 'paid'),
                        gte(invoices.createdAt, monthStart),
                        lte(invoices.createdAt, monthEnd)
                    )
                );
            revenueTrend.push({
                month: d.toLocaleDateString('en-US', { month: 'short' }),
                revenue: Number(result?.total) || 0,
            });
        }

        // ── Chart Data: Lead Pipeline ──
        const allLeads = await db.select({ status: leads.status, value: leads.value }).from(leads);
        const leadStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
        const pipeline = leadStatuses.map(status => ({
            status,
            count: allLeads.filter(l => l.status === status).length,
            value: allLeads
                .filter(l => l.status === status)
                .reduce((s, l) => s + Number(l.value || 0), 0),
        }));

        // ── Chart Data: Task Completion Trend (last 7 days) ──
        const taskTrend: { date: string; completed: number; created: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

            const [completed] = await db
                .select({ count: count() })
                .from(tasks)
                .where(
                    and(
                        eq(tasks.status, 'done'),
                        gte(tasks.updatedAt, dayStart),
                        lte(tasks.updatedAt, dayEnd)
                    )
                );

            const [created] = await db
                .select({ count: count() })
                .from(tasks)
                .where(
                    and(
                        gte(tasks.createdAt, dayStart),
                        lte(tasks.createdAt, dayEnd)
                    )
                );

            taskTrend.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                completed: completed?.count || 0,
                created: created?.count || 0,
            });
        }

        // ── Lead Summary Stats ──
        const totalLeads = allLeads.length;
        const wonLeads = allLeads.filter(l => l.status === 'won').length;
        const lostLeads = allLeads.filter(l => l.status === 'lost').length;
        const winRate = totalLeads > 0 ? Math.round((wonLeads / (wonLeads + lostLeads)) * 100) : 0;

        return {
            success: true,
            data: {
                totalUsers: userCount?.count || 0,
                activeProjects: activeProjectCount?.count || 0,
                totalProjects: totalProjectCount?.count || 0,
                completedTasksThisWeek: completedTasksThisWeek?.count || 0,
                pendingTasks: pendingTasks?.count || 0,
                revenueThisMonth: Number(revenueResult?.total) || 0,
                pendingInvoicesValue: Number(pendingInvoicesResult?.total) || 0,
                pendingInvoicesCount: pendingInvoicesResult?.count || 0,
                overdueTasks: overdueTasks?.count || 0,
                // Chart data
                revenueTrend,
                pipeline,
                taskTrend,
                // Lead stats
                totalLeads,
                wonLeads,
                lostLeads,
                winRate,
            }
        };
    } catch (error) {
        console.error('getDashboardMetrics error:', error);
        return {
            success: false,
            error: 'Failed to fetch dashboard metrics'
        };
    }
}
