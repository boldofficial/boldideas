'use server';

import { db } from '@/lib/db';
import { tickets, ticketAttachments, ticketComments, cannedResponses, ticketActivity, users, internalProjects } from '@/lib/db/schema';
import { eq, desc, and, or, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Types
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'awaiting_reply' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
export type TicketDepartment = 'general' | 'billing' | 'technical' | 'sales';

export interface CreateTicketData {
  subject: string;
  description: string;
  priority?: TicketPriority;
  department?: TicketDepartment;
  projectId?: string | null;
}

export interface TicketWithDetails {
  id: string;
  subject: string;
  description: string;
  priority: string | null;
  status: string | null;
  projectId: string | null;
  projectTitle: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  clientId: string;
  clientName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * Create a new ticket with optional file attachment
 */
export async function createTicket(clientId: string, data: CreateTicketData, file?: File) {
  try {
    const [newTicket] = await db.insert(tickets).values({
      clientId,
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'medium',
      department: data.department || 'general',
      projectId: data.projectId || null,
    }).returning();

    // Handle file upload if present
    if (file && file.size > 0) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `ticket-${newTicket.id}-${Date.now()}.${fileExt}`;
        const filePath = `tickets/${newTicket.id}/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure bucket exists
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        if (!buckets?.find(b => b.name === 'ticket-files')) {
          await supabaseAdmin.storage.createBucket('ticket-files', { public: true });
        }

        const { error: uploadError } = await supabaseAdmin.storage
          .from('ticket-files')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('ticket-files')
            .getPublicUrl(filePath);

          // Add attachment record
          await db.insert(ticketAttachments).values({
            ticketId: newTicket.id,
            name: file.name,
            url: publicUrl,
            sizeBytes: file.size,
            uploadedBy: clientId,
          });
        } else {
          console.error('Ticket file upload error:', uploadError);
        }
      } catch (uploadErr) {
        console.error('File processing error:', uploadErr);
      }
    }

    // Notify admins about new ticket
    const admins = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'admin'));

    for (const admin of admins) {
      await createNotification(
        admin.id,
        'ticket_created',
        `New Support Ticket: ${data.subject}`,
        data.description.substring(0, 100),
        `/admin/tickets/${newTicket.id}`
      );
    }

    revalidatePath('/client/tickets');
    revalidatePath('/admin/tickets');

    return { success: true, data: newTicket };
  } catch (error) {
    console.error('createTicket error:', error);
    return { success: false, error: 'Failed to create ticket' };
  }
}

/**
 * Get all tickets for a client
 */
export async function getClientTickets(clientId: string, projectId?: string) {
  try {
    const conditions = [eq(tickets.clientId, clientId)];
    
    if (projectId) {
      conditions.push(eq(tickets.projectId, projectId));
    }

    const ticketList = await db
      .select({
        id: tickets.id,
        subject: tickets.subject,
        description: tickets.description,
        priority: tickets.priority,
        status: tickets.status,
        projectId: tickets.projectId,
        projectTitle: internalProjects.title,
        assignedToId: tickets.assignedTo,
        assignedToName: users.name,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
      })
      .from(tickets)
      .leftJoin(internalProjects, eq(tickets.projectId, internalProjects.id))
      .leftJoin(users, eq(tickets.assignedTo, users.id))
      .where(and(...conditions))
      .orderBy(desc(tickets.createdAt));

    return { success: true, data: ticketList };
  } catch (error) {
    console.error('getClientTickets error:', error);
    return { success: false, error: 'Failed to fetch tickets' };
  }
}

/**
 * Get a single ticket with access check
 */
export async function getTicket(ticketId: string, userId: string, isAdmin = false) {
  try {
    const conditions = [eq(tickets.id, ticketId)];
    
    // Non-admins can only see their own tickets
    if (!isAdmin) {
      conditions.push(eq(tickets.clientId, userId));
    }

    const [ticket] = await db
      .select({
        id: tickets.id,
        ticketNumber: tickets.ticketNumber,
        subject: tickets.subject,
        description: tickets.description,
        department: tickets.department,
        priority: tickets.priority,
        status: tickets.status,
        rating: tickets.rating,
        ratingComment: tickets.ratingComment,
        firstResponseAt: tickets.firstResponseAt,
        projectId: tickets.projectId,
        projectTitle: internalProjects.title,
        assignedToId: tickets.assignedTo,
        clientId: tickets.clientId,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
      })
      .from(tickets)
      .leftJoin(internalProjects, eq(tickets.projectId, internalProjects.id))
      .where(and(...conditions))
      .limit(1);

    if (!ticket) {
      return { success: false, error: 'Ticket not found or access denied' };
    }

    // Get assigned user details
    let assignedUser = null;
    if (ticket.assignedToId) {
      const [user] = await db.select({ name: users.name, email: users.email, avatarUrl: users.avatarUrl })
        .from(users)
        .where(eq(users.id, ticket.assignedToId));
      assignedUser = user;
    }

    // Get client details
    const [client] = await db.select({ name: users.name, email: users.email, avatarUrl: users.avatarUrl })
      .from(users)
      .where(eq(users.id, ticket.clientId));

    return { 
      success: true, 
      data: { 
        ...ticket, 
        assignedToName: assignedUser?.name || assignedUser?.email,
        assignedToAvatar: assignedUser?.avatarUrl,
        clientName: client?.name || client?.email,
        clientAvatar: client?.avatarUrl,
      } 
    };
  } catch (error) {
    console.error('getTicket error:', error);
    return { success: false, error: 'Failed to fetch ticket' };
  }
}

/**
 * Get all tickets (admin only)
 */
export async function getAllTickets(filters?: { status?: string; priority?: string; unassigned?: boolean }) {
  try {
    const conditions: any[] = [];

    if (filters?.status) {
      conditions.push(eq(tickets.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(tickets.priority, filters.priority));
    }
    if (filters?.unassigned) {
      conditions.push(eq(tickets.assignedTo, null as any));
    }

    // Alias for assigned user
    const assignedUser = db.select({
      id: users.id,
      name: users.name,
    }).from(users).as('assignedUser');

    const ticketList = await db
      .select({
        id: tickets.id,
        subject: tickets.subject,
        description: tickets.description,
        priority: tickets.priority,
        status: tickets.status,
        projectId: tickets.projectId,
        projectTitle: internalProjects.title,
        assignedToId: tickets.assignedTo,
        clientId: tickets.clientId,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
      })
      .from(tickets)
      .leftJoin(internalProjects, eq(tickets.projectId, internalProjects.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(tickets.createdAt));

    // Fetch assigned names and client names
    const enrichedTickets = await Promise.all(
      ticketList.map(async (ticket) => {
        let assignedToName = null;
        let clientName = null;

        if (ticket.assignedToId) {
          const [assigned] = await db.select({ name: users.name })
            .from(users).where(eq(users.id, ticket.assignedToId));
          assignedToName = assigned?.name;
        }

        const [client] = await db.select({ name: users.name })
          .from(users).where(eq(users.id, ticket.clientId));
        clientName = client?.name;

        return { ...ticket, assignedToName, clientName };
      })
    );

    return { success: true, data: enrichedTickets };
  } catch (error) {
    console.error('getAllTickets error:', error);
    return { success: false, error: 'Failed to fetch tickets' };
  }
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(ticketId: string, status: TicketStatus, userId: string) {
  try {
    await db.update(tickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(tickets.id, ticketId));

    // Get ticket details for notification
    const [ticket] = await db.select({ clientId: tickets.clientId, subject: tickets.subject })
      .from(tickets)
      .where(eq(tickets.id, ticketId));

    if (ticket) {
      await createNotification(
        ticket.clientId,
        'ticket_updated',
        `Ticket Updated: ${ticket.subject}`,
        `Status changed to ${status}`,
        `/client/tickets/${ticketId}`
      );
    }

    revalidatePath('/client/tickets');
    revalidatePath('/admin/tickets');

    return { success: true };
  } catch (error) {
    console.error('updateTicketStatus error:', error);
    return { success: false, error: 'Failed to update ticket status' };
  }
}

/**
 * Assign ticket to staff
 */
export async function assignTicket(ticketId: string, staffId: string | null) {
  try {
    await db.update(tickets)
      .set({ assignedTo: staffId, updatedAt: new Date() })
      .where(eq(tickets.id, ticketId));

    // Notify assigned staff
    if (staffId) {
      const [ticket] = await db.select({ subject: tickets.subject })
        .from(tickets)
        .where(eq(tickets.id, ticketId));

      await createNotification(
        staffId,
        'ticket_assigned',
        `Ticket Assigned: ${ticket?.subject}`,
        'You have been assigned to this support ticket',
        `/admin/tickets/${ticketId}`
      );
    }

    revalidatePath('/admin/tickets');

    return { success: true };
  } catch (error) {
    console.error('assignTicket error:', error);
    return { success: false, error: 'Failed to assign ticket' };
  }
}

/**
 * Get ticket attachments
 */
export async function getTicketAttachments(ticketId: string) {
  try {
    const attachments = await db
      .select({
        id: ticketAttachments.id,
        name: ticketAttachments.name,
        url: ticketAttachments.url,
        sizeBytes: ticketAttachments.sizeBytes,
        uploadedByName: users.name,
        createdAt: ticketAttachments.createdAt,
      })
      .from(ticketAttachments)
      .leftJoin(users, eq(ticketAttachments.uploadedBy, users.id))
      .where(eq(ticketAttachments.ticketId, ticketId))
      .orderBy(desc(ticketAttachments.createdAt));

    return { success: true, data: attachments };
  } catch (error) {
    console.error('getTicketAttachments error:', error);
    return { success: false, error: 'Failed to fetch attachments' };
  }
}

/**
 * Add attachment to ticket
 */
export async function addTicketAttachment(
  ticketId: string,
  name: string,
  url: string,
  sizeBytes: number,
  uploadedBy: string
) {
  try {
    await db.insert(ticketAttachments).values({
      ticketId,
      name,
      url,
      sizeBytes,
      uploadedBy,
    });

    revalidatePath(`/client/tickets/${ticketId}`);
    revalidatePath(`/admin/tickets/${ticketId}`);

    return { success: true };
  } catch (error) {
    console.error('addTicketAttachment error:', error);
    return { success: false, error: 'Failed to add attachment' };
  }
}

/**
 * Get staff members for assignment dropdown
 */
export async function getStaffForAssignment() {
  try {
    const staff = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(or(eq(users.role, 'admin'), eq(users.role, 'staff')));

    return { success: true, data: staff };
  } catch (error) {
    console.error('getStaffForAssignment error:', error);
    return { success: false, error: 'Failed to fetch staff' };
  }
}

/**
 * Get comments for a ticket
 */
export async function getTicketComments(ticketId: string, includeInternal = false) {
  try {
    const conditions = [eq(ticketComments.ticketId, ticketId)];
    
    // Filter out internal comments for clients
    if (!includeInternal) {
      conditions.push(eq(ticketComments.isInternal, false));
    }

    const comments = await db
      .select({
        id: ticketComments.id,
        content: ticketComments.content,
        isInternal: ticketComments.isInternal,
        attachmentUrl: ticketComments.attachmentUrl,
        createdAt: ticketComments.createdAt,
        userId: ticketComments.userId,
        userName: users.name,
        userEmail: users.email,
        userRole: users.role,
        userAvatar: users.avatarUrl,
      })
      .from(ticketComments)
      .leftJoin(users, eq(ticketComments.userId, users.id))
      .where(and(...conditions))
      .orderBy(ticketComments.createdAt);

    return { success: true, data: comments };
  } catch (error) {
    console.error('getTicketComments error:', error);
    return { success: false, error: 'Failed to fetch comments' };
  }
}

/**
 * Post a comment on a ticket
 */
export async function postTicketComment(
  ticketId: string, 
  userId: string, 
  content: string, 
  isInternal = false,
  file?: File
) {
  try {
    let attachmentUrl = null;

    // Handle file upload if present
    if (file && file.size > 0) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `comment-${Date.now()}.${fileExt}`;
        const filePath = `tickets/${ticketId}/comments/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure bucket exists
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        if (!buckets?.find(b => b.name === 'ticket-files')) {
          await supabaseAdmin.storage.createBucket('ticket-files', { public: true });
        }

        const { error: uploadError } = await supabaseAdmin.storage
          .from('ticket-files')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('ticket-files')
            .getPublicUrl(filePath);
          attachmentUrl = publicUrl;
          console.log('Attachment uploaded successfully:', attachmentUrl);
        } else {
          console.error('Attachment upload error:', uploadError);
        }
      } catch (uploadErr) {
        console.error('Comment file upload error:', uploadErr);
      }
    }

    await db.insert(ticketComments).values({
      ticketId,
      userId,
      content,
      isInternal,
      attachmentUrl,
    });

    // Get ticket and user info for notification
    const [ticket] = await db.select({ 
      clientId: tickets.clientId, 
      assignedTo: tickets.assignedTo,
      subject: tickets.subject,
      firstResponseAt: tickets.firstResponseAt
    })
      .from(tickets)
      .where(eq(tickets.id, ticketId));

    const [commenter] = await db.select({ role: users.role, name: users.name })
      .from(users)
      .where(eq(users.id, userId));

    // Auto-update ticket status based on who commented
    if (!isInternal && ticket) {
      const isStaff = commenter?.role === 'admin' || commenter?.role === 'staff';
      const newStatus = isStaff ? 'awaiting_reply' : 'open';
      
      // Update status and first response time if staff's first response
      const updateData: any = { status: newStatus, updatedAt: new Date() };
      
      if (isStaff && !ticket.firstResponseAt) {
        updateData.firstResponseAt = new Date();
      }
      
      await db.update(tickets)
        .set(updateData)
        .where(eq(tickets.id, ticketId));

      // Log activity
      await logTicketActivity(ticketId, userId, 'commented', null, content.substring(0, 50));
    }

    // Notify relevant parties (skip internal notes for clients)
    if (!isInternal && ticket) {
      if (commenter?.role === 'client' || commenter?.role === 'user') {
        // Client commented - notify assigned staff or all admins
        if (ticket.assignedTo) {
          await createNotification(
            ticket.assignedTo,
            'ticket_comment',
            `New comment on ticket: ${ticket.subject}`,
            content.substring(0, 100),
            `/admin/tickets/${ticketId}`
          );
        } else {
          const admins = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.role, 'admin'));
          for (const admin of admins) {
            await createNotification(
              admin.id,
              'ticket_comment',
              `New comment on ticket: ${ticket.subject}`,
              content.substring(0, 100),
              `/admin/tickets/${ticketId}`
            );
          }
        }
      } else {
        // Staff/admin commented - notify client
        await createNotification(
          ticket.clientId,
          'ticket_comment',
          `New response on your ticket: ${ticket.subject}`,
          content.substring(0, 100),
          `/client/tickets/${ticketId}`
        );
      }
    }

    revalidatePath(`/client/tickets/${ticketId}`);
    revalidatePath(`/admin/tickets/${ticketId}`);

    return { success: true };
  } catch (error) {
    console.error('postTicketComment error:', error);
    return { success: false, error: 'Failed to post comment' };
  }
}

