'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getClientProjects, ClientProject } from '@/actions/clientPortal';
import { getProjectMilestones } from '@/actions/pm';
import { getInvoices } from '@/actions/finance';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Clock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      console.log('🔍 DEBUG: Client User ID:', user.id);
      console.log('🔍 DEBUG: Client Email:', user.email);

      const [projectsRes, invoicesRes] = await Promise.all([
        getClientProjects(user.id),
        getInvoices(user.id),
      ]);

      console.log('🔍 DEBUG: Projects Response:', projectsRes);
      console.log('🔍 DEBUG: Projects Data:', projectsRes.data);

      setProjects(projectsRes.data || []);
      setInvoices(invoicesRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const statusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'on_hold': return 'bg-amber-100 text-amber-700';
      case 'planning': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Welcome Back</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your projects</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-brand-navy" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{projects.length}</p>
                <p className="text-sm text-slate-500">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{activeProjects.length}</p>
                <p className="text-sm text-slate-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{completedProjects.length}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{invoices.length}</p>
                <p className="text-sm text-slate-500">Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-navy">Active Projects</h2>
          <Link 
            href="/client/projects" 
            className="text-sm text-brand-navy hover:text-brand-gold flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-400">
              <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No active projects at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeProjects.slice(0, 3).map((project) => (
              <Link key={project.id} href={`/client/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-brand-gold">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-brand-navy">{project.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{project.description || 'No description'}</p>
                      </div>
                      <Badge className={statusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium text-brand-navy">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-slate-100" indicatorClassName="bg-brand-navy" />
                      <p className="text-xs text-slate-400">
                        {project.completedTasks} of {project.totalTasks} tasks completed
                      </p>
                    </div>

                    <div className="flex justify-between text-xs text-slate-400 mt-4 pt-4 border-t">
                      <span>Started: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</span>
                      <span>Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Ongoing'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div>
        <h2 className="text-xl font-bold text-brand-navy mb-4">Recent Invoices</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Invoice</th>
                  <th className="p-4 font-semibold text-slate-600">Amount</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-4 font-mono text-xs text-slate-500">#{inv.id.slice(0, 8)}</td>
                    <td className="p-4 font-bold text-brand-navy">${inv.totalAmount}</td>
                    <td className="p-4">
                      <Badge className={
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No invoices found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
