'use server'

import { db } from '@/lib/db';
import { leads, interactions, users, internalProjects, invoices, invoiceItems } from '@/lib/db/schema';
import { eq, desc, or, sql, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';
import { authzError, requireAdmin, requireStaffOrAdmin } from '@/lib/authz';

function getOptionalString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed || undefined;
}

function getFollowUpDate(formData: FormData) {
    const value = getOptionalString(formData, 'nextFollowUpAt');
    return value ? new Date(value) : undefined;
}

function getCsvCell(row: Record<string, string>, keys: string[]) {
    for (const key of keys) {
        const value = row[key];
        if (value?.trim()) return value.trim();
    }
    return undefined;
}

function normalizeCsvHeader(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function parseCsvLine(line: string) {
    const values: string[] = [];
    let current = '';
    let quoted = false;

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];

        if (char === '"' && quoted && next === '"') {
            current += '"';
            index += 1;
            continue;
        }

        if (char === '"') {
            quoted = !quoted;
            continue;
        }

        if (char === ',' && !quoted) {
            values.push(current.trim());
            current = '';
            continue;
        }

        current += char;
    }

    values.push(current.trim());
    return values;
}

function parseCsv(text: string) {
    const lines = text
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);

    if (lines.length < 2) return [];

    const headers = parseCsvLine(lines[0]).map(normalizeCsvHeader);
    return lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        return headers.reduce<Record<string, string>>((row, header, index) => {
            row[header] = values[index] || '';
            return row;
        }, {});
    });
}

function splitFullName(name: string) {
    const parts = name.trim().split(/\s+/);
    return {
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' '),
    };
}

function formatLeadName(lead: { firstName?: string | null; lastName?: string | null; company?: string | null; email?: string | null }) {
    const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim();
    return name || lead.company || lead.email || 'Unnamed lead';
}

function formatQuoteNotes(formData: FormData) {
    const message = getOptionalString(formData, 'message') || getOptionalString(formData, 'notes') || '';
    const features = getOptionalString(formData, 'features');
    const packageInterest = getOptionalString(formData, 'package') || getOptionalString(formData, 'type');
    const budget = getOptionalString(formData, 'budget');
    const timeline = getOptionalString(formData, 'timeline');
    const callback = getOptionalString(formData, 'callback') || getOptionalString(formData, 'callbackRequest');

    const lines = [
        packageInterest ? `Package / request type: ${packageInterest}` : null,
        features ? `Requested features: ${features}` : null,
        budget ? `Budget: ${budget}` : null,
        timeline ? `Timeline: ${timeline}` : null,
        callback ? `Callback preference: ${callback}` : null,
        message ? `Message: ${message}` : null,
    ].filter(Boolean);

    return lines.join('\n');
}

async function findLeadByEmail(email: string) {
    if (!email.trim()) return undefined;
    const normalizedEmail = email.toLowerCase();
    const [existingLead] = await db.select()
        .from(leads)
        .where(sql`lower(${leads.email}) = ${normalizedEmail}`)
        .limit(1);
    return existingLead;
}

async function notifyAdmins(title: string, message: string, link: string) {
    const admins = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.role, 'admin'))
        .limit(8);

    for (const admin of admins) {
        await createNotification(admin.id, 'lead_created', title, message, link);
    }
}

async function getLeadForConversion(leadId: string) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    return lead;
}

async function findUserByEmail(email: string) {
    if (!email.trim()) return undefined;
    const normalizedEmail = email.toLowerCase();
    const [user] = await db.select()
        .from(users)
        .where(sql`lower(${users.email}) = ${normalizedEmail}`)
        .limit(1);
    return user;
}

