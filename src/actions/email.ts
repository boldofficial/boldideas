'use server'

import { simpleParser } from 'mailparser';
import type { ParsedMail } from 'mailparser';
import { ImapFlow } from 'imapflow';
import { and, desc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { emailAccounts, emailMessages, interactions, leads, users } from '@/lib/db/schema';
import { resend } from '@/lib/resend';
import { requireStaffOrAdmin } from '@/lib/authz';

type LinkedContact = {
    leadId?: string | null;
    clientId?: string | null;
};

function getMailAddressList(value: FormDataEntryValue | null) {
    if (typeof value !== 'string') return '';
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .join(', ');
}

function getString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (typeof value !== 'string') return '';
    return value.trim();
}

function getDefaultEmailAddress() {
    return process.env.MAIL_FROM || process.env.FROM_EMAIL || process.env.SMTP_USER || process.env.IMAP_USER || '';
}

function getEmailConfig() {
    const email = getDefaultEmailAddress();
    return {
        email,
        fromName: process.env.MAIL_FROM_NAME || 'Bold Ideas',
        smtpReady: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && email),
        imapReady: Boolean(process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASS),
        imapHost: process.env.IMAP_HOST || 'imap.zoho.com',
        imapPort: Number(process.env.IMAP_PORT || 993),
        imapUser: process.env.IMAP_USER || process.env.SMTP_USER || email,
        imapPass: process.env.IMAP_PASS || process.env.SMTP_PASS || '',
    };
}

async function ensureDefaultEmailAccount() {
    const config = getEmailConfig();
    const [existing] = await db.select().from(emailAccounts).where(eq(emailAccounts.isDefault, true)).limit(1);

    if (existing) {
        if (config.email && existing.email !== config.email) {
            const [updated] = await db.update(emailAccounts)
                .set({
                    email: config.email,
                    fromName: config.fromName,
                    updatedAt: new Date(),
                })
                .where(eq(emailAccounts.id, existing.id))
                .returning();
            return updated;
        }
        return existing;
    }

    const [account] = await db.insert(emailAccounts).values({
        label: 'Shared Zoho Inbox',
        email: config.email || 'not-configured',
        provider: 'zoho',
        fromName: config.fromName,
        isDefault: true,
    }).returning();
    return account;
}

