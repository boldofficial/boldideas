'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getClientProjects, ClientProject } from '@/actions/clientPortal';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FolderKanban, Search, ArrowRight, Calendar } from 'lucide-react';

export default function ClientProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await getClientProjects(user.id);
      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, [user]);

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'on_hold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'planning': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">My Projects</h1>
          <p className="text-slate-500 mt-1">Track progress on all your projects</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No projects found</p>
            <p className="text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 'No projects have been assigned to you yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/client/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-brand-navy group-hover:text-brand-gold transition-colors truncate">
                          {project.title}
                        </h3>
                        <Badge className={statusColor(project.status)}>
                          {project.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {project.description || 'No description available'}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-gold transition-colors flex-shrink-0" />
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-semibold text-brand-navy">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-slate-100" indicatorClassName="bg-brand-navy" />
                      <p className="text-xs text-slate-400">
                        {project.completedTasks}/{project.totalTasks} tasks
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not started'}
                        {' → '}
                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>

                    {/* Manager */}
                    <div className="text-sm text-slate-500">
                      <span className="text-slate-400">Manager:</span>{' '}
                      <span className="font-medium text-brand-navy">{project.managerName || 'Unassigned'}</span>
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
