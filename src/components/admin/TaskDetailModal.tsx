'use client';

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Edit2, CheckCircle, Circle, Folder } from 'lucide-react';
import { updateTaskStatus } from '@/actions/pm';
import CommentSystem from '@/components/shared/CommentSystem';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    assigneeName?: string | null;
    projectId?: string | null;
    subtasks?: any[] | null;
}

interface Props {
    task: Task | null;
    onClose: () => void;
    onEdit: (task: Task) => void;
    onStatusChange: (taskId: string, status: string) => void;
    userId?: string;
    comments?: any[];
}

const getPriorityVariant = (priority: string | null) => {
    switch (priority) {
        case 'urgent': return 'destructive';
        case 'high': return 'secondary';
        default: return 'outline';
    }
};

export default function TaskDetailModal({ task, onClose, onEdit, onStatusChange, userId, comments = [] }: Props) {
    if (!task) return null;

    const handleStatusUpdate = async (status: string) => {
        const res = await updateTaskStatus(task.id, status, task.projectId || 'null');
        if (res.success) onStatusChange(task.id, status);
    };

    return (
        <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getPriorityVariant(task.priority)}>
                            {task.priority || 'Normal'}
                        </Badge>
                        <Badge variant="outline">
                            {task.status?.replace('_', ' ') || 'Todo'}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
                        <Button variant="outline" size="icon" onClick={() => { onEdit(task); onClose(); }}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </div>
                    {task.projectId && task.projectId !== 'null' && (
                        <DialogDescription className="flex items-center gap-1.5 mt-1">
                            <Folder className="w-3.5 h-3.5" />
                            Assigned to Project
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(90vh-180px)]">
                    {/* Left - Task Info */}
                    <ScrollArea className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6 max-w-xl">
                            {/* Meta Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Due Date</p>
                                        <p className="text-sm font-semibold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Assignee</p>
                                        <p className="text-sm font-semibold">{task.assigneeName || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Description</h3>
                                <div className="p-4 bg-white rounded-xl border text-sm leading-relaxed">
                                    {task.description || 'No description provided.'}
                                </div>
                            </div>

                            {/* Checklist */}
                            {task.subtasks && task.subtasks.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Checklist</h3>
                                    <div className="space-y-2">
                                        {task.subtasks.map((sub: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                                                {sub.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-muted-foreground" />
                                                )}
                                                <span className={`text-sm ${sub.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                    {sub.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Status Actions */}
                            <div>
                                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">Update Status</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['todo', 'in_progress', 'review', 'done'].map((status) => (
                                        <Button
                                            key={status}
                                            variant={task.status === status ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleStatusUpdate(status)}
                                            disabled={task.status === status}
                                            className="uppercase text-xs tracking-wide"
                                        >
                                            {status.replace('_', ' ')}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Right - Comments */}
                    <div className="w-full lg:w-[400px] border-l bg-slate-50/50 flex flex-col overflow-hidden">
                        {userId && (
                            <CommentSystem
                                key={task.id}
                                taskId={task.id}
                                projectId={task.projectId || 'null'}
                                userId={userId}
                                initialComments={comments}
                                title="Team Communication"
                                className="h-full rounded-none border-0 shadow-none"
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t bg-slate-50/50">
                    <Button onClick={onClose} className="bg-brand-navy hover:bg-brand-navy/90">
                        Close View
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
