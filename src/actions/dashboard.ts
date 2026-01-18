'use server';

import { db } from '@/lib/db';
import { users, internalProjects, tasks, invoices } from '@/lib/db/schema';
import { eq, count, sql, and, gte, lte } from 'drizzle-orm';

export async function getDashboardMetrics() {
    try {
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
