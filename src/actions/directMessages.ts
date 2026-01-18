'use server'

import { db } from '@/lib/db';
import { directMessages, users } from '@/lib/db/schema';
import { eq, desc, or, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

// Get all conversations for a user (grouped by the other party)
export async function getConversations(userId: string) {
    try {
        // Get all messages where user is sender or recipient
        const messages = await db.select({
            id: directMessages.id,
            senderId: directMessages.senderId,
            recipientId: directMessages.recipientId,
            subject: directMessages.subject,
            content: directMessages.content,
            isRead: directMessages.isRead,
            createdAt: directMessages.createdAt,
        })
            .from(directMessages)
            .where(or(
                eq(directMessages.senderId, userId),
                eq(directMessages.recipientId, userId)
            ))
            .orderBy(desc(directMessages.createdAt));

        // Group by conversation partner
        const conversationsMap = new Map<string, any>();

        for (const msg of messages) {
            const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;

            if (!conversationsMap.has(partnerId)) {
                // Get partner details
                const [partner] = await db.select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    avatarUrl: users.avatarUrl,
                    role: users.role,
                }).from(users).where(eq(users.id, partnerId));

                conversationsMap.set(partnerId, {
                    partnerId,
                    partnerName: partner?.name || partner?.email || 'Unknown',
                    partnerEmail: partner?.email,
                    partnerAvatar: partner?.avatarUrl,
                    partnerRole: partner?.role,
                    lastMessage: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
                    lastMessageAt: msg.createdAt,
                    unreadCount: 0,
                });
            }

            // Count unread messages from this partner
            if (msg.recipientId === userId && !msg.isRead) {
                const conv = conversationsMap.get(partnerId);
                conv.unreadCount++;
            }
        }

        return { success: true, data: Array.from(conversationsMap.values()) };
    } catch (error) {
        console.error('getConversations error:', error);
        return { success: false, error: 'Failed to fetch conversations' };
    }
}

// Get messages between two users
export async function getMessages(userId: string, otherUserId: string) {
    try {
        const messages = await db.select({
            id: directMessages.id,
            senderId: directMessages.senderId,
            recipientId: directMessages.recipientId,
            subject: directMessages.subject,
            content: directMessages.content,
            isRead: directMessages.isRead,
            createdAt: directMessages.createdAt,
        })
            .from(directMessages)
            .where(or(
                and(eq(directMessages.senderId, userId), eq(directMessages.recipientId, otherUserId)),
                and(eq(directMessages.senderId, otherUserId), eq(directMessages.recipientId, userId))
            ))
            .orderBy(directMessages.createdAt);

        // Mark received messages as read
        await db.update(directMessages)
            .set({ isRead: true })
            .where(and(
                eq(directMessages.senderId, otherUserId),
                eq(directMessages.recipientId, userId),
                eq(directMessages.isRead, false)
            ));

        return { success: true, data: messages };
    } catch (error) {
        console.error('getMessages error:', error);
        return { success: false, error: 'Failed to fetch messages' };
    }
}

// Send a new message
export async function sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    subject?: string,
    projectId?: string
) {
    try {
        await db.insert(directMessages).values({
            senderId,
            recipientId,
            content,
            subject: subject || null,
            projectId: projectId || null,
        });

        // Get sender details for notification
        const [sender] = await db.select({ name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, senderId));

        // Create notification for recipient
        await createNotification(
            recipientId,
            'message',
            `New message from ${sender?.name || sender?.email || 'Someone'}`,
            content.substring(0, 100),
            '/staff/inbox' // or determine based on recipient role
        );

        revalidatePath('/staff/inbox');
        revalidatePath('/admin/messages');
        revalidatePath('/client/messages');

        return { success: true };
    } catch (error) {
        console.error('sendMessage error:', error);
        return { success: false, error: 'Failed to send message' };
    }
}

// Get unread message count
export async function getUnreadMessageCount(userId: string) {
    try {
        const messages = await db.select()
            .from(directMessages)
            .where(and(
                eq(directMessages.recipientId, userId),
                eq(directMessages.isRead, false)
            ));
        return { success: true, count: messages.length };
    } catch (error) {
        return { success: false, count: 0 };
    }
}
