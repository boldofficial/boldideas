'use client';

import { useState, useEffect } from 'react';
import { createInternalProject } from '@/actions/agency';
import { getUsers, getClientUsers } from '@/actions/team';

export default function CreateProjectModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [projectType, setProjectType] = useState<string>('internal');

    useEffect(() => {
        if (isOpen) {
            getUsers().then(({ data }) => setUsers(data || []));
            getClientUsers().then(({ data }) => setClients(data || []));
            setSelectedMembers([]); // Reset on open
            setProjectType('internal');
        }
    }, [isOpen]);

    const toggleMember = (userId: string) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-brand-navy text-white px-4 py-2 rounded text-sm font-bold shadow hover:bg-brand-gold transition-colors"
            >
                New Project
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-brand-navy">Create New Project</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form action={async (formData) => {
                            await createInternalProject(formData);
                            setIsOpen(false);
                        }} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <input type="hidden" name="memberIds" value={JSON.stringify(selectedMembers)} />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Title</label>
                                    <input name="title" placeholder="e.g. Website Redesign" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none" required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                                    <select name="status" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none">
                                        <option value="planning">Planning</option>
                                        <option value="active">Active</option>
                                        <option value="on_hold">On Hold</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                                    <select 
                                        name="type" 
                                        value={projectType}
                                        onChange={(e) => setProjectType(e.target.value)}
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none"
                                    >
                                        <option value="internal">Internal Project</option>
                                        <option value="client">Client Project</option>
                                    </select>
                                </div>

                                {projectType === 'client' && (
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign to Client</label>
                                        <select name="clientId" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none">
                                            <option value="none">Select a client...</option>
                                            {clients.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name || c.email}</option>
                                            ))}
                                        </select>
                                        {clients.length === 0 && (
                                            <p className="text-xs text-amber-600 mt-1">No clients found. Add users with 'client' role in Team settings.</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                    <input name="startDate" type="date" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                                    <input name="dueDate" type="date" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Manager (Owner)</label>
                                    <select name="managerId" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none">
                                        <option value="unassigned">Unassigned</option>
                                        {users.map((u: any) => (
                                            <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Team Members (Access & Visibility)</label>
                                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                                        <div className="flex flex-wrap gap-2">
                                            {users.length > 0 ? users.map((u: any) => (
                                                <button
                                                    key={u.id}
                                                    type="button"
                                                    onClick={() => toggleMember(u.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-2 ${selectedMembers.includes(u.id)
                                                            ? 'bg-brand-navy text-white border-brand-navy'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-brand-navy'
                                                        }`}
                                                >
                                                    {selectedMembers.includes(u.id) && (
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    )}
                                                    {u.name || u.email}
                                                </button>
                                            )) : (
                                                <div className="text-slate-400 text-xs italic">Loading staff...</div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2">Selected members will be added to the project team.</p>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Budget</label>
                                    <input name="budget" placeholder="e.g. $5,000" className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                    <textarea name="description" placeholder="Project goals and details..." rows={4} className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy outline-none"></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-2 border-t border-slate-100">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded text-sm font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-brand-navy text-white rounded text-sm font-bold hover:bg-brand-gold transition-colors">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
