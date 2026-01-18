'use server'

import { db } from '@/lib/db';
import { campaigns, sequences, sequenceSteps, automations, sequenceEnrollments, users, leads } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { resend } from '@/lib/resend';

// --- Campaigns ---

export async function getCampaigns() {
    try {
        const data = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
        return { success: true, data };
    } catch (error) {
        console.error('getCampaigns error:', error);
        return { success: false, error: 'Failed to fetch campaigns' };
    }
}

export async function createCampaign(formData: FormData) {
    const subject = formData.get('subject') as string;
    const content = formData.get('content') as string;
    const audience = formData.get('audience') as string || 'all';
    const scheduledAt = formData.get('scheduledAt') as string;

    try {
        await db.insert(campaigns).values({
            subject,
            content,
            audience,
            status: scheduledAt ? 'scheduled' : 'draft',
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        });
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        console.error('createCampaign error:', error);
        return { success: false, error: 'Failed to create campaign' };
    }
}

export async function deleteCampaign(campaignId: string) {
    try {
        await db.delete(campaigns).where(eq(campaigns.id, campaignId));
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete campaign' };
    }
}

// --- Sequences ---

export async function getSequences() {
    try {
        const data = await db.select().from(sequences).orderBy(desc(sequences.createdAt));
        // Fetch steps for each sequence
        const sequencesWithSteps = await Promise.all(data.map(async (seq) => {
            const steps = await db.select().from(sequenceSteps)
                .where(eq(sequenceSteps.sequenceId, seq.id))
                .orderBy(sequenceSteps.order);
            return { ...seq, steps };
        }));
        return { success: true, data: sequencesWithSteps };
    } catch (error) {
        return { success: false, error: 'Failed to fetch sequences' };
    }
}

export async function createSequence(name: string, description: string, steps: any[]) {
    try {
        const [newSequence] = await db.insert(sequences).values({
            name,
            description,
        }).returning({ id: sequences.id });

        if (steps && steps.length > 0) {
            await db.insert(sequenceSteps).values(
                steps.map((step, index) => ({
                    sequenceId: newSequence.id,
                    subject: step.subject,
                    content: step.content,
                    delayDays: step.delayDays || 0,
                    order: index + 1,
                }))
            );
        }

        revalidatePath('/admin/marketing');
        return { success: true, sequenceId: newSequence.id };
    } catch (error) {
        console.error('createSequence error:', error);
        return { success: false, error: 'Failed to create sequence' };
    }
}

// --- Automations ---

export async function getAutomations() {
    try {
        const data = await db.select().from(automations).orderBy(desc(automations.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch automations' };
    }
}

export async function createAutomation(formData: FormData) {
    const name = formData.get('name') as string;
    const triggerType = formData.get('triggerType') as string;
    const triggerValue = formData.get('triggerValue') as string;
    const actionType = formData.get('actionType') as string;
    const actionValue = formData.get('actionValue') as string;

    try {
        await db.insert(automations).values({
            name,
            triggerType,
            triggerValue,
            actionType,
            actionValue,
        });
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create automation' };
    }
}

// --- Enrollments ---

export async function enrollInSequence(sequenceId: string, leadId?: string, userId?: string) {
    try {
        // Simple log for now
        await db.insert(sequenceEnrollments).values({
            sequenceId,
            leadId,
            userId,
            status: 'active',
            currentStep: 1,
            nextRunAt: new Date(), // Run immediately or after delay? For Day 0, immediately.
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to enroll in sequence' };
    }
}