async function ensureClientFromLead(leadId: string) {
    const lead = await getLeadForConversion(leadId);
    if (!lead) return { success: false as const, error: 'Lead not found' };
    if (!lead.email) return { success: false as const, error: 'Add an email address before converting this lead to a client, project, or invoice.' };

    if (lead.clientId) {
        return { success: true as const, lead, clientId: lead.clientId, created: false };
    }

    const existingUser = await findUserByEmail(lead.email);
    if (existingUser) {
        if ((existingUser.role || 'user') === 'user' || existingUser.role === 'client') {
            await db.update(users)
                .set({
                    name: existingUser.name || formatLeadName(lead),
                    isActive: true,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, existingUser.id));
        }

        await db.update(leads)
            .set({ clientId: existingUser.id, updatedAt: new Date() })
            .where(eq(leads.id, leadId));

        return { success: true as const, lead: { ...lead, clientId: existingUser.id }, clientId: existingUser.id, created: false };
    }

    const [client] = await db.insert(users).values({
        email: lead.email,
        name: formatLeadName(lead),
        role: 'user',
        isActive: true,
        emailVerified: false,
    }).returning({ id: users.id });

    await db.update(leads)
        .set({ clientId: client.id, updatedAt: new Date() })
        .where(eq(leads.id, leadId));

    return { success: true as const, lead: { ...lead, clientId: client.id }, clientId: client.id, created: true };
}

async function addConversionActivity(leadId: string, userId: string, notes: string) {
    await db.insert(interactions).values({
        leadId,
        type: 'note',
        notes,
        createdBy: userId,
    });
}

