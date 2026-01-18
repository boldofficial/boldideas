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
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="bg-brand-navy p-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-brand-gold text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400 text-xs">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs font-mono uppercase">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.slice(0, 10).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-brand-gold/5 border-l-4 border-l-brand-gold' : ''
                                            }`}
                                        onClick={() => handleMarkRead(notification.id)}
                                    >
                                        {notification.link ? (
                                            <Link href={notification.link} onClick={() => setIsOpen(false)}>
                                                <div className="flex gap-3">
                                                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${!notification.isRead ? 'font-bold text-brand-navy' : 'text-slate-600'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {notification.message && (
                                                            <p className="text-xs text-slate-400 truncate mt-1">
                                                                {notification.message}
                                                            </p>
                                                        )}
                                                        <p className="text-[10px] text-slate-300 mt-2 font-mono">
                                                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex gap-3">
                                                <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notification.isRead ? 'font-bold text-brand-navy' : 'text-slate-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {notification.message && (
                                                        <p className="text-xs text-slate-400 truncate mt-1">
                                                            {notification.message}
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] text-slate-300 mt-2 font-mono">
                                                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 10 && (
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                <span className="text-xs text-slate-400">
                                    Showing 10 of {notifications.length} notifications
                                </span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
