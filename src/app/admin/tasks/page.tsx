import { getProjectTasks } from '@/actions/pm';
import { getAllUsers } from '@/actions/members';
import TaskBoard from '@/components/admin/TaskBoard';
import { Terminal } from 'lucide-react';

export const metadata = {
    title: "Mission Directives | Bold Ideas",
};

export default async function TasksPage() {
    // Force Fetch all tasks (passing null for project)
    const { data: tasks } = await getProjectTasks('null');
    const { data: users } = await getAllUsers();

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight italic">Mission Directives</h1>
                    <p className="text-slate-500 font-mono text-xs mt-2">Central_Control_Matrix</p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    <Terminal className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Signal_Lock_Active</span>
                </div>
            </header>

            <TaskBoard initialTasks={tasks || []} users={users || []} />
        </div>
    );
}

