'use server'

import { db } from '@/lib/db';
import { campaigns, sequences, sequenceSteps, automations, sequenceEnrollments, users, leads } from '@/lib/db/schema';
import { eq, desc, and, or, lte, isNotNull } from 'drizzle-orm';
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

/**
 * Send a campaign email to all recipients based on audience
 */
export async function sendCampaign(campaignId: string) {
    try {
        // 1. Get campaign details
        const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
        if (!campaign) return { success: false, error: 'Campaign not found' };
        if (campaign.status === 'sent') return { success: false, error: 'Campaign already sent' };

        // 2. Get recipients based on audience
        let recipients: { email: string; name: string }[] = [];
        
        if (campaign.audience === 'leads' || campaign.audience === 'all') {
            const leadList = await db.select({ email: leads.email, name: leads.firstName }).from(leads);
            recipients.push(...leadList.map(l => ({ email: l.email, name: l.name })));
        }
        
        if (campaign.audience === 'clients' || campaign.audience === 'all') {
            const clientList = await db.select({ email: users.email, name: users.name })
                .from(users)
                .where(eq(users.role, 'user'));
            recipients.push(...clientList.map(c => ({ email: c.email, name: c.name || 'Valued Client' })));
        }
        
        if (campaign.audience === 'staff' || campaign.audience === 'all') {
            const staffList = await db.select({ email: users.email, name: users.name })
                .from(users)
                .where(or(eq(users.role, 'admin'), eq(users.role, 'staff')));
            recipients.push(...staffList.map(s => ({ email: s.email, name: s.name || 'Team Member' })));
        }

        // Remove duplicates by email
        const uniqueRecipients = Array.from(new Map(recipients.map(r => [r.email, r])).values());

        if (uniqueRecipients.length === 0) {
            return { success: false, error: 'No recipients found for this audience' };
        }

        // 3. Send emails via Resend (batch or individual)
        let successCount = 0;
        let failCount = 0;

        for (const recipient of uniqueRecipients) {
            try {
                await resend.emails.send({
                    from: process.env.FROM_EMAIL!,
                    to: recipient.email,
                    subject: campaign.subject,
                    html: generateEmailTemplate(recipient.name, campaign.content),
                });
                successCount++;
            } catch (emailError) {
                console.error(`Failed to send to ${recipient.email}:`, emailError);
                failCount++;
            }
        }

        // 4. Update campaign status
        await db.update(campaigns)
            .set({
                status: 'sent',
                sentAt: new Date(),
                recipientCount: successCount.toString(),
                updatedAt: new Date(),
            })
            .where(eq(campaigns.id, campaignId));

        revalidatePath('/admin/marketing');
        return { 
            success: true, 
            sent: successCount, 
            failed: failCount,
            message: `Campaign sent to ${successCount} recipients${failCount > 0 ? `, ${failCount} failed` : ''}`
        };

    } catch (error: any) {
        console.error('sendCampaign error:', error);
        return { success: false, error: 'Failed to send campaign: ' + error.message };
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

/**
 * Process a single sequence enrollment - sends the current step email
 */
export async function processSequenceStep(enrollmentId: string) {
    try {
        // 1. Get enrollment with sequence info
        const [enrollment] = await db.select().from(sequenceEnrollments).where(eq(sequenceEnrollments.id, enrollmentId)).limit(1);
        if (!enrollment) return { success: false, error: 'Enrollment not found' };
        if (enrollment.status !== 'active') return { success: false, error: 'Enrollment not active' };

        // 2. Get current step
        const [step] = await db.select().from(sequenceSteps)
            .where(and(
                eq(sequenceSteps.sequenceId, enrollment.sequenceId),
                eq(sequenceSteps.order, enrollment.currentStep || 1)
            ))
            .limit(1);

        if (!step) {
            // No more steps, mark as completed
            await db.update(sequenceEnrollments)
                .set({ status: 'completed', completedAt: new Date() })
                .where(eq(sequenceEnrollments.id, enrollmentId));
            return { success: true, message: 'Sequence completed' };
        }

        // 3. Get recipient email
        let recipientEmail: string | null = null;
        let recipientName: string = 'there';

        if (enrollment.userId) {
            const [user] = await db.select().from(users).where(eq(users.id, enrollment.userId)).limit(1);
            recipientEmail = user?.email || null;
            recipientName = user?.name || 'there';
        } else if (enrollment.leadId) {
            const [lead] = await db.select().from(leads).where(eq(leads.id, enrollment.leadId)).limit(1);
            recipientEmail = lead?.email || null;
            recipientName = lead?.firstName || 'there';
        }

        if (!recipientEmail) {
            return { success: false, error: 'No recipient email found' };
        }

        // 4. Send email
        await resend.emails.send({
            from: process.env.FROM_EMAIL!,
            to: recipientEmail,
            subject: step.subject,
            html: generateEmailTemplate(recipientName, step.content),
        });

        // 5. Update enrollment - move to next step
        const nextStepOrder = (enrollment.currentStep || 1) + 1;
        const [nextStep] = await db.select().from(sequenceSteps)
            .where(and(
                eq(sequenceSteps.sequenceId, enrollment.sequenceId),
                eq(sequenceSteps.order, nextStepOrder)
            ))
            .limit(1);

        if (nextStep) {
            // Schedule next step
            const nextRunDate = new Date();
            nextRunDate.setDate(nextRunDate.getDate() + (nextStep.delayDays || 1));
            
            await db.update(sequenceEnrollments)
                .set({ currentStep: nextStepOrder, nextRunAt: nextRunDate })
                .where(eq(sequenceEnrollments.id, enrollmentId));
        } else {
            // Sequence complete
            await db.update(sequenceEnrollments)
                .set({ status: 'completed', completedAt: new Date() })
                .where(eq(sequenceEnrollments.id, enrollmentId));
        }

        return { success: true, message: `Step ${enrollment.currentStep} sent successfully` };

    } catch (error: any) {
        console.error('processSequenceStep error:', error);
        return { success: false, error: 'Failed to process step: ' + error.message };
    }
}

/**
 * Process all due sequence enrollments - call this from a cron job
 */
export async function processDueSequences() {
    try {
        const now = new Date();
        const dueEnrollments = await db.select()
            .from(sequenceEnrollments)
            .where(and(
                eq(sequenceEnrollments.status, 'active'),
                lte(sequenceEnrollments.nextRunAt, now)
            ));

        let processed = 0;
        let failed = 0;

        for (const enrollment of dueEnrollments) {
            const result = await processSequenceStep(enrollment.id);
            if (result.success) {
                processed++;
            } else {
                failed++;
            }
        }

        return { success: true, processed, failed };
    } catch (error: any) {
        console.error('processDueSequences error:', error);
        return { success: false, error: error.message };
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
        // Get first step delay
        const [firstStep] = await db.select().from(sequenceSteps)
            .where(eq(sequenceSteps.sequenceId, sequenceId))
            .orderBy(sequenceSteps.order)
            .limit(1);

        const nextRunDate = new Date();
        if (firstStep?.delayDays) {
            nextRunDate.setDate(nextRunDate.getDate() + firstStep.delayDays);
        }

        await db.insert(sequenceEnrollments).values({
            sequenceId,
            leadId,
            userId,
            status: 'active',
            currentStep: 1,
            nextRunAt: nextRunDate,
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to enroll in sequence' };
    }
}

// --- Email Template Helper ---

function generateEmailTemplate(recipientName: string, content: string): string {
    // If content is already a full HTML document, return it as-is (with name substitution)
    const trimmedContent = content.trim();
    if (trimmedContent.startsWith('<!DOCTYPE') || trimmedContent.startsWith('<html') || trimmedContent.startsWith('<HTML')) {
        // Replace common placeholders in raw HTML
        return content
            .replace(/\{\{name\}\}/gi, recipientName)
            .replace(/\{\{NAME\}\}/gi, recipientName)
            .replace(/\{name\}/gi, recipientName);
    }

    // Otherwise, wrap in our branded template
    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Bold Ideas</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f9fc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 0 40px; text-align: left;">
                             <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #002D5B; letter-spacing: -0.5px; text-transform: uppercase;">
                                Bold Ideas<span style="color: #D4AF37;">.</span>
                             </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; color: #334155;">
                                Hi ${recipientName},
                            </p>
                            <div style="font-size: 16px; line-height: 1.6; color: #334155;">
                                ${content.replace(/\n/g, '<br/>')}
                            </div>
                            <p style="margin: 32px 0 0 0; font-size: 16px; color: #334155; font-weight: 600;">
                                Best regards,<br/>
                                <span style="color: #002D5B;">The Bold Ideas Team</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                &copy; ${new Date().getFullYear()} Bold Ideas Innovation. All rights reserved.<br/>
                                <a href="https://getboldideas.com" style="color: #002D5B; text-decoration: none; font-weight: 600;">getboldideas.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}