async function nextInvoiceNumber() {
    try {
        const count = await db.select({ id: invoices.id }).from(invoices);
        return `INV-${new Date().getFullYear()}-${(count.length + 1).toString().padStart(3, '0')}`;
    } catch {
        return `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    }
}

export async function bulkUpdateLeads(ids: string[], updates: { status?: string; assignedTo?: string | null; priority?: string }) {
    try {
        await requireStaffOrAdmin();
        const updateData: {
            updatedAt: Date;
            status?: string;
            priority?: string;
            assignedTo?: string | null;
        } = { updatedAt: new Date() };
        if (updates.status) updateData.status = updates.status;
        if (updates.priority) updateData.priority = updates.priority;
        if (updates.assignedTo !== undefined) updateData.assignedTo = updates.assignedTo || null;

        await db.update(leads)
            .set(updateData)
            .where(inArray(leads.id, ids));

        revalidatePath('/admin/crm');
        return { success: true, count: ids.length };
    } catch {
        return { success: false, error: 'Failed to bulk update leads' };
    }
}

export async function bulkDeleteLeads(ids: string[]) {
    try {
        await requireStaffOrAdmin();
        await db.delete(leads).where(inArray(leads.id, ids));
        revalidatePath('/admin/crm');
        return { success: true, count: ids.length };
    } catch {
        return { success: false, error: 'Failed to delete leads' };
    }
}

export async function getAnalyticsData() {
    try {
        await requireStaffOrAdmin();
        const allLeads = await db.select().from(leads);

        const total = allLeads.length;
        const won = allLeads.filter(l => l.status === 'won').length;
        const lost = allLeads.filter(l => l.status === 'lost').length;
        const active = allLeads.filter(l => !['won', 'lost'].includes(l.status || '')).length;

        const winRate = total > 0 ? Math.round((won / (won + lost)) * 100) : 0;

        // Pipeline by status
        const pipeline = [
            { status: 'new', label: 'New Lead', count: allLeads.filter(l => l.status === 'new').length, value: allLeads.filter(l => l.status === 'new').reduce((s, l) => s + Number(l.value || 0), 0) },
            { status: 'contacted', label: 'Contacted', count: allLeads.filter(l => l.status === 'contacted').length, value: allLeads.filter(l => l.status === 'contacted').reduce((s, l) => s + Number(l.value || 0), 0) },
            { status: 'qualified', label: 'Qualified', count: allLeads.filter(l => l.status === 'qualified').length, value: allLeads.filter(l => l.status === 'qualified').reduce((s, l) => s + Number(l.value || 0), 0) },
            { status: 'proposal', label: 'Proposal Sent', count: allLeads.filter(l => l.status === 'proposal').length, value: allLeads.filter(l => l.status === 'proposal').reduce((s, l) => s + Number(l.value || 0), 0) },
            { status: 'won', label: 'Won', count: won, value: allLeads.filter(l => l.status === 'won').reduce((s, l) => s + Number(l.value || 0), 0) },
            { status: 'lost', label: 'Lost', count: lost, value: allLeads.filter(l => l.status === 'lost').reduce((s, l) => s + Number(l.value || 0), 0) },
        ];

        // Monthly trend (last 6 months)
        const months: { [key: string]: { created: number; won: number } } = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            months[key] = { created: 0, won: 0 };
        }
        allLeads.forEach(l => {
            if (l.createdAt) {
                const d = new Date(l.createdAt);
                const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (months[key]) months[key].created++;
            }
            if (l.status === 'won' && l.updatedAt) {
                const d = new Date(l.updatedAt);
                const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (months[key]) months[key].won++;
            }
        });

        const monthlyTrend = Object.entries(months).map(([month, data]) => ({
            month,
            created: data.created,
            won: data.won,
        }));

        // By source breakdown
        const sourceMap: { [key: string]: number } = {};
        allLeads.forEach(l => {
            const src = l.source || 'unknown';
            sourceMap[src] = (sourceMap[src] || 0) + 1;
        });
        const bySource = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

        return {
            success: true,
            data: {
                total,
                active,
                won,
                lost,
                winRate,
                totalPipelineValue: allLeads.filter(l => l.status !== 'lost').reduce((s, l) => s + Number(l.value || 0), 0),
                pipeline,
                monthlyTrend,
                bySource,
            }
        };
    } catch {
        return { success: false, error: 'Failed to fetch analytics' };
    }
}

export async function getLeads() {
    try {
        await requireStaffOrAdmin();
        const assignedUser = db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
        }).from(users).as('assignedUser');

        const allLeads = await db
            .select({
                id: leads.id,
                firstName: leads.firstName,
                lastName: leads.lastName,
                email: leads.email,
                phone: leads.phone,
                company: leads.company,
                status: leads.status,
                source: leads.source,
                serviceInterest: leads.serviceInterest,
                priority: leads.priority,
                nextFollowUpAt: leads.nextFollowUpAt,
                lostReason: leads.lostReason,
                notes: leads.notes,
                assignedTo: leads.assignedTo,
                clientId: leads.clientId,
                projectId: leads.projectId,
                invoiceId: leads.invoiceId,
                value: leads.value,
                createdAt: leads.createdAt,
                updatedAt: leads.updatedAt,
                assignedToName: assignedUser.name,
                assignedToEmail: assignedUser.email,
                assignedToAvatar: assignedUser.avatarUrl,
            })
            .from(leads)
            .leftJoin(assignedUser, eq(leads.assignedTo, assignedUser.id))
            .orderBy(desc(leads.createdAt));

        return { success: true, data: allLeads };
    } catch (error) {
        console.error('Error fetching leads:', error);
        return { success: false, error: 'Failed to fetch leads' };
    }
}

export async function createLead(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireStaffOrAdmin();
    } catch {
        return authzError('Only team members can create leads manually');
    }

    const firstName = getOptionalString(formData, 'firstName');
    const lastName = getOptionalString(formData, 'lastName');
    const email = getOptionalString(formData, 'email');
    const company = getOptionalString(formData, 'company');
    const phone = getOptionalString(formData, 'phone');
    const status = getOptionalString(formData, 'status') || 'new';
    const source = getOptionalString(formData, 'source') || 'manual';
    const notes = getOptionalString(formData, 'notes');
    const value = getOptionalString(formData, 'value');
    const priority = getOptionalString(formData, 'priority') || 'medium';
    const serviceInterest = getOptionalString(formData, 'serviceInterest');
    const nextFollowUpAt = getFollowUpDate(formData);
    const assignedTo = getOptionalString(formData, 'assignedTo') || currentUser.id;

    try {
        const existingLead = email ? await findLeadByEmail(email) : undefined;
        if (existingLead) {
            await db.update(leads)
                .set({
                    firstName: firstName || existingLead.firstName,
                    lastName: lastName || existingLead.lastName,
                    phone: phone || existingLead.phone,
                    company: company || existingLead.company,
                    serviceInterest: serviceInterest || existingLead.serviceInterest,
                    priority,
                    nextFollowUpAt: nextFollowUpAt || existingLead.nextFollowUpAt,
                    assignedTo: assignedTo || existingLead.assignedTo,
                    updatedAt: new Date(),
                })
                .where(eq(leads.id, existingLead.id));

            await db.insert(interactions).values({
                leadId: existingLead.id,
                type: 'note',
                notes: `Manual lead entry matched this existing email.${notes ? `\n\n${notes}` : ''}`,
                createdBy: currentUser.id,
            });

            revalidatePath('/admin/crm');
            revalidatePath(`/admin/crm/${existingLead.id}`);
            return { success: true, id: existingLead.id, duplicate: true };
        }

        const [newLead] = await db.insert(leads).values({
            firstName: firstName || null,
            lastName: lastName || null,
            email: email || null,
            company,
            phone,
            status,
            source,
            notes,
            value,
            priority,
            serviceInterest,
            nextFollowUpAt,
            assignedTo,
        }).returning({ id: leads.id, assignedTo: leads.assignedTo });
        
        revalidatePath('/admin/crm');

        // Notify assigned person if set
        if (newLead.assignedTo) {
            await createNotification(
                newLead.assignedTo,
                'lead_assigned',
                'New Lead Assigned',
                `${formatLeadName({ firstName, lastName, company, email })} from ${company || 'Unknown Company'}`,
                `/admin/crm/${newLead.id}`
            );
        }

        return { success: true, id: newLead.id };
    } catch (error) {
        console.error('Error creating lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
}

export async function importLeadsFromCsv(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireStaffOrAdmin();
    } catch {
        return authzError('Only team members can import leads');
    }

    const csv = getOptionalString(formData, 'csv');
    const defaultSource = getOptionalString(formData, 'source') || 'csv_import';
    const defaultAssignedTo = getOptionalString(formData, 'assignedTo') || currentUser.id;

    if (!csv) return { success: false, error: 'CSV content is required' };

    const rows = parseCsv(csv);
    if (rows.length === 0) return { success: false, error: 'CSV must include a header row and at least one lead' };
    if (rows.length > 500) return { success: false, error: 'Import up to 500 leads at a time' };

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const [index, row] of rows.entries()) {
        const email = getCsvCell(row, ['email', 'email_address', 'work_email']);
        const fullName = getCsvCell(row, ['name', 'full_name', 'contact_name']);
        const firstName = getCsvCell(row, ['first_name', 'firstname']) || (fullName ? splitFullName(fullName).firstName : undefined);
        const lastName = getCsvCell(row, ['last_name', 'lastname']) || (fullName ? splitFullName(fullName).lastName : '');

        const company = getCsvCell(row, ['company', 'company_name', 'organization']);
        const phone = getCsvCell(row, ['phone', 'phone_number', 'mobile']);
        const status = getCsvCell(row, ['status', 'stage']) || 'new';
        const source = getCsvCell(row, ['source', 'lead_source']) || defaultSource;
        const priority = getCsvCell(row, ['priority']) || 'medium';
        const value = getCsvCell(row, ['value', 'deal_value', 'estimated_value', 'budget']);
        const serviceInterest = getCsvCell(row, ['service_interest', 'service', 'interest', 'package']);
        const notes = getCsvCell(row, ['notes', 'note', 'message']);
        const nextFollowUpRaw = getCsvCell(row, ['next_follow_up', 'next_follow_up_at', 'follow_up', 'followup']);
        const nextFollowUpAt = nextFollowUpRaw ? new Date(nextFollowUpRaw) : undefined;

        try {
            const existingLead = email ? await findLeadByEmail(email) : undefined;
            if (existingLead) {
                await db.update(leads)
                    .set({
                        firstName: firstName || existingLead.firstName,
                        lastName: lastName || existingLead.lastName,
                        phone: phone || existingLead.phone,
                        company: company || existingLead.company,
                        status: status || existingLead.status,
                        source,
                        priority,
                        value: value || existingLead.value,
                        serviceInterest: serviceInterest || existingLead.serviceInterest,
                        nextFollowUpAt: nextFollowUpAt && !Number.isNaN(nextFollowUpAt.getTime()) ? nextFollowUpAt : existingLead.nextFollowUpAt,
                        assignedTo: defaultAssignedTo || existingLead.assignedTo,
                        updatedAt: new Date(),
                    })
                    .where(eq(leads.id, existingLead.id));

                await db.insert(interactions).values({
                    leadId: existingLead.id,
                    type: 'note',
                    notes: `Lead updated from CSV import.${notes ? `\n\n${notes}` : ''}`,
                    createdBy: currentUser.id,
                });
                updated += 1;
                continue;
            }

            await db.insert(leads).values({
                firstName: firstName || null,
                lastName: lastName || null,
                email: email || null,
                company,
                phone,
                status,
                source,
                notes,
                value,
                priority,
                serviceInterest,
                nextFollowUpAt: nextFollowUpAt && !Number.isNaN(nextFollowUpAt.getTime()) ? nextFollowUpAt : undefined,
                assignedTo: defaultAssignedTo,
            });
            created += 1;
        } catch (error) {
            console.error('CSV lead import row error:', error);
            skipped += 1;
            errors.push(`Row ${index + 2}: failed to import`);
        }
    }

    revalidatePath('/admin/crm');
    return {
        success: true,
        created,
        updated,
        skipped,
        errors: errors.slice(0, 10),
    };
}

export async function createWebsiteLead(formData: FormData) {
    const fullName = getOptionalString(formData, 'name') || '';
    const { firstName, lastName } = splitFullName(fullName);
    const normalized = new FormData();

    normalized.set('firstName', firstName);
    normalized.set('lastName', lastName);
    normalized.set('email', getOptionalString(formData, 'email') || '');
    normalized.set('phone', getOptionalString(formData, 'phone') || '');
    normalized.set('company', getOptionalString(formData, 'company') || '');
    normalized.set('source', getOptionalString(formData, 'source') || 'website');
    normalized.set('serviceInterest', getOptionalString(formData, 'serviceInterest') || 'Website inquiry');
    normalized.set('priority', getOptionalString(formData, 'priority') || 'high');
    normalized.set('notes', formatQuoteNotes(formData));

    const email = getOptionalString(normalized, 'email');

    try {
        const existingLead = email ? await findLeadByEmail(email) : undefined;

        if (existingLead) {
            await db.update(leads)
                .set({
                    firstName: firstName || existingLead.firstName,
                    lastName: lastName || existingLead.lastName,
                    phone: getOptionalString(normalized, 'phone') || existingLead.phone,
                    company: getOptionalString(normalized, 'company') || existingLead.company,
                    source: getOptionalString(normalized, 'source') || existingLead.source,
                    serviceInterest: getOptionalString(normalized, 'serviceInterest') || existingLead.serviceInterest,
                    priority: getOptionalString(normalized, 'priority') || existingLead.priority,
                    status: existingLead.status === 'lost' ? 'new' : existingLead.status,
                    updatedAt: new Date(),
                })
                .where(eq(leads.id, existingLead.id));

            await db.insert(interactions).values({
                leadId: existingLead.id,
                type: 'note',
                notes: `New website submission received.\n\n${getOptionalString(normalized, 'notes') || 'No message provided.'}`,
            });

            revalidatePath('/admin/crm');
            revalidatePath(`/admin/crm/${existingLead.id}`);
            await notifyAdmins(
                'Website Lead Updated',
                `${formatLeadName({ firstName, lastName, email })} submitted another website inquiry`,
                `/admin/crm/${existingLead.id}`
            );
            return { success: true, id: existingLead.id, duplicate: true };
        }

        const [newLead] = await db.insert(leads).values({
            firstName: firstName || null,
            lastName: lastName || null,
            email: email || null,
            phone: getOptionalString(normalized, 'phone'),
            company: getOptionalString(normalized, 'company'),
            source: getOptionalString(normalized, 'source') || 'website',
            serviceInterest: getOptionalString(normalized, 'serviceInterest') || 'Website inquiry',
            priority: getOptionalString(normalized, 'priority') || 'high',
            notes: getOptionalString(normalized, 'notes'),
            status: 'new',
        }).returning({ id: leads.id });

        revalidatePath('/admin/crm');
        await notifyAdmins(
            'New Website Lead',
            `${formatLeadName({ firstName, lastName, email })} submitted a website inquiry`,
            `/admin/crm/${newLead.id}`
        );
        return { success: true, id: newLead.id };
    } catch (error) {
        console.error('Error creating website lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
}

export async function getLead(id: string) {
    try {
        await requireStaffOrAdmin();
        const assignedUser = db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
        }).from(users).as('assignedUser');

        const lead = await db.select({
            id: leads.id,
            firstName: leads.firstName,
            lastName: leads.lastName,
            email: leads.email,
            phone: leads.phone,
            company: leads.company,
            status: leads.status,
            source: leads.source,
            serviceInterest: leads.serviceInterest,
            priority: leads.priority,
            nextFollowUpAt: leads.nextFollowUpAt,
            lostReason: leads.lostReason,
            notes: leads.notes,
            assignedTo: leads.assignedTo,
            clientId: leads.clientId,
            projectId: leads.projectId,
            invoiceId: leads.invoiceId,
            value: leads.value,
            createdAt: leads.createdAt,
            updatedAt: leads.updatedAt,
            assignedToName: assignedUser.name,
            assignedToEmail: assignedUser.email,
            assignedToAvatar: assignedUser.avatarUrl,
        }).from(leads)
            .leftJoin(assignedUser, eq(leads.assignedTo, assignedUser.id))
            .where(eq(leads.id, id))
            .limit(1);
        if (lead.length === 0) return { success: false, error: 'Lead not found' };
        return { success: true, data: lead[0] };
    } catch {
        return { success: false, error: 'Failed to fetch lead' };
    }
}

export async function updateLeadStatus(id: string, newStatus: string) {
    try {
        await requireStaffOrAdmin();
        // Get lead info before updating
        const [lead] = await db.select()
            .from(leads)
            .where(eq(leads.id, id))
            .limit(1);

        await db.update(leads)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(leads.id, id));
        revalidatePath('/admin/crm');

        // Notify assigned person of status change
        if (lead?.assignedTo) {
            await createNotification(
                lead.assignedTo,
                'lead_status_changed',
                'Lead Status Updated',
                `${formatLeadName(lead)} is now ${newStatus}`,
                `/admin/crm/${id}`
            );
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateLead(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireStaffOrAdmin();
    } catch {
        return authzError('Only team members can update leads');
    }

    const id = getOptionalString(formData, 'id');
    if (!id) return { success: false, error: 'Lead id is required' };

    try {
        await db.update(leads)
            .set({
                firstName: getOptionalString(formData, 'firstName'),
                lastName: getOptionalString(formData, 'lastName') || null,
                email: getOptionalString(formData, 'email') || null,
                phone: getOptionalString(formData, 'phone'),
                company: getOptionalString(formData, 'company'),
                status: getOptionalString(formData, 'status') || 'new',
                source: getOptionalString(formData, 'source'),
                serviceInterest: getOptionalString(formData, 'serviceInterest'),
                priority: getOptionalString(formData, 'priority') || 'medium',
                value: getOptionalString(formData, 'value'),
                nextFollowUpAt: getFollowUpDate(formData) || null,
                lostReason: getOptionalString(formData, 'lostReason'),
                notes: getOptionalString(formData, 'notes'),
                assignedTo: getOptionalString(formData, 'assignedTo') || null,
                updatedAt: new Date(),
            })
            .where(eq(leads.id, id));

        await db.insert(interactions).values({
            leadId: id,
            type: 'note',
            notes: `Lead profile updated by ${currentUser.name || currentUser.email}.`,
            createdBy: currentUser.id,
        });

        revalidatePath('/admin/crm');
        revalidatePath(`/admin/crm/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating lead:', error);
        return { success: false, error: 'Failed to update lead' };
    }
}

