'use server'

import { db } from '@/lib/db';
import { leads, tasks } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

function getOptionalString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed || undefined;
}

export async function submitBooking(formData: FormData) {
    const name = getOptionalString(formData, 'name') || '';
    const email = getOptionalString(formData, 'email') || '';
    const date = getOptionalString(formData, 'date') || '';
    const time = getOptionalString(formData, 'time') || '';
    const notes = getOptionalString(formData, 'notes') || '';

    if (!name || !email || !date || !time) {
        return { success: false, error: 'Missing required fields' };
    }

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || 'New';
    const lastName = parts.slice(1).join(' ') || 'Lead';

    const appointmentDate = new Date(`${date}T${time}:00`);

    try {
        // 1. Create a lead
        const [newLead] = await db.insert(leads).values({
            firstName,
            lastName,
            email,
            source: 'website_booking',
            serviceInterest: 'Strategy call',
            priority: 'high',
            notes: `Booking requested: ${date} at ${time}\n\n${notes}`,
            nextFollowUpAt: appointmentDate,
        }).returning({ id: leads.id });

        // 2. Create a task for the admin calendar
        await db.insert(tasks).values({
            title: `Strategy call — ${name}`,
            description: `Booking from ${name} (${email}) on ${date} at ${time}\n\n${notes}`,
            status: 'todo',
            priority: 'high',
            dueDate: appointmentDate,
        });

        // 3. Notify admins
        try {
            const { users } = await import('@/lib/db/schema');
            const { eq } = await import('drizzle-orm');
            const admins = await db.select({ id: users.id })
                .from(users)
                .where(eq(users.role, 'admin'))
                .limit(5);

            for (const admin of admins) {
                await createNotification(
                    admin.id,
                    'lead_created',
                    'New Strategy Call Booking',
                    `${name} booked a strategy call on ${date} at ${time}`,
                    `/admin/crm/${newLead.id}`
                );
            }
        } catch (notifError) {
            console.error('Failed to send admin notifications:', notifError);
        }

        revalidatePath('/admin/calendar');
        revalidatePath('/admin/crm');
        revalidatePath('/admin');

        return { success: true };
    } catch (error) {
        console.error('Booking error:', error);
        return { success: false, error: 'Failed to submit booking. Please try again.' };
    }
}
