import React from 'react';
import CalendarBoard from "@/components/admin/CalendarBoard";
import { getCalendarData } from "@/actions/calendar";

export const metadata = {
    title: "Calendar | Bold Ideas",
};

export default async function AdminCalendarPage() {
    const now = new Date();
    const { data: calendarData } = await getCalendarData(now.getMonth(), now.getFullYear());

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Calendar</h1>
                    <p className="text-slate-500 text-sm mt-2">View upcoming deadlines and milestones</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium">Live</span>
                </div>
            </header>

            <CalendarBoard initialData={calendarData || []} />
        </div>
    );
}
