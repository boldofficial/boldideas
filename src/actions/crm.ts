'use server'

import { db } from '@/lib/db';
import { leads, interactions, users } from '@/lib/db/schema';
import { eq, desc, and, gte, lte, or, sql, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

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

function splitFullName(name: string) {
    const parts = name.trim().split(/\s+/);
    return {
        firstName: parts[0] || 'New',
        lastName: parts.slice(1).join(' ') || 'Lead',
    };
}

export async function bulkUpdateLeads(ids: string[], updates: { status?: string; assignedTo?: string | null; priority?: string }) {
    try {
        const updateData: Record<string, any> = { updatedAt: new Date() };
        if (updates.status) updateData.status = updates.status;
        if (updates.priority) updateData.priority = updates.priority;
        if (updates.assignedTo !== undefined) updateData.assignedTo = updates.assignedTo || null;

        await db.update(leads)
            .set(updateData)
            .where(inArray(leads.id, ids));

        revalidatePath('/admin/crm');
        return { success: true, count: ids.length };
    } catch (error) {
        return { success: false, error: 'Failed to bulk update leads' };
    }
}

export async function bulkDeleteLeads(ids: string[]) {
    try {
        await db.delete(leads).where(inArray(leads.id, ids));
        revalidatePath('/admin/crm');
        return { success: true, count: ids.length };
    } catch (error) {
        return { success: false, error: 'Failed to delete leads' };
    }
}

export async function getAnalyticsData() {
    try {
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
    } catch (error) {
        return { success: false, error: 'Failed to fetch analytics' };
    }
}

export async function getLeads() {
    try {
        const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
        return { success: true, data: allLeads };
    } catch (error) {
        console.error('Error fetching leads:', error);
        return { success: false, error: 'Failed to fetch leads' };
    }
}

export async function createLead(formData: FormData) {
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

    if (!email) return { success: false, error: 'Email is required' };
    if (!firstName) return { success: false, error: 'First name is required' };

    try {
        const [newLead] = await db.insert(leads).values({
            firstName,
            lastName: lastName || '',
            email,
            company,
            phone,
            status,
            source,
            notes,
            value,
            priority,
            serviceInterest,
            nextFollowUpAt,
        }).returning({ id: leads.id, assignedTo: leads.assignedTo });
        
        revalidatePath('/admin/crm');

        // Notify assigned person if set
        if (newLead.assignedTo) {
            await createNotification(
                newLead.assignedTo,
                'lead_assigned',
                'New Lead Assigned',
                `${firstName} ${lastName} from ${company || 'Unknown Company'}`,
                `/admin/crm/${newLead.id}`
            );
        }

        return { success: true };
    } catch (error) {
        console.error('Error creating lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
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
    normalized.set('notes', getOptionalString(formData, 'message') || getOptionalString(formData, 'notes') || '');

    return createLead(normalized);
}

export async function getLead(id: string) {
    try {
        const lead = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
        if (lead.length === 0) return { success: false, error: 'Lead not found' };
        return { success: true, data: lead[0] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch lead' };
    }
}

export async function updateLeadStatus(id: string, newStatus: string) {
    try {
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
                `${lead.firstName} ${lead.lastName} is now ${newStatus}`,
                `/admin/crm/${id}`
            );
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateLead(formData: FormData) {
    const id = getOptionalString(formData, 'id');
    if (!id) return { success: false, error: 'Lead id is required' };

    try {
        await db.update(leads)
            .set({
                firstName: getOptionalString(formData, 'firstName'),
                lastName: getOptionalString(formData, 'lastName') || '',
                email: getOptionalString(formData, 'email'),
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
                updatedAt: new Date(),
            })
            .where(eq(leads.id, id));

        revalidatePath('/admin/crm');
        revalidatePath(`/admin/crm/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating lead:', error);
        return { success: false, error: 'Failed to update lead' };
    }
}

export async function addInteraction(formData: FormData) {
    const leadId = formData.get('leadId') as string;
    const type = formData.get('type') as string;
    const notes = formData.get('notes') as string;

    try {
        await db.insert(interactions).values({
            leadId,
            type,
            notes,
        });
        revalidatePath(`/admin/crm/${leadId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to log interaction' };
    }
}

export async function getInteractions(leadId: string) {
    try {
        const data = await db.select().from(interactions).where(eq(interactions.leadId, leadId)).orderBy(desc(interactions.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch interactions' };
    }
}


