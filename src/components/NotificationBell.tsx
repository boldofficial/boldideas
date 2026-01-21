'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount } from '@/actions/notifications';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    isRead: boolean | null;
    createdAt: Date | null;
}

export default function NotificationBell() {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        const { data } = await getNotifications(user.id);
        setNotifications(data || []);
        setUnreadCount(data?.filter((n: Notification) => !n.isRead).length || 0);
        setLoading(false);
    };

    const fetchUnreadCount = async () => {
        if (!user) return;
        const { count } = await getUnreadCount(user.id);
        setUnreadCount(count || 0);
    };

    const handleMarkRead = async (notificationId: string) => {
        await markNotificationRead(notificationId);
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        await markAllNotificationsRead(user.id);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'task_assigned': return '📋';
            case 'project_update': return '📁';
            case 'message': return '💬';
            case 'announcement': return '📢';
            default: return '🔔';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-brand-gold transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute left-0 top-full mt-4 w-80 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        {/* Header */}
                        <div className="bg-brand-navy p-4 flex justify-between items-center border-b-2 border-brand-gold">
                            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-brand-gold text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5"
                                >
                                    <Check className="w-3 h-3" /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <div className="p-12 text-center">
                                    <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scanning...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-5 h-5 text-slate-200" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        No active transmissions
                                    </p>
                                </div>
                            ) : (
                                notifications.slice(0, 10).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`group p-4 hover:bg-slate-50 transition-all cursor-pointer relative ${!notification.isRead ? 'bg-brand-gold/5' : ''
                                            }`}
                                        onClick={() => handleMarkRead(notification.id)}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold"></div>
                                        )}
                                        
                                        {notification.link ? (
                                            <Link href={notification.link} onClick={() => setIsOpen(false)}>
                                                <div className="flex gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                                                        !notification.isRead ? 'bg-brand-navy text-brand-gold' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                        <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[13px] leading-tight mb-1 ${!notification.isRead ? 'font-bold text-brand-navy' : 'text-slate-600 font-medium'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {notification.message && (
                                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                                {notification.message}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
                                                                {notification.createdAt ? new Date(notification.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}
                                                            </p>
                                                            {!notification.isRead && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                                        !notification.isRead ? 'bg-brand-navy text-brand-gold' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[13px] leading-tight mb-1 ${!notification.isRead ? 'font-bold text-brand-navy' : 'text-slate-600 font-medium'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {notification.message && (
                                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                            {notification.message}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
                                                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-between px-4">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                {notifications.length} Total
                            </span>
                            <button className="text-[9px] text-brand-navy font-black uppercase tracking-[0.1em] hover:text-brand-gold transition-colors">
                                View Archive
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