export async function addInteraction(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireStaffOrAdmin();
    } catch {
        return authzError('Only team members can log lead activity');
    }

    const leadId = formData.get('leadId') as string;
    const type = formData.get('type') as string;
    const notes = formData.get('notes') as string;

    try {
        await db.insert(interactions).values({
            leadId,
            type,
            notes,
            createdBy: currentUser.id,
        });
        revalidatePath(`/admin/crm/${leadId}`);
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to log interaction' };
    }
}

export async function getInteractions(leadId: string) {
    try {
        await requireStaffOrAdmin();
        const data = await db.select().from(interactions).where(eq(interactions.leadId, leadId)).orderBy(desc(interactions.createdAt));
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to fetch interactions' };
    }
}

export async function getCrmStaff() {
    try {
        await requireStaffOrAdmin();
        const staff = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            avatarUrl: users.avatarUrl,
        })
            .from(users)
            .where(or(eq(users.role, 'admin'), eq(users.role, 'staff')))
            .orderBy(desc(users.createdAt));

        return { success: true, data: staff };
    } catch {
        return { success: false, error: 'Failed to fetch staff' };
    }
}

export async function convertLeadToClient(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireStaffOrAdmin();
    } catch {
        return authzError('Only team members can convert leads');
    }

    const leadId = getOptionalString(formData, 'leadId');
    if (!leadId) return { success: false, error: 'Lead id is required' };

    try {
         const result = await ensureClientFromLead(leadId);
         if (!result.success) return result;

          await db.update(leads)
            .set({
                clientId: result.clientId,
                status: result.lead.status === 'new' ? 'qualified' : result.lead.status,
                updatedAt: new Date(),
            })
            .where(eq(leads.id, leadId));

        await addConversionActivity(
            leadId,
            currentUser.id,
            `${result.created ? 'Created' : 'Linked'} client profile for ${formatLeadName(result.lead)}.`
        );

        revalidatePath('/admin/crm');
        revalidatePath(`/admin/crm/${leadId}`);
        revalidatePath('/admin/users');
        return { success: true, clientId: result.clientId, created: result.created };
    } catch (error) {
        console.error('convertLeadToClient error:', error);
        return { success: false, error: 'Failed to convert lead to client' };
    }
}

