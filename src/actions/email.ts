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

let emailSchemaReady = false;

const EMAIL_SCHEMA_STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS "email_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "label" text DEFAULT 'Shared Inbox' NOT NULL,
        "email" text NOT NULL,
        "provider" text DEFAULT 'zoho' NOT NULL,
        "from_name" text,
        "signature" text,
        "is_default" boolean DEFAULT true,
        "last_synced_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS "email_messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "account_id" uuid,
        "message_id" text,
        "thread_key" text,
        "mailbox" text DEFAULT 'INBOX' NOT NULL,
        "direction" text DEFAULT 'inbound' NOT NULL,
        "status" text DEFAULT 'received' NOT NULL,
        "from_email" text,
        "from_name" text,
        "to_emails" text,
        "cc_emails" text,
        "bcc_emails" text,
        "subject" text,
        "text_body" text,
        "html_body" text,
        "sent_at" timestamp,
        "received_at" timestamp,
        "read_at" timestamp,
        "lead_id" uuid,
        "client_id" uuid,
        "created_by" uuid,
        "metadata" jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
    )`,
    `DO $$ BEGIN
        ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_account_id_email_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "email_accounts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$`,
    `DO $$ BEGIN
        ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$`,
    `DO $$ BEGIN
        ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$`,
    `DO $$ BEGIN
        ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "email_messages_message_id_mailbox_idx" ON "email_messages" ("message_id", "mailbox")`,
    `CREATE INDEX IF NOT EXISTS "email_messages_thread_key_idx" ON "email_messages" ("thread_key")`,
    `CREATE INDEX IF NOT EXISTS "email_messages_lead_id_idx" ON "email_messages" ("lead_id")`,
    `CREATE INDEX IF NOT EXISTS "email_messages_client_id_idx" ON "email_messages" ("client_id")`,
];

async function ensureEmailSchema() {
    if (emailSchemaReady) return;
    for (const statement of EMAIL_SCHEMA_STATEMENTS) {
        await db.execute(sql.raw(statement));
    }
    emailSchemaReady = true;
}

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

function getEmailAttachments(formData: FormData) {
    return formData.getAll('attachments')
        .filter((item): item is File => item instanceof File && item.size > 0)
        .slice(0, 8);
}

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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
    await ensureEmailSchema();
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

export async function getLeadEmailThreads(leadId: string) {
    await requireStaffOrAdmin();
    await ensureEmailSchema();

    const data = await db.select({
        id: emailMessages.id,
        direction: emailMessages.direction,
        status: emailMessages.status,
        mailbox: emailMessages.mailbox,
        fromEmail: emailMessages.fromEmail,
        fromName: emailMessages.fromName,
        toEmails: emailMessages.toEmails,
        ccEmails: emailMessages.ccEmails,
        bccEmails: emailMessages.bccEmails,
        subject: emailMessages.subject,
        textBody: emailMessages.textBody,
        htmlBody: emailMessages.htmlBody,
        threadKey: emailMessages.threadKey,
        sentAt: emailMessages.sentAt,
        receivedAt: emailMessages.receivedAt,
        readAt: emailMessages.readAt,
        metadata: emailMessages.metadata,
        createdAt: emailMessages.createdAt,
    })
        .from(emailMessages)
        .where(eq(emailMessages.leadId, leadId))
        .orderBy(desc(emailMessages.receivedAt), desc(emailMessages.sentAt), desc(emailMessages.createdAt))
        .limit(150);

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
    const bodyHtml = getString(formData, 'bodyHtml');
    const leadId = getString(formData, 'leadId') || null;
    const clientId = getString(formData, 'clientId') || null;
    const files = getEmailAttachments(formData);

    if (!to) return { success: false, error: 'Add at least one recipient.' };
    if (!body && !bodyHtml) return { success: false, error: 'Write a message before sending.' };
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) return { success: false, error: `${oversized.name} is larger than 10MB.` };

    const html = bodyHtml || body
        .split('\n')
        .map((line) => line.trim() ? `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '<br/>')
        .join('');
    const attachments = await Promise.all(files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
    })));

    const { data, error } = await resend.emails.send({
        from: config.email,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        html,
        attachments,
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
        textBody: body || stripHtml(html),
        htmlBody: html,
        sentAt: new Date(),
        leadId: linked.leadId || null,
        clientId: linked.clientId || null,
        createdBy: currentUser.id,
        metadata: {
            ...(error ? { error: error.message } : {}),
            attachments: files.map((file) => ({ name: file.name, size: file.size, type: file.type })),
        },
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
