'use client';

import { useEffect, useState, use } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getClientProject, getClientProjectTasks, getProjectFiles } from '@/actions/clientPortal';
import { getProjectMilestones } from '@/actions/pm';
import { getClientTickets } from '@/actions/tickets';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Calendar,
  User,
  ListTodo,
  Milestone,
  Files,
  Ticket,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectDetail {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  budget: string | null;
  managerName: string | null;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

interface Task {
  id: string;
  title: string;
  status: string | null;
  priority: string | null;
  dueDate: Date | null;
}

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string | null;
  sizeBytes: number | null;
  createdAt: Date | null;
  uploadedByName: string | null;
}

interface MilestoneItem {
  id: string;
  title: string;
  status: string | null;
  dueDate: Date | null;
}

export default function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      const projectRes = await getClientProject(id, user.id);
      
      if (!projectRes.success) {
        setError(projectRes.error || 'Failed to load project');
        setLoading(false);
        return;
      }

      setProject(projectRes.data as ProjectDetail);

      // Fetch related data in parallel
      const [tasksRes, filesRes, milestonesRes, ticketsRes] = await Promise.all([
        getClientProjectTasks(id, user.id),
        getProjectFiles(id, user.id),
        getProjectMilestones(id),
        getClientTickets(user.id, id),
      ]);

      setTasks(tasksRes.data || []);
      setFiles(filesRes.data || []);
      setMilestones(milestonesRes.data || []);
      setTickets(ticketsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const statusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'completed': case 'done': return 'bg-blue-100 text-blue-700';
      case 'on_hold': case 'review': return 'bg-amber-100 text-amber-700';
      case 'in_progress': return 'bg-indigo-100 text-indigo-700';
      case 'todo': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const priorityColor = (priority: string | null) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-slate-500';
      default: return 'text-slate-500';
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

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Link href="/client/projects" className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <p className="text-lg font-medium">{error || 'Project not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/client/projects" className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">{project.title}</h1>
          <p className="text-slate-500 mt-2">{project.description || 'No description'}</p>
        </div>
        <Badge className={`${statusColor(project.status)} text-sm px-3 py-1`}>
          {project.status?.replace('_', ' ')}
        </Badge>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-brand-navy" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{project.progress}%</p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{project.completedTasks}/{project.totalTasks}</p>
                <p className="text-xs text-slate-500">Tasks Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '-'}
                </p>
                <p className="text-xs text-slate-500">Due Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy truncate">{project.managerName || 'Unassigned'}</p>
                <p className="text-xs text-slate-500">Project Manager</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-brand-navy">Overall Progress</span>
            <span className="text-slate-500">{project.progress}% complete</span>
          </div>
          <Progress value={project.progress} className="h-3 bg-slate-100" indicatorClassName="bg-brand-gold" />
        </CardContent>
      </Card>

      {/* Tabs: Tasks, Milestones, Files */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger 
            value="tasks" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-navy data-[state=active]:bg-transparent px-6 py-3"
          >
            <ListTodo className="w-4 h-4 mr-2" />
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="milestones" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-navy data-[state=active]:bg-transparent px-6 py-3"
          >
            <Milestone className="w-4 h-4 mr-2" />
            Milestones ({milestones.length})
          </TabsTrigger>
          <TabsTrigger 
            value="files" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-navy data-[state=active]:bg-transparent px-6 py-3"
          >
            <Files className="w-4 h-4 mr-2" />
            Files ({files.length})
          </TabsTrigger>
          <TabsTrigger 
            value="tickets" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-navy data-[state=active]:bg-transparent px-6 py-3"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Tickets ({tickets.length})
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-400">
                <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No tasks created for this project yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['todo', 'in_progress', 'review', 'done'] as const).map((status) => (
                <Card key={status} className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {status.replace('_', ' ')} ({tasksByStatus[status].length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tasksByStatus[status].map((task) => (
                      <div key={task.id} className="bg-white p-3 rounded-lg border shadow-sm">
                        <p className="font-medium text-sm text-brand-navy">{task.title}</p>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className={`font-medium ${priorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-slate-400">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {tasksByStatus[status].length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No tasks</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="mt-6">
          {milestones.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-400">
                <Milestone className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No milestones set for this project</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="divide-y">
                {milestones.map((ms) => (
                  <div key={ms.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {ms.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400" />
                      )}
                      <span className={`font-medium ${ms.status === 'completed' ? 'text-slate-400 line-through' : 'text-brand-navy'}`}>
                        {ms.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {ms.dueDate && (
                        <span className="text-sm text-slate-500">
                          {new Date(ms.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <Badge className={statusColor(ms.status)}>
                        {ms.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          {files.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-400">
                <Files className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No files have been shared for this project yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-4 text-left font-semibold text-slate-600">File</th>
                      <th className="p-4 text-left font-semibold text-slate-600">Type</th>
                      <th className="p-4 text-left font-semibold text-slate-600">Size</th>
                      <th className="p-4 text-left font-semibold text-slate-600">Uploaded</th>
                      <th className="p-4 text-right font-semibold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-brand-navy" />
                            <span className="font-medium text-brand-navy">{file.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {file.type || 'document'}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-500">{formatFileSize(file.sizeBytes)}</td>
                        <td className="p-4 text-slate-500">
                          {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-gold transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500">
              {tickets.length === 0 
                ? 'No tickets for this project yet' 
                : `${tickets.length} ticket${tickets.length > 1 ? 's' : ''} for this project`}
            </p>
            <Link href={`/client/tickets/new?project=${id}`}>
              <Button className="bg-brand-navy hover:bg-brand-gold hover:text-brand-navy transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Raise Ticket
              </Button>
            </Link>
          </div>

          {tickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-400">
                <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No support tickets for this project</p>
                <p className="text-sm mt-2">Click "Raise Ticket" to create one</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket: any) => (
                <Link key={ticket.id} href={`/client/tickets/${ticket.id}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-brand-gold">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            ticket.status === 'open' ? 'bg-blue-100 text-blue-600' :
                            ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-600' :
                            ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.status === 'open' ? <AlertCircle className="w-5 h-5" /> :
                             ticket.status === 'in_progress' ? <Clock className="w-5 h-5" /> :
                             <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-brand-navy truncate">{ticket.subject}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                              {ticket.description}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                            ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-600'
                          }>
                            {ticket.status?.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={
                            ticket.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-200' :
                            ticket.priority === 'high' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
