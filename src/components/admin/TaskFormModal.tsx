'use client';

import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createProjectTask, updateProjectTask } from '@/actions/pm';

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
}

interface User {
    id: string;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    task?: Task | null;
    users: User[];
}

export default function TaskFormModal({ open, onClose, task, users }: Props) {
    const isEditing = !!task;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('projectId', 'null');

        if (task) {
            formData.append('taskId', task.id);
            const result = await updateProjectTask(formData);
            if (result.success) {
                onClose();
                window.location.reload();
            }
        } else {
            const result = await createProjectTask(formData);
            if (result.success) {
                onClose();
                window.location.reload();
            }
        }
    };

    return (
        <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b bg-slate-50/50">
                    <SheetTitle className="text-xl font-bold">
                        {isEditing ? 'Edit Task' : 'New Task'}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditing ? 'Update task details below' : 'Fill in the details to create a new task'}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    required
                                    defaultValue={task?.title || ''}
                                    placeholder="What needs to be done?"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={task?.description || ''}
                                    placeholder="Add more details about this task..."
                                    className="min-h-[120px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select name="priority" defaultValue={task?.priority || 'medium'}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        name="dueDate"
                                        type="date"
                                        defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedMinutes">Est. Minutes</Label>
                                    <Input
                                        id="estimatedMinutes"
                                        name="estimatedMinutes"
                                        type="number"
                                        defaultValue={task?.estimatedMinutes || 0}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assignee</Label>
                                    <Select name="assigneeId" defaultValue={task?.assigneeId || 'unassigned'}>
                                        <SelectTrigger>
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
                                <Label htmlFor="file">Attachment</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    className="cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtasks">Steps / Checklist</Label>
                                <Textarea
                                    id="subtasks-text"
                                    defaultValue={task?.subtasks?.map((s: any) => s.title).join('\n') || ''}
                                    onChange={(e) => {
                                        const lines = e.target.value.split('\n').filter(l => l.trim());
                                        const subtasks = lines.map(l => ({ title: l, completed: false }));
                                        const input = e.target.form?.querySelector('input[name="subtasks"]') as HTMLInputElement;
                                        if (input) input.value = JSON.stringify(subtasks);
                                    }}
                                    placeholder="Enter each step on a new line..."
                                    className="min-h-[80px] resize-none"
                                />
                                <input type="hidden" name="subtasks" defaultValue={JSON.stringify(task?.subtasks || [])} />
                            </div>
                        </div>
                    </ScrollArea>

                    <SheetFooter className="p-6 pt-4 border-t bg-slate-50/50">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-navy hover:bg-brand-navy/90">
                            {isEditing ? 'Update Task' : 'Create Task'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
