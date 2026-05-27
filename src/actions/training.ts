'use server';

import { db } from '@/lib/db';
import { trainingRegistrations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number required'),
  location: z.string().min(2, 'Location required'),
  mode: z.enum(['virtual', 'physical']),
  experienceLevel: z.enum(['beginner', 'intermediate']),
  goal: z.string().max(1000).optional(),
});

export async function submitTrainingRegistration(formData: FormData) {
  const raw = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    location: formData.get('location') as string,
    mode: formData.get('mode') as string,
    experienceLevel: formData.get('experienceLevel') as string,
    goal: formData.get('goal') as string,
  };

  const result = registrationSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await db
    .select()
    .from(trainingRegistrations)
    .where(eq(trainingRegistrations.email, result.data.email))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      errors: {
        email: ['This email is already registered. DM us on WhatsApp if you need help.'],
      },
    };
  }

  await db.insert(trainingRegistrations).values(result.data);
  revalidatePath('/admin/training');

  return { success: true };
}

export async function getTrainingRegistrations(filters?: {
  search?: string;
  status?: string;
  mode?: string;
}) {
  const query = db.select().from(trainingRegistrations);

  if (filters?.search) {
    const search = `%${filters.search}%`;
    return await query.where(
      eq(trainingRegistrations.email, search)
    ).orderBy(trainingRegistrations.createdAt);
  }

  return await query.orderBy(trainingRegistrations.createdAt);
}

export async function updateRegistrationStatus(
  id: string,
  status: string,
  adminNotes?: string
) {
  await db
    .update(trainingRegistrations)
    .set({
      status,
      adminNotes,
      updatedAt: new Date(),
    })
    .where(eq(trainingRegistrations.id, id));
  revalidatePath('/admin/training');
  return { success: true };
}

export async function deleteRegistration(id: string) {
  await db
    .delete(trainingRegistrations)
    .where(eq(trainingRegistrations.id, id));
  revalidatePath('/admin/training');
  return { success: true };
}