// ===== Activity Log Functions =====

/**
 * Log ticket activity for audit trail
 */
export async function logTicketActivity(
  ticketId: string,
  userId: string | null,
  action: string,
  oldValue: string | null,
  newValue: string | null
) {
  try {
    await db.insert(ticketActivity).values({
      ticketId,
      userId,
      action,
      oldValue,
      newValue,
    });
  } catch (error) {
    console.error('logTicketActivity error:', error);
  }
}

/**
 * Get activity log for a ticket
 */
export async function getTicketActivity(ticketId: string) {
  try {
    const logs = await db
      .select({
        id: ticketActivity.id,
        action: ticketActivity.action,
        oldValue: ticketActivity.oldValue,
        newValue: ticketActivity.newValue,
        createdAt: ticketActivity.createdAt,
        userName: users.name,
      })
      .from(ticketActivity)
      .leftJoin(users, eq(ticketActivity.userId, users.id))
      .where(eq(ticketActivity.ticketId, ticketId))
      .orderBy(desc(ticketActivity.createdAt));

    return { success: true, data: logs };
  } catch (error) {
    console.error('getTicketActivity error:', error);
    return { success: false, error: 'Failed to fetch activity' };
  }
}

// ===== Canned Responses Functions =====

/**
 * Get all canned responses, optionally filtered by department
 */
