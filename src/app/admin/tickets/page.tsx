'use client';

import { useEffect, useState } from 'react';
import { getAllTickets, updateTicketStatus, assignTicket, getStaffForAssignment, TicketStatus } from '@/actions/tickets';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  User,
  RefreshCw
} from 'lucide-react';

interface TicketItem {
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
}

interface StaffMember {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [showUnassigned, setShowUnassigned] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [ticketsRes, staffRes] = await Promise.all([
      getAllTickets({
        status: filterStatus || undefined,
        priority: filterPriority || undefined,
        unassigned: showUnassigned || undefined,
      }),
      getStaffForAssignment(),
    ]);
    setTickets(ticketsRes.data || []);
    setStaff(staffRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterPriority, showUnassigned]);

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    await updateTicketStatus(ticketId, newStatus, '');
    fetchData();
  };

  const handleAssign = async (ticketId: string, staffId: string) => {
    await assignTicket(ticketId, staffId || null);
    fetchData();
  };

  const statusColor = (status: string | null) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      case 'closed': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const priorityColor = (priority: string | null) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const unassignedCount = tickets.filter(t => !t.assignedToId).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Support Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">Manage client support requests</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setFilterStatus(''); setShowUnassigned(false); }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-brand-navy" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{tickets.length}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setFilterStatus('open'); setShowUnassigned(false); }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{openCount}</p>
                <p className="text-xs text-slate-500">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setFilterStatus('in_progress'); setShowUnassigned(false); }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{inProgressCount}</p>
                <p className="text-xs text-slate-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setShowUnassigned(true); setFilterStatus(''); }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <User className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{unassignedCount}</p>
                <p className="text-xs text-slate-500">Unassigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">Filters:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white"
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showUnassigned}
                onChange={(e) => setShowUnassigned(e.target.checked)}
                className="rounded"
              />
              Unassigned only
            </label>

            {(filterStatus || filterPriority || showUnassigned) && (
              <button
                onClick={() => { setFilterStatus(''); setFilterPriority(''); setShowUnassigned(false); }}
                className="text-sm text-brand-navy hover:text-brand-gold underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <Ticket className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-left font-semibold text-slate-600">Ticket</th>
                  <th className="p-4 text-left font-semibold text-slate-600">Client</th>
                  <th className="p-4 text-left font-semibold text-slate-600">Project</th>
                  <th className="p-4 text-left font-semibold text-slate-600">Status</th>
                  <th className="p-4 text-left font-semibold text-slate-600">Priority</th>
                  <th className="p-4 text-left font-semibold text-slate-600">Assigned To</th>
                  <th className="p-4 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-4">
                      <Link href={`/admin/tickets/${ticket.id}`} className="hover:text-brand-gold">
                        <p className="font-medium text-brand-navy">{ticket.subject}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                        </p>
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600">{ticket.clientName || '-'}</td>
                    <td className="p-4">
                      {ticket.projectTitle ? (
                        <span className="text-slate-600">{ticket.projectTitle}</span>
                      ) : (
                        <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs">General</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={ticket.status || 'open'}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer ${statusColor(ticket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <Badge className={priorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <select
                        value={ticket.assignedToId || ''}
                        onChange={(e) => handleAssign(ticket.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white min-w-[120px]"
                      >
                        <option value="">Unassigned</option>
                        {staff.map(s => (
                          <option key={s.id} value={s.id}>{s.name || s.email}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/tickets/${ticket.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
