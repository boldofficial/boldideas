'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { createTicket, CreateTicketData } from '@/actions/tickets';
import { getClientProjects } from '@/actions/clientPortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import Link from 'next/link';

interface ProjectOption {
  id: string;
  title: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    department: 'general' as 'general' | 'billing' | 'technical' | 'sales',
    projectId: searchParams.get('project') || '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const { data } = await getClientProjects(user.id);
      setProjects(data?.map(p => ({ id: p.id, title: p.title })) || []);
    };
    fetchProjects();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setLoading(true);

    const ticketData: CreateTicketData = {
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      department: formData.department,
      projectId: formData.projectId || null,
    };

    const result = await createTicket(user.id, ticketData, selectedFile || undefined);

    if (result.success) {
      router.push('/client/tickets');
    } else {
      setError(result.error || 'Failed to create ticket');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link href="/client/tickets" className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tickets
      </Link>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-brand-navy">Create New Ticket</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief summary of your issue or question"
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            {/* Department Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Department
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['general', 'billing', 'technical', 'sales'] as const).map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, department: dept }))}
                    className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                      formData.department === dept
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Select the department that best matches your inquiry
              </p>
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Related Project
              </label>
              <select
                name="projectId"
                value={formData.projectId || ''}
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy bg-white"
              >
                <option value="">General Inquiry (No specific project)</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                Select a project if your ticket is related to a specific project
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                      formData.priority === priority
                        ? priority === 'urgent'
                          ? 'bg-red-100 border-red-300 text-red-700'
                          : priority === 'high'
                          ? 'bg-orange-100 border-orange-300 text-orange-700'
                          : priority === 'medium'
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'bg-slate-100 border-slate-300 text-slate-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Please describe your issue or question in detail. Include any relevant information that will help us assist you."
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy resize-none"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Attachment
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Paperclip className="w-4 h-4" />
                    <span>{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {!selectedFile && (
                  <p className="text-xs text-slate-400 mt-2">
                    Optional: Attach a screenshot or document to help explain your issue
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Link href="/client/tickets" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading || !formData.subject || !formData.description}
                className="flex-1 bg-brand-navy hover:bg-brand-gold hover:text-brand-navy transition-all"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
