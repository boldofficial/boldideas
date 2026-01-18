'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flag, CheckCircle2, Clock } from 'lucide-react';

interface CalendarItem {
    id: string;
    title: string;
    dueDate: Date | null;
    status: string;
    itemType: 'task' | 'milestone';
}

export default function CalendarBoard({ initialData }: { initialData: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

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
                                        <div key={item.id} className={`p-1.5 rounded border text-[10px] font-bold leading-tight truncate flex items-center gap-1 cursor-pointer hover:shadow-sm transition-all ${getItemColor(item)}`}>
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
        </div>
    );
}
