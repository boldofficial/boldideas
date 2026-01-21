'use client';

import { useEffect, useState, use } from 'react';
import { getTicket, getTicketAttachments, updateTicketStatus, assignTicket, getStaffForAssignment, getTicketComments, postTicketComment, getCannedResponses, TicketStatus } from '@/actions/tickets';
import { getSLAStatus } from '@/lib/ticket-utils';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  FolderKanban, 
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Send,
  MessageSquare,
  Lock,
  Zap,
  Building,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Star,
  X,
  UserCircle
} from 'lucide-react';

interface TicketDetail {
  id: string;
  ticketNumber?: string | null;
  subject: string;
  description: string;
  priority: string | null;
  status: string | null;
  department?: string | null;
  projectId: string | null;
  projectTitle: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  assignedToAvatar?: string | null;
  clientId: string;
  clientName: string | null;
  clientAvatar?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  firstResponseAt?: Date | null;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  sizeBytes: number | null;
  uploadedByName: string | null;
  createdAt: Date | null;
}

interface StaffMember {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}

interface Comment {
  id: string;
  content: string;
  isInternal: boolean | null;
  attachmentUrl: string | null;
  createdAt: Date | null;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  userAvatar: string | null;
}

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cannedResponses, setCannedResponses] = useState<{id: string; title: string; content: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyExpanded, setReplyExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    
    const [ticketRes, attachmentsRes, staffRes, commentsRes, cannedRes] = await Promise.all([
      getTicket(id, '', true),
      getTicketAttachments(id),
      getStaffForAssignment(),
      getTicketComments(id, true),
      getCannedResponses(),
    ]);
    
    if (!ticketRes.success) {
      setError(ticketRes.error || 'Failed to load ticket');
      setLoading(false);
      return;
    }

    setTicket(ticketRes.data as TicketDetail);
    setAttachments(attachmentsRes.data || []);
    setStaff(staffRes.data || []);
    setComments(commentsRes.data || []);
    setCannedResponses(cannedRes.data || []);
    setLoading(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    await postTicketComment(id, user.id, newComment, isInternal, selectedFile || undefined);
    setNewComment('');
    setIsInternal(false);
    setSelectedFile(null);
    setReplyExpanded(false);
    setSubmitting(false);
    
    const { data } = await getTicketComments(id, true);
    setComments(data || []);
    fetchData();
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!user) return;
    await updateTicketStatus(id, newStatus, user.id);
    fetchData();
  };

  const handleAssignment = async (staffId: string) => {
    await assignTicket(id, staffId);
    fetchData();
  };

  // Download file without exposing external URL
  const handleDownload = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || url.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Get all attachments (from ticket + comments)
  const getAllAttachments = () => {
    const ticketAtts = attachments.map(a => ({ name: a.name, url: a.url, source: 'ticket' }));
    const commentAtts = comments
      .filter(c => c.attachmentUrl)
      .map(c => ({ 
        name: `Attachment from ${c.userName || 'User'}`, 
        url: c.attachmentUrl!, 
        source: 'comment' 
      }));
    return [...ticketAtts, ...commentAtts];
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const statusConfig: Record<string, { color: string; label: string }> = {
    'open': { color: 'bg-blue-500 text-white', label: 'OPEN' },
    'awaiting_reply': { color: 'bg-amber-500 text-white', label: 'AWAITING REPLY' },
    'in_progress': { color: 'bg-indigo-500 text-white', label: 'IN PROGRESS' },
    'on_hold': { color: 'bg-slate-500 text-white', label: 'ON HOLD' },
    'resolved': { color: 'bg-emerald-500 text-white', label: 'RESOLVED' },
    'closed': { color: 'bg-slate-700 text-white', label: 'CLOSED' },
  };

  const priorityConfig: Record<string, { color: string; label: string }> = {
    'urgent': { color: 'bg-red-500 text-white', label: 'Urgent' },
    'high': { color: 'bg-orange-500 text-white', label: 'High' },
    'medium': { color: 'bg-amber-500 text-white', label: 'Medium' },
    'low': { color: 'bg-slate-400 text-white', label: 'Low' },
  };

  const getRoleBadge = (role: string | null, isClient: boolean) => {
    if (isClient || role === 'client' || role === 'user') {
      return <Badge className="bg-brand-gold text-brand-navy text-xs font-semibold">Client</Badge>;
    }
    if (role === 'admin') {
      return <Badge className="bg-emerald-500 text-white text-xs font-semibold">Admin</Badge>;
    }
    return <Badge className="bg-blue-500 text-white text-xs font-semibold">Staff</Badge>;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date: Date | null) => {
    if (!date) return '-';
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(date);
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
        <Link href="/admin/tickets" className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors">
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

  const sla = getSLAStatus({
    priority: ticket.priority,
    createdAt: ticket.createdAt,
    firstResponseAt: ticket.firstResponseAt || null
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin" className="hover:text-brand-navy">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/tickets" className="hover:text-brand-navy">Support Tickets</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">View Ticket</span>
      </div>

      {/* Ticket Title */}
      <div className="text-center pb-4 border-b">
        <h1 className="text-2xl font-bold text-brand-navy">
          Ticket #{ticket.ticketNumber || ticket.id.slice(0, 8)} - {ticket.subject}
        </h1>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Collapsible Reply Section */}
          <Card className="border-brand-navy/20">
            <button
              onClick={() => setReplyExpanded(!replyExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-brand-navy font-semibold">
                <Send className="w-4 h-4" />
                Reply
              </div>
              {replyExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {replyExpanded && (
              <CardContent className="pt-0 border-t">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  {/* Canned Responses */}
                  {cannedResponses.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 mb-1 block">Quick Response</label>
                      <select
                        onChange={(e) => {
                          const response = cannedResponses.find(r => r.id === e.target.value);
                          if (response) setNewComment(response.content);
                          e.target.value = '';
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                        defaultValue=""
                      >
                        <option value="" disabled>Select a canned response...</option>
                        {cannedResponses.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Message Input */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-1 block">Message</label>
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type your response..."
                      className="min-h-[150px] resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {newComment.length} characters • {newComment.split(/\s+/).filter(Boolean).length} words
                    </p>
                  </div>

                  {/* Internal Note Toggle */}
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <Lock className="w-4 h-4" />
                    Internal note (not visible to client)
                  </label>

                  {/* Attachments */}
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-slate-600 mb-2 block">Attachments</label>
                    <div className="flex items-center gap-4">
                      <label className="px-4 py-2 bg-brand-gold text-brand-navy rounded-lg cursor-pointer hover:bg-brand-gold/80 transition-colors text-sm font-medium">
                        Select File
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-slate-500">
                        {selectedFile ? selectedFile.name : 'No file selected'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Allowed File Extensions: .jpg, .gif, .jpeg, .png, .pdf, .doc, .docx (Max file size: 10MB)
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      type="submit" 
                      disabled={!newComment.trim() || submitting}
                      className="bg-brand-navy hover:bg-brand-gold hover:text-brand-navy"
                    >
                      {submitting ? 'Sending...' : 'Submit'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setReplyExpanded(false);
                        setNewComment('');
                        setSelectedFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Messages/Conversation */}
          <div className="space-y-4">
            {comments.map((comment) => {
              const isStaff = comment.userRole === 'admin' || comment.userRole === 'staff';
              const isClientComment = comment.userId === ticket.clientId;
              
              return (
                <Card 
                  key={comment.id} 
                  className={`border-l-4 ${
                    comment.isInternal 
                      ? 'border-l-amber-400 bg-amber-50' 
                      : isStaff 
                        ? 'border-l-brand-navy' 
                        : 'border-l-brand-gold'
                  }`}
                >
                  <CardContent className="pt-4">
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                          comment.isInternal ? 'bg-amber-100 text-amber-600' : isStaff ? 'bg-brand-navy text-white' : 'bg-brand-gold text-brand-navy'
                        }`}>
                          {comment.userAvatar ? (
                            <img src={comment.userAvatar} alt={comment.userName || 'User'} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">
                              {comment.userName || 'Unknown'}
                            </span>
                            {getRoleBadge(comment.userRole, isClientComment)}
                            {comment.isInternal && (
                              <Badge className="bg-amber-100 text-amber-700 text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                Internal
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <div className="pl-13 ml-10">
                      <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                      
                      {/* Staff Signature */}
                      {isStaff && !comment.isInternal && (
                        <div className="mt-4 pt-3 border-t border-slate-200 text-sm text-slate-500">
                          <p>Support Team</p>
                          <p className="font-medium">Bold Ideas</p>
                        </div>
                      )}

                      {/* Attachment */}
                      {comment.attachmentUrl && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-sm font-medium text-slate-600 mb-2">Attachments (1)</p>
                          <button 
                            onClick={() => handleDownload(comment.attachmentUrl!, `attachment-${comment.id}`)}
                            className="flex items-center gap-2 text-brand-navy hover:text-brand-gold transition-colors text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download Attachment
                          </button>
                        </div>
                      )}

                      {/* Star Rating (for staff messages) */}
                      {isStaff && !comment.isInternal && (
                        <div className="mt-3 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-slate-300" />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Original Ticket Message */}
            <Card className="border-l-4 border-l-brand-gold">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center overflow-hidden">
                      {ticket.clientAvatar ? (
                        <img src={ticket.clientAvatar} alt={ticket.clientName || 'Client'} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{ticket.clientName}</span>
                        <Badge className="bg-brand-gold text-brand-navy text-xs font-semibold">Client</Badge>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="pl-13 ml-10">
                  <p className="text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
                  
                  {/* Original Attachments */}
                  {attachments.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <p className="text-sm font-medium text-slate-600 mb-2">Attachments ({attachments.length})</p>
                      {attachments.map((att) => (
                        <button 
                          key={att.id}
                          onClick={() => handleDownload(att.url, att.name)}
                          className="flex items-center gap-2 text-brand-navy hover:text-brand-gold transition-colors text-sm mb-1"
                        >
                          <Download className="w-4 h-4" />
                          {att.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Ticket Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-brand-navy">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Requestor */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Requestor</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{ticket.clientName}</span>
                  <Badge className="bg-brand-gold text-brand-navy text-xs">OWNER</Badge>
                </div>
              </div>

              {/* Department */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Department</p>
                <p className="font-medium capitalize">{ticket.department || 'Support'}</p>
              </div>

              {/* Assigned To */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Assigned To</p>
                <select
                  value={ticket.assignedToId || ''}
                  onChange={(e) => handleAssignment(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || s.email}</option>
                  ))}
                </select>
              </div>

              {/* Submitted */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Submitted</p>
                <p className="font-medium">{formatDate(ticket.createdAt)}</p>
              </div>

              {/* Last Updated */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="font-medium">{formatRelativeTime(ticket.updatedAt)}</p>
              </div>

              {/* Status/Priority */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status / Priority</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={statusConfig[ticket.status || 'open']?.color || 'bg-blue-500 text-white'}>
                    {statusConfig[ticket.status || 'open']?.label || 'OPEN'}
                  </Badge>
                  <Badge className={priorityConfig[ticket.priority || 'medium']?.color || 'bg-amber-500 text-white'}>
                    {priorityConfig[ticket.priority || 'medium']?.label || 'Medium'}
                  </Badge>
                </div>
              </div>

              {/* SLA Indicator */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">SLA Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    sla.status === 'overdue' ? 'bg-red-500' :
                    sla.status === 'warning' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />
                  <span className="text-sm capitalize">{sla.status} ({Math.round(sla.percentUsed)}%)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => setReplyExpanded(true)}
                  className="w-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy"
                >
                  Reply
                </Button>
                {ticket.status !== 'closed' && (
                  <Button 
                    onClick={() => handleStatusChange('closed')}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Close Ticket
                  </Button>
                )}
              </div>

              {/* Status Update */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Update Status</p>
                <select
                  value={ticket.status || 'open'}
                  onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="open">Open</option>
                  <option value="awaiting_reply">Awaiting Reply</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-brand-navy">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {getAllAttachments().length === 0 ? (
                <p className="text-sm text-slate-400">No attachments</p>
              ) : (
                <div className="space-y-2">
                  {getAllAttachments().map((att, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleDownload(att.url, att.name)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-brand-navy hover:text-brand-gold transition-colors text-sm w-full text-left"
                    >
                      <Download className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{att.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Link */}
          {ticket.projectId && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-brand-navy">Related Project</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  href={`/admin/projects/${ticket.projectId}`}
                  className="flex items-center gap-2 text-brand-navy hover:text-brand-gold transition-colors"
                >
                  <FolderKanban className="w-4 h-4" />
                  {ticket.projectTitle}
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
