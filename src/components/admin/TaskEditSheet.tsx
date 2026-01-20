'use client';

import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updateProjectTask } from '@/actions/pm';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    estimatedMinutes?: number | null;
    subtasks?: any[] | null;
    projectId?: string | null;
}

interface User {
    id: string;
    name: string;
}

interface Props {
    task: Task | null;
    onClose: () => void;
    users: User[];
}

export default function TaskEditSheet({ task, onClose, users }: Props) {
    if (!task) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('projectId', task.projectId || 'null');
        formData.append('taskId', task.id);

        const result = await updateProjectTask(formData);
        if (result.success) {
            onClose();
            window.location.reload();
        }
    };

    return (
        <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b bg-slate-50/50">
                    <SheetTitle className="text-xl font-bold text-slate-800">Edit Task</SheetTitle>
                    <SheetDescription className="text-brand-gold">Update task parameters</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    required
                                    defaultValue={task.title}
                                    placeholder="What needs to be done?"
                                    className="bg-slate-50 border-slate-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={task.description || ''}
                                    placeholder="Add more details about this task..."
                                    className="min-h-[120px] resize-none bg-slate-50 border-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500">Priority</Label>
                                    <Select name="priority" defaultValue={task.priority || 'medium'}>
                                        <SelectTrigger className="bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate" className="text-xs font-semibold text-slate-500">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        name="dueDate"
                                        type="date"
                                        defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedMinutes" className="text-xs font-semibold text-slate-500">Est. Minutes</Label>
                                    <Input
                                        id="estimatedMinutes"
                                        name="estimatedMinutes"
                                        type="number"
                                        defaultValue={task.estimatedMinutes || 0}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500">Assignee</Label>
                                    <Select name="assigneeId" defaultValue={task.assigneeId || 'unassigned'}>
                                        <SelectTrigger className="bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500">Steps / Checklist</Label>
                                <Textarea
                                    defaultValue={task.subtasks?.map((s: any) => s.title).join('\n') || ''}
                                    onChange={(e) => {
                                        const lines = e.target.value.split('\n').filter(l => l.trim());
                                        const subtasks = lines.map(l => ({ title: l, completed: false }));
                                        const input = e.target.form?.querySelector('input[name="subtasks"]') as HTMLInputElement;
                                        if (input) input.value = JSON.stringify(subtasks);
                                    }}
                                    placeholder="Enter each step on a new line..."
                                    className="min-h-[80px] resize-none bg-slate-50 border-slate-200"
                                />
                                <input type="hidden" name="subtasks" defaultValue={JSON.stringify(task.subtasks || [])} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file" className="text-xs font-semibold text-slate-500">Attachment</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    className="cursor-pointer bg-slate-50 border-slate-200"
                                />
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-6 pt-4 border-t bg-slate-50/50">
                        <Button type="submit" className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold py-3 rounded-xl">
                            Update Task
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