export async function createProjectFromLead(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireStaffOrAdmin();
    } catch {
        return authzError('Only team members can create projects from leads');
    }

    const leadId = getOptionalString(formData, 'leadId');
    if (!leadId) return { success: false, error: 'Lead id is required' };

    try {
         const result = await ensureClientFromLead(leadId);
         if (!result.success) return result;
          if (result.lead.projectId) {
              return { success: true, projectId: result.lead.projectId, clientId: result.clientId, existing: true };
          }

        const title = getOptionalString(formData, 'title')
            || `${formatLeadName(result.lead)} - ${result.lead.serviceInterest || 'Client Project'}`;
        const budget = getOptionalString(formData, 'budget') || result.lead.value || undefined;
        const dueDate = getOptionalString(formData, 'dueDate');
        const managerId = getOptionalString(formData, 'managerId') || result.lead.assignedTo || currentUser.id;

        const [project] = await db.insert(internalProjects).values({
            title,
            clientId: result.clientId,
            managerId,
            type: 'client',
            status: 'planning',
            budget,
            dueDate: dueDate ? new Date(dueDate) : null,
            description: [
                `Created from CRM lead: ${formatLeadName(result.lead)}`,
                result.lead.serviceInterest ? `Service interest: ${result.lead.serviceInterest}` : null,
                result.lead.notes ? `Lead notes:\n${result.lead.notes}` : null,
            ].filter(Boolean).join('\n\n'),
        }).returning({ id: internalProjects.id });

        await db.update(leads)
            .set({
                clientId: result.clientId,
                projectId: project.id,
                status: result.lead.status === 'won' ? 'won' : 'qualified',
                updatedAt: new Date(),
            })
            .where(eq(leads.id, leadId));

        await addConversionActivity(
            leadId,
            currentUser.id,
            `Project created from lead: ${title}\n/admin/projects/${project.id}`
        );

        if (managerId) {
            await createNotification(
                managerId,
                'project_created',
                'Project Created From Lead',
                title,
                `/admin/projects/${project.id}`
            );
        }

        await createNotification(
            result.clientId,
            'project_assigned',
            'Project Created',
            `Your project "${title}" has been created.`,
            `/client/projects/${project.id}`
        );

        revalidatePath('/admin/crm');
        revalidatePath(`/admin/crm/${leadId}`);
        revalidatePath('/admin/projects');
        revalidatePath(`/admin/projects/${project.id}`);
        revalidatePath('/client');
        return { success: true, projectId: project.id, clientId: result.clientId };
    } catch (error) {
        console.error('createProjectFromLead error:', error);
        return { success: false, error: 'Failed to create project from lead' };
    }
}

