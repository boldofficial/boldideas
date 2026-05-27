// Ticket utility functions (not server actions)

export type SLAStatus = 'ok' | 'warning' | 'overdue' | 'unknown';

/**
 * Get SLA status for a ticket based on priority
 */
export function getSLAStatus(ticket: {
  priority: string | null;
  createdAt: Date | null;
  firstResponseAt: Date | null;
}): { status: SLAStatus; percentUsed: number } {
  const slaTargets: Record<string, { firstResponse: number; resolution: number }> = {
    urgent: { firstResponse: 1, resolution: 4 },     // hours
    high: { firstResponse: 4, resolution: 24 },
    medium: { firstResponse: 12, resolution: 48 },
    low: { firstResponse: 24, resolution: 72 },
  };

  const priority = ticket.priority || 'medium';
  const target = slaTargets[priority] || slaTargets.medium;
  
  if (!ticket.createdAt) {
    return { status: 'unknown', percentUsed: 0 };
  }

  const createdAt = new Date(ticket.createdAt);
  const now = new Date();
  const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  // If not responded yet, check first response SLA
  if (!ticket.firstResponseAt) {
    const percentUsed = Math.min(100, (hoursElapsed / target.firstResponse) * 100);
    if (percentUsed >= 100) return { status: 'overdue', percentUsed };
    if (percentUsed >= 75) return { status: 'warning', percentUsed };
    return { status: 'ok', percentUsed };
  }

  // If responded, check resolution SLA
  const percentUsed = Math.min(100, (hoursElapsed / target.resolution) * 100);
  if (percentUsed >= 100) return { status: 'overdue', percentUsed };
  if (percentUsed >= 75) return { status: 'warning', percentUsed };
  return { status: 'ok', percentUsed };
}
