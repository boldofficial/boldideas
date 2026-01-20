'use server';

import { db } from '@/lib/db';
import { tickets, ticketAttachments, users, internalProjects } from '@/lib/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

// Types
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface CreateTicketData {
  subject: string;
  description: string;
  priority?: TicketPriority;
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
 * Create a new ticket
 */
export async function createTicket(clientId: string, data: CreateTicketData) {
  try {
    const [newTicket] = await db.insert(tickets).values({
      clientId,
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'medium',
      projectId: data.projectId || null,
    }).returning();

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
      .where(and(...conditions))
      .limit(1);

    if (!ticket) {
      return { success: false, error: 'Ticket not found or access denied' };
    }

    // Get assigned user details
    let assignedUser = null;
    if (ticket.assignedToId) {
      const [user] = await db.select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, ticket.assignedToId));
      assignedUser = user;
    }

    // Get client details
    const [client] = await db.select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, ticket.clientId));

    return { 
      success: true, 
      data: { 
        ...ticket, 
        assignedToName: assignedUser?.name || assignedUser?.email,
        clientName: client?.name || client?.email,
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