export async function createInvoiceFromLead(formData: FormData) {
    let currentUser;
    try {
        currentUser = await requireAdmin();
    } catch {
        return authzError('Only admins can create invoices from leads');
    }

    const leadId = getOptionalString(formData, 'leadId');
    if (!leadId) return { success: false, error: 'Lead id is required' };

    try {
         const result = await ensureClientFromLead(leadId);
         if (!result.success) return result;
         if (result.lead.invoiceId) {
             return { success: true, invoiceId: result.lead.invoiceId, clientId: result.clientId, existing: true };
         }

          const amount = getOptionalString(formData, 'amount') || result.lead.value || '0';
        const currency = getOptionalString(formData, 'currency') || 'USD';
        const dueDateValue = getOptionalString(formData, 'dueDate');
        const dueDate = dueDateValue ? new Date(dueDateValue) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const itemTitle = getOptionalString(formData, 'itemTitle') || result.lead.serviceInterest || 'Professional Services';
        const invoiceNumber = await nextInvoiceNumber();

        const [invoice] = await db.insert(invoices).values({
            invoiceNumber,
            clientId: result.clientId,
            status: 'draft',
            totalAmount: amount,
            currency,
            dueDate,
            notes: [
                `Created from CRM lead: ${formatLeadName(result.lead)}`,
                result.lead.company ? `Company: ${result.lead.company}` : null,
                result.lead.notes || null,
            ].filter(Boolean).join('\n\n'),
        }).returning({ id: invoices.id });

        await db.insert(invoiceItems).values({
            invoiceId: invoice.id,
            title: itemTitle,
            description: `Converted from CRM lead ${formatLeadName(result.lead)}`,
            quantity: '1',
            unitPrice: amount,
            amount,
        });

        await db.update(leads)
            .set({
                clientId: result.clientId,
                invoiceId: invoice.id,
                status: result.lead.status === 'new' ? 'proposal' : result.lead.status,
                updatedAt: new Date(),
            })
            .where(eq(leads.id, leadId));

        await addConversionActivity(
            leadId,
            currentUser.id,
            `Draft invoice ${invoiceNumber} created for ${currency} ${Number(amount || 0).toLocaleString()}.\n/admin/finance/invoice/${invoice.id}`
        );

        await createNotification(
            result.clientId,
            'invoice_created',
            'Invoice Draft Prepared',
            `Invoice ${invoiceNumber} has been prepared for ${currency} ${Number(amount || 0).toLocaleString()}.`,
            `/admin/finance/invoice/${invoice.id}`
        );

        revalidatePath('/admin/crm');
        revalidatePath(`/admin/crm/${leadId}`);
        revalidatePath('/admin/finance');
        revalidatePath(`/admin/finance/invoice/${invoice.id}`);
        return { success: true, invoiceId: invoice.id, clientId: result.clientId };
    } catch (error) {
        console.error('createInvoiceFromLead error:', error);
        return { success: false, error: 'Failed to create invoice from lead' };
    }
}


