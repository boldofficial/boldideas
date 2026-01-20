'use client';

import { useEffect, useState, use } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getTicket, getTicketAttachments } from '@/actions/tickets';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  FolderKanban, 
  FileText,
  Download,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface TicketDetail {
  id: string;
  subject: string;
  description: string;
  priority: string | null;
  status: string | null;
  projectId: string | null;
  projectTitle: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  clientName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  sizeBytes: number | null;
  uploadedByName: string | null;
  createdAt: Date | null;
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      const ticketRes = await getTicket(id, user.id);
      
      if (!ticketRes.success) {
        setError(ticketRes.error || 'Failed to load ticket');
        setLoading(false);
        return;
      }

      setTicket(ticketRes.data as TicketDetail);

      const attachmentsRes = await getTicketAttachments(id);
      setAttachments(attachmentsRes.data || []);
      
      setLoading(false);
    };

    fetchData();
  }, [id, user]);

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

  const statusIcon = (status: string | null) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-5 h-5" />;
      case 'in_progress': return <Clock className="w-5 h-5" />;
      case 'resolved': case 'closed': return <CheckCircle2 className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <Link href="/client/tickets" className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </Link>
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <p className="text-lg font-medium">{error || 'Ticket not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/client/tickets" className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tickets
      </Link>

      {/* Ticket Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusColor(ticket.status)}`}>
            {statusIcon(ticket.status)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">{ticket.subject}</h1>
            <p className="text-slate-500 mt-1">
              Created on {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColor(ticket.status)}>
            {ticket.status?.replace('_', ' ')}
          </Badge>
          <Badge className={priorityColor(ticket.priority)}>
            {ticket.priority} priority
          </Badge>
        </div>
      </div>

      {/* Ticket Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ticket.projectId && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Project</p>
                  <Link 
                    href={`/client/projects/${ticket.projectId}`}
                    className="font-medium text-brand-navy hover:text-brand-gold transition-colors"
                  >
                    {ticket.projectTitle}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Assigned To</p>
                <p className="font-medium text-brand-navy">
                  {ticket.assignedToName || 'Unassigned'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="font-medium text-brand-navy">
                  {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-navy">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-wrap text-slate-600">{ticket.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-navy">
            Attachments ({attachments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attachments.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
              No attachments added to this ticket
            </p>
          ) : (
            <div className="divide-y">
              {attachments.map((file) => (
                <div key={file.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-brand-navy">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(file.sizeBytes)} • Uploaded by {file.uploadedByName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-navy hover:text-brand-gold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