async function findLinkedContact(email: string): Promise<LinkedContact> {
    if (!email) return {};
    const normalizedEmail = email.toLowerCase();

    const [lead] = await db.select({ id: leads.id })
        .from(leads)
        .where(sql`lower(${leads.email}) = ${normalizedEmail}`)
        .limit(1);

    const [client] = await db.select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${normalizedEmail}`)
        .limit(1);

    return {
        leadId: lead?.id || null,
        clientId: client?.id || null,
    };
}

function normalizeThreadKey(subject?: string | null, messageId?: string | null) {
    const cleanedSubject = (subject || '')
        .replace(/^(re|fw|fwd):\s*/i, '')
        .trim()
        .toLowerCase();
    return cleanedSubject || messageId || `thread-${Date.now()}`;
}

function toDate(value: Date | string | undefined | null) {
    if (!value) return undefined;
    return value instanceof Date ? value : new Date(value);
}

function toAddressText(addresses: { address?: string; name?: string }[] | undefined) {
    return (addresses || [])
        .map((address) => address.address)
        .filter(Boolean)
        .join(', ');
}

function getParsedAddressValues(input: unknown) {
    if (!input) return undefined;
    if (Array.isArray(input)) {
        return input.flatMap((item) => {
            if (item && typeof item === 'object' && 'value' in item && Array.isArray(item.value)) {
                return item.value as { address?: string; name?: string }[];
            }
            return [];
        });
    }
    if (typeof input === 'object' && 'value' in input && Array.isArray(input.value)) {
        return input.value as { address?: string; name?: string }[];
    }
    return undefined;
}

export async function getEmailConfigStatus() {
    await requireStaffOrAdmin();
    const config = getEmailConfig();
    const account = await ensureDefaultEmailAccount();
    return {
        success: true,
        data: {
            email: config.email,
            smtpReady: config.smtpReady,
            imapReady: config.imapReady,
            accountEmail: account.email,
            lastSyncedAt: account.lastSyncedAt,
        },
    };
}

export async function getEmailMessages(mailbox = 'INBOX') {
    await requireStaffOrAdmin();
    await ensureDefaultEmailAccount();

    const data = await db.select({
        id: emailMessages.id,
        direction: emailMessages.direction,
        status: emailMessages.status,
        mailbox: emailMessages.mailbox,
        fromEmail: emailMessages.fromEmail,
        fromName: emailMessages.fromName,
        toEmails: emailMessages.toEmails,
        subject: emailMessages.subject,
        textBody: emailMessages.textBody,
        htmlBody: emailMessages.htmlBody,
        sentAt: emailMessages.sentAt,
        receivedAt: emailMessages.receivedAt,
        readAt: emailMessages.readAt,
        leadId: emailMessages.leadId,
        clientId: emailMessages.clientId,
        createdAt: emailMessages.createdAt,
    })
        .from(emailMessages)
        .where(eq(emailMessages.mailbox, mailbox))
        .orderBy(desc(emailMessages.receivedAt), desc(emailMessages.sentAt), desc(emailMessages.createdAt))
        .limit(100);

    return { success: true, data };
}

async function syncZohoInboxInternal(limit = 30) {
    const config = getEmailConfig();
    if (!config.imapReady) {
        return { success: false, error: 'IMAP is not configured. Add IMAP_HOST, IMAP_PORT, IMAP_USER, and IMAP_PASS in Coolify.' };
    }

    const account = await ensureDefaultEmailAccount();
    const client = new ImapFlow({
        host: config.imapHost,
        port: config.imapPort,
        secure: config.imapPort === 993,
        auth: {
            user: config.imapUser,
            pass: config.imapPass,
        },
        logger: false,
    });

    let imported = 0;
    let skipped = 0;

    try {
        await client.connect();
        const lock = await client.getMailboxLock('INBOX');
        try {
            const exists = client.mailbox ? client.mailbox.exists : 0;
            const start = Math.max(1, exists - limit + 1);

            for await (const message of client.fetch(`${start}:*`, { source: true, envelope: true, internalDate: true, flags: true, uid: true })) {
                if (!message.source) {
                    skipped += 1;
                    continue;
                }

                const parsed = await simpleParser(message.source) as ParsedMail;
                const parsedDate = toDate(parsed.date);
                const internalDate = toDate(message.internalDate);
                const messageId = parsed.messageId || `${message.uid}-${parsedDate?.toISOString() || internalDate?.toISOString() || Date.now()}`;

                const [existing] = await db.select({ id: emailMessages.id })
                    .from(emailMessages)
                    .where(and(eq(emailMessages.messageId, messageId), eq(emailMessages.mailbox, 'INBOX')))
                    .limit(1);

                if (existing) {
                    skipped += 1;
                    continue;
                }

                const from = parsed.from?.value?.[0];
                const fromEmail = from?.address || '';
                const linked = await findLinkedContact(fromEmail);
                const receivedAt = parsedDate || internalDate || new Date();
                const subject = parsed.subject || '(No subject)';

                const [inserted] = await db.insert(emailMessages).values({
                    accountId: account.id,
                    messageId,
                    threadKey: normalizeThreadKey(subject, messageId),
                    mailbox: 'INBOX',
                    direction: 'inbound',
                    status: 'received',
                    fromEmail,
                    fromName: from?.name || null,
                    toEmails: toAddressText(getParsedAddressValues(parsed.to)),
                    ccEmails: toAddressText(getParsedAddressValues(parsed.cc)),
                    subject,
                    textBody: parsed.text || null,
                    htmlBody: typeof parsed.html === 'string' ? parsed.html : null,
                    receivedAt,
                    leadId: linked.leadId || null,
                    clientId: linked.clientId || null,
                    metadata: {
                        uid: message.uid,
                        flags: Array.from(message.flags || []),
                    },
                }).returning({ id: emailMessages.id, leadId: emailMessages.leadId });

                if (inserted.leadId) {
                    await db.insert(interactions).values({
                        leadId: inserted.leadId,
                        type: 'email',
                        notes: `Email received from ${fromEmail || 'unknown sender'}: ${subject}`,
                    });
                }

                imported += 1;
            }
        } finally {
            lock.release();
        }

        await db.update(emailAccounts)
            .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
            .where(eq(emailAccounts.id, account.id));

        revalidatePath('/admin/email');
        revalidatePath('/admin/crm');
        return { success: true, imported, skipped };
    } catch (error) {
        console.error('syncZohoInbox error:', error);
        const message = error instanceof Error ? error.message : 'Failed to sync Zoho inbox';
        return { success: false, error: message };
    } finally {
        await client.logout().catch(() => undefined);
    }
}

export async function syncZohoInbox(limit = 30) {
    await requireStaffOrAdmin();
    return syncZohoInboxInternal(limit);
}

export async function syncZohoInboxForSystem(limit = 30) {
    return syncZohoInboxInternal(limit);
}

export async function sendPortalEmail(formData: FormData) {
    const currentUser = await requireStaffOrAdmin();
    const account = await ensureDefaultEmailAccount();
    const config = getEmailConfig();

    if (!config.smtpReady) {
        return { success: false, error: 'SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and FROM_EMAIL in Coolify.' };
    }

    const to = getMailAddressList(formData.get('to'));
    const cc = getMailAddressList(formData.get('cc'));
    const bcc = getMailAddressList(formData.get('bcc'));
    const subject = getString(formData, 'subject') || '(No subject)';
    const body = getString(formData, 'body');
    const leadId = getString(formData, 'leadId') || null;
    const clientId = getString(formData, 'clientId') || null;

    if (!to) return { success: false, error: 'Add at least one recipient.' };
    if (!body) return { success: false, error: 'Write a message before sending.' };

    const html = body
        .split('\n')
        .map((line) => line.trim() ? `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '<br/>')
        .join('');

    const { data, error } = await resend.emails.send({
        from: config.email,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        html,
    });

    const firstRecipient = to.split(',')[0]?.trim() || '';
    const linked = leadId || clientId ? { leadId, clientId } : await findLinkedContact(firstRecipient);

    const [message] = await db.insert(emailMessages).values({
        accountId: account.id,
        messageId: data?.id || `local-${Date.now()}`,
        threadKey: normalizeThreadKey(subject, data?.id),
        mailbox: 'Sent',
        direction: 'outbound',
        status: error ? 'failed' : 'sent',
        fromEmail: config.email,
        fromName: config.fromName,
        toEmails: to,
        ccEmails: cc || null,
        bccEmails: bcc || null,
        subject,
        textBody: body,
        htmlBody: html,
        sentAt: new Date(),
        leadId: linked.leadId || null,
        clientId: linked.clientId || null,
        createdBy: currentUser.id,
        metadata: error ? { error: error.message } : null,
    }).returning({ id: emailMessages.id, leadId: emailMessages.leadId });

    if (message.leadId) {
        await db.insert(interactions).values({
            leadId: message.leadId,
            type: 'email',
            notes: `Email sent to ${to}: ${subject}`,
            createdBy: currentUser.id,
        });
        revalidatePath(`/admin/crm/${message.leadId}`);
    }

    revalidatePath('/admin/email');
    if (error) return { success: false, error: error.message };
    return { success: true };
}
