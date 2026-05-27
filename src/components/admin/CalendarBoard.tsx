'use client';

import React, { useState } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flag, CheckCircle2, Clock,
    ExternalLink
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CalendarItem {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    status: string;
    priority: string | null;
    projectId: string | null;
    itemType: 'task' | 'milestone';
}

export default function CalendarBoard({ initialData }: { initialData: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    const days = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
        days.push(i);
    }

    const getItemsForDay = (day: number) => {
        return initialData.filter(item => {
            if (!item.dueDate) return false;
            const date = new Date(item.dueDate);
            return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
        });
    };

    const getItemColor = (item: any) => {
        if (item.status === 'done' || item.status === 'completed') return 'bg-green-50 text-green-700 border-green-200';
        if (item.itemType === 'milestone') return 'bg-purple-50 text-purple-700 border-purple-200';
        return 'bg-blue-50 text-blue-700 border-blue-200';
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-navy text-brand-gold rounded-lg shadow-sm">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-brand-navy">
                            {monthNames[month]} {year}
                        </h2>
                        <p className="text-xs text-slate-400">Tasks and milestones</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full transition-colors border border-slate-200">
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full transition-colors border border-slate-200">
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-3 text-xs font-medium text-slate-400 text-center border-r border-slate-100 last:border-0">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 border-slate-100 bg-slate-50/20">
                {days.map((day, idx) => (
                    <div key={idx} className={`min-h-[140px] p-2 border-r border-b border-slate-100 group transition-colors ${day ? 'bg-white hover:bg-slate-50/30' : 'bg-slate-50/10'}`}>
                        {day && (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-black ${new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
                                        ? 'bg-brand-gold text-brand-navy w-6 h-6 rounded-full flex items-center justify-center'
                                        : 'text-slate-400'
                                        }`}>
                                        {day.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {getItemsForDay(day).map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedItem(item as CalendarItem)}
                                            className={`p-1.5 rounded border text-[10px] font-bold leading-tight truncate flex items-center gap-1 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all ${getItemColor(item)}`}
                                        >
                                            {item.itemType === 'milestone' ? <Flag className="w-3 h-3 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
                                            <span className="truncate">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-50 flex gap-6 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Tasks
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Milestones
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Completed
                </div>
            </div>

            {/* Item Detail Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-lg max-h-[90vh] p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={selectedItem?.itemType === 'milestone' ? 'secondary' : 'default'}>
                                {selectedItem?.itemType === 'milestone' ? 'Milestone' : 'Task'}
                            </Badge>
                            {selectedItem?.priority && selectedItem?.itemType === 'task' && (
                                <Badge variant={
                                    selectedItem.priority === 'urgent' ? 'destructive' :
                                    selectedItem.priority === 'high' ? 'secondary' :
                                    'outline'
                                }>
                                    {selectedItem.priority}
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {selectedItem?.status?.replace('_', ' ') || 'Todo'}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-brand-navy">
                                {selectedItem?.title}
                            </DialogTitle>
                        </div>
                        {selectedItem?.dueDate && (
                            <DialogDescription className="flex items-center gap-1.5 mt-1">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                Due: {new Date(selectedItem.dueDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Description</h4>
                            <div className="p-4 bg-slate-50 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedItem?.description || 'No description provided.'}
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl border">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                                <p className="text-sm font-semibold capitalize">
                                    {selectedItem?.status?.replace('_', ' ') || 'Todo'}
                                </p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Type</p>
                                <p className="text-sm font-semibold capitalize">
                                    {selectedItem?.itemType === 'milestone' ? 'Milestone' : 'Task'}
                                </p>
                            </div>
                        </div>

                        {/* Notes for booking tasks */}
                        {selectedItem?.description && selectedItem.description.startsWith('Booking from') && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">💡 Booking Note</p>
                                <p className="text-xs text-amber-700">
                                    This is a strategy call booking from the website. Check the CRM for the full lead details.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 border-t bg-slate-50/50 flex items-center justify-between">
                        <div className="flex gap-2">
                            {selectedItem?.itemType === 'task' && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/tasks`}>
                                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                        View in Tasks
                                    </Link>
                                </Button>
                            )}
                            {selectedItem?.projectId && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/projects/${selectedItem.projectId}`}>
                                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                        View Project
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <Button size="sm" onClick={() => setSelectedItem(null)} className="bg-brand-navy hover:bg-brand-navy/90">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