export async function getCannedResponses(department?: string) {
  try {
    let query = db.select().from(cannedResponses);
    
    if (department) {
      query = query.where(
        or(
          eq(cannedResponses.department, department),
          isNull(cannedResponses.department)
        )
      ) as any;
    }
    
    const responses = await query.orderBy(cannedResponses.title);
    return { success: true, data: responses };
  } catch (error) {
    console.error('getCannedResponses error:', error);
    return { success: false, error: 'Failed to fetch canned responses' };
  }
}

/**
 * Create a new canned response
 */
export async function createCannedResponse(
  title: string,
  content: string,
  createdBy: string,
  department?: string
) {
  try {
    await db.insert(cannedResponses).values({
      title,
      content,
      department: department || null,
      createdBy,
    });
    revalidatePath('/admin/tickets');
    return { success: true };
  } catch (error) {
    console.error('createCannedResponse error:', error);
    return { success: false, error: 'Failed to create canned response' };
  }
}

/**
 * Delete a canned response
 */
export async function deleteCannedResponse(id: string) {
  try {
    await db.delete(cannedResponses).where(eq(cannedResponses.id, id));
    revalidatePath('/admin/tickets');
    return { success: true };
  } catch (error) {
    console.error('deleteCannedResponse error:', error);
    return { success: false, error: 'Failed to delete canned response' };
  }
}

// ===== Customer Rating Functions =====

/**
 * Submit customer satisfaction rating for a resolved ticket
 */
export async function submitTicketRating(
  ticketId: string,
  clientId: string,
  rating: number,
  comment?: string
) {
  try {
    // Verify the ticket belongs to this client
    const [ticket] = await db.select({ clientId: tickets.clientId, status: tickets.status })
      .from(tickets)
      .where(eq(tickets.id, ticketId));

    if (!ticket || ticket.clientId !== clientId) {
      return { success: false, error: 'Ticket not found or access denied' };
    }

    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      return { success: false, error: 'Ticket must be resolved before rating' };
    }

    await db.update(tickets)
      .set({ 
        rating,
        ratingComment: comment || null,
        status: 'closed', // Close ticket after rating
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, ticketId));

    await logTicketActivity(ticketId, clientId, 'rated', null, `${rating} stars`);

    revalidatePath(`/client/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error('submitTicketRating error:', error);
    return { success: false, error: 'Failed to submit rating' };
  }
}
