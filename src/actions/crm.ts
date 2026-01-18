'use server'

import { db } from '@/lib/db';
import { leads, interactions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const status = formData.get('status') as string || 'new';

    const value = formData.get('value') as string;

    if (!email) return { success: false, error: 'Email is required' };

    try {
        await db.insert(leads).values({
            firstName,
            lastName,
            email,
            company,
            status,
            value
        });
        revalidatePath('/admin/crm');
        return { success: true };
    } catch (error) {
        console.error('Error creating lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
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
        await db.update(leads)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(leads.id, id));
        revalidatePath('/admin/crm');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
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


