'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getClientTickets } from '@/actions/tickets';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, Plus, Clock, CheckCircle2, AlertCircle, Filter } from 'lucide-react';

interface TicketItem {
  id: string;
  subject: string;
  description: string;
  priority: string | null;
  status: string | null;
  projectId: string | null;
  projectTitle: string | null;
  assignedToName: string | null;
  createdAt: Date | null;
}

export default function ClientTicketsPage() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await getClientTickets(user.id);
      setTickets(data || []);
      setLoading(false);
    };

    fetchTickets();
  }, [user]);

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filterStatus);

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
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const statusIcon = (status: string | null) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': case 'closed': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Support Tickets</h1>
          <p className="text-slate-500 mt-1">Manage your support requests and inquiries</p>
        </div>
        <Link href="/client/tickets/new">
          <Button className="bg-brand-navy hover:bg-brand-gold hover:text-brand-navy transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('all')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-brand-navy" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{tickets.length}</p>
                <p className="text-xs text-slate-500">Total Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('open')}>
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

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('in_progress')}>
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

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('resolved')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{resolvedCount}</p>
                <p className="text-xs text-slate-500">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Indicator */}
      {filterStatus !== 'all' && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Showing: <strong className="text-brand-navy capitalize">{filterStatus.replace('_', ' ')}</strong></span>
          <button 
            onClick={() => setFilterStatus('all')}
            className="text-sm text-brand-navy hover:text-brand-gold underline ml-2"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <Ticket className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm mt-2">
              {filterStatus === 'all' 
                ? "Create your first support ticket to get help from our team"
                : `No ${filterStatus.replace('_', ' ')} tickets`}
            </p>
            {filterStatus === 'all' && (
              <Link href="/client/tickets/new">
                <Button className="mt-6 bg-brand-navy hover:bg-brand-gold hover:text-brand-navy">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <Link key={ticket.id} href={`/client/tickets/${ticket.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-brand-gold">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColor(ticket.status)}`}>
                        {statusIcon(ticket.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-brand-navy truncate">{ticket.subject}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          {ticket.projectTitle && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded">
                              {ticket.projectTitle}
                            </span>
                          )}
                          {!ticket.projectTitle && (
                            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                              General Inquiry
                            </span>
                          )}
                          <span>
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusColor(ticket.status)}>
                        {ticket.status?.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={priorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
