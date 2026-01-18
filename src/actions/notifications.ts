'use server'

import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getNotifications(userId: string) {
    try {
        const data = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(50);
        return { success: true, data };
    } catch (error) {
        console.error('getNotifications error:', error);
        return { success: false, error: 'Failed to fetch notifications' };
    }
}

export async function getUnreadCount(userId: string) {
    try {
        const data = await db.select()
            .from(notifications)
            .where(and(
                eq(notifications.userId, userId),
                eq(notifications.isRead, false)
            ));
        return { success: true, count: data.length };
    } catch (error) {
        return { success: false, count: 0 };
    }
}

export async function createNotification(
    userId: string,
    type: string,
    title: string,
    message?: string,
    link?: string
) {
    try {
        await db.insert(notifications).values({
            userId,
            type,
            title,
            message: message || null,
            link: link || null,
        });
        return { success: true };
    } catch (error) {
        console.error('createNotification error:', error);
        return { success: false, error: 'Failed to create notification' };
    }
}

export async function markNotificationRead(notificationId: string) {
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, notificationId));
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to mark notification as read' };
    }
}

export async function markAllNotificationsRead(userId: string) {
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));
        revalidatePath('/staff');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to mark all as read' };
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        await db.delete(notifications).where(eq(notifications.id, notificationId));
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete notification' };
    }
}
