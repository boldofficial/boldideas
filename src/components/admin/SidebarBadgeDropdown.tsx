'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
    getConversations,
} from '@/actions/directMessages';
import { getRecentOpenTickets } from '@/actions/tickets';
import { getRecentPendingInvoices } from '@/actions/finance';
import {
    MessageSquare,
    Ticket,
    DollarSign,
    Loader2,
    Mail,
    Clock,
    AlertTriangle,
    CheckCircle2,
    ArrowUp,
    ArrowDown,
    Minus,
    Zap,
    Inbox,
    ExternalLink,
} from 'lucide-react';

type BadgeKey = 'messages' | 'tickets' | 'invoices';

interface DropdownItem {
    id: string;
    title: string;
    subtitle?: string;
    meta?: string;
    status?: string;
    priority?: string;
    href: string;
}

interface Props {
    badgeKey: BadgeKey;
    count: number;
    collapsed: boolean;
    onNavigate?: () => void;
}

const BADGE_CONFIG: Record<BadgeKey, { label: string; icon: React.ComponentType<{ className?: string }>; baseHref: string }> = {
    messages: {
        label: 'Unread Messages',
        icon: MessageSquare,
        baseHref: '/admin/messages',
    },
    tickets: {
        label: 'Open Tickets',
        icon: Ticket,
        baseHref: '/admin/tickets',
    },
    invoices: {
        label: 'Pending Invoices',
        icon: DollarSign,
        baseHref: '/admin/finance',
    },
};

const STATUS_STYLES: Record<string, string> = {
    // Ticket statuses
    open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    awaiting_reply: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    on_hold: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    // Invoice statuses
    sent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
    // Priority
    urgent: 'bg-red-500/10 text-red-400',
    high: 'bg-orange-500/10 text-orange-400',
    medium: 'bg-blue-500/10 text-blue-400',
    low: 'bg-slate-500/10 text-slate-400',
};

function PriorityIcon({ priority }: { priority?: string }) {
    switch (priority) {
        case 'urgent': return <AlertTriangle className="w-3 h-3 text-red-400" />;
        case 'high': return <ArrowUp className="w-3 h-3 text-orange-400" />;
        case 'low': return <ArrowDown className="w-3 h-3 text-slate-400" />;
        default: return <Minus className="w-3 h-3 text-blue-400" />;
    }
}

function StatusBadge({ status }: { status?: string }) {
    const label = status?.replace(/_/g, ' ') || 'unknown';
    const style = STATUS_STYLES[status || ''] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    return (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${style}`}>
            {label}
        </span>
    );
}

export default function SidebarBadgeDropdown({ badgeKey, count, collapsed, onNavigate }: Props) {
    const { user } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<DropdownItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const config = BADGE_CONFIG[badgeKey];

    const fetchItems = useCallback(async () => {
        if (!user || fetched || loading) return;
        setLoading(true);
        try {
            let result: DropdownItem[] = [];

            if (badgeKey === 'messages') {
                const res = await getConversations(user.id);
                if (res.success && res.data) {
                    result = res.data
                        .filter((c: any) => c.unreadCount > 0)
                        .slice(0, 10)
                        .map((c: any) => ({
                            id: c.partnerId,
                            title: c.partnerName || c.partnerEmail || 'Unknown',
                            subtitle: c.lastMessage || '',
                            meta: c.lastMessageAt
                                ? formatRelativeTime(new Date(c.lastMessageAt))
                                : '',
                            href: '/admin/messages',
                        }));
                }
            } else if (badgeKey === 'tickets') {
                const res = await getRecentOpenTickets(10);
                if (res.success && res.data) {
                    result = res.data.map((t: any) => ({
                        id: t.id,
                        title: t.subject || '(No subject)',
                        subtitle: t.ticketNumber ? `#${t.ticketNumber}` : undefined,
                        status: t.status,
                        priority: t.priority,
                        meta: t.updatedAt ? formatRelativeTime(new Date(t.updatedAt)) : '',
                        href: `/admin/tickets/${t.id}`,
                    }));
                }
            } else if (badgeKey === 'invoices') {
                const res = await getRecentPendingInvoices(10);
                if (res.success && res.data) {
                    result = res.data.map((inv: any) => ({
                        id: inv.id,
                        title: inv.invoiceNumber || '(No number)',
                        subtitle: `${inv.currency || 'USD'} ${Number(inv.totalAmount || 0).toLocaleString()}`,
                        status: inv.status,
                        meta: inv.dueDate
                            ? `Due ${formatRelativeTime(new Date(inv.dueDate))}`
                            : undefined,
                        href: `/admin/finance/invoice/${inv.id}`,
                    }));
                }
            }

            setItems(result);
            setFetched(true);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [user, badgeKey, fetched, loading]);

    // Open/close handlers
    const handleBadgeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!open) {
            setFetched(false); // Allow re-fetch on re-open
            setItems([]);
        }
        setOpen(prev => !prev);
    };

    // Fetch when opening
    useEffect(() => {
        if (open && !fetched) {
            fetchItems();
        }
    }, [open, fetched, fetchItems]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Close on escape
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [open]);

    const handleItemClick = () => {
        setOpen(false);
        onNavigate?.();
    };

    if (count === 0) return null;

    const Icon = config.icon;

    return (
        <div ref={containerRef} className="relative">
            {/* Clickable badge */}
                <span
                    onClick={handleBadgeClick}
                    className={`
                        shrink-0 bg-red-500 text-white font-bold rounded-full
                        flex items-center justify-center cursor-pointer
                        transition-transform hover:scale-110 active:scale-95 pointer-events-auto
                        ${collapsed
                            ? 'absolute -top-1 -right-1 w-4 h-4 text-[9px]'
                            : 'ml-auto w-5 h-5 text-[10px]'
                        }
                    `}
                    title={`${count} ${config.label.toLowerCase()}`}
                >
                    {count > 9 ? '9+' : count}
                </span>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => setOpen(false)}
                    />

                    {/* Dropdown panel */}
                    <div
                        className={`
                            absolute z-[70] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]
                            border border-slate-200 overflow-hidden
                            animate-in fade-in zoom-in-95 duration-200
                            ${collapsed
                                ? 'left-full ml-3 top-0 w-80'
                                : 'left-0 top-full mt-1 w-80'
                            }
                        `}
                    >
                        {/* Header */}
                        <div className="bg-brand-navy p-4 flex items-center justify-between border-b-2 border-brand-gold">
                            <div className="flex items-center gap-2.5">
                                <Icon className="w-4 h-4 text-brand-gold" />
                                <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">
                                    {config.label}
                                </h3>
                            </div>
                            <span className="text-brand-gold text-[9px] font-bold">
                                {count} active
                            </span>
                        </div>

                        {/* List */}
                        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <div className="p-12 text-center">
                                    <Loader2 className="w-5 h-5 text-brand-gold animate-spin mx-auto mb-2" />
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Loading...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Inbox className="w-5 h-5 text-slate-200" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {badgeKey === 'messages'
                                            ? 'No unread messages'
                                            : badgeKey === 'tickets'
                                                ? 'No open tickets'
                                                : 'No pending invoices'}
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={handleItemClick}
                                        className="group p-3.5 hover:bg-slate-50 transition-all block"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Type icon */}
                                            <div className={`
                                                w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                                                transition-transform group-hover:scale-110
                                                ${badgeKey === 'messages'
                                                    ? 'bg-brand-gold/10 text-brand-gold'
                                                    : badgeKey === 'tickets'
                                                        ? item.priority === 'urgent'
                                                            ? 'bg-red-500/10 text-red-400'
                                                            : 'bg-brand-gold/10 text-brand-gold'
                                                        : item.status === 'overdue'
                                                            ? 'bg-red-500/10 text-red-400'
                                                            : 'bg-brand-gold/10 text-brand-gold'
                                                }
                                            `}>
                                                {badgeKey === 'messages' ? (
                                                    <Mail className="w-4 h-4" />
                                                ) : badgeKey === 'tickets' ? (
                                                    <Ticket className="w-4 h-4" />
                                                ) : (
                                                    <DollarSign className="w-4 h-4" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-[13px] font-bold text-brand-navy leading-tight truncate">
                                                        {item.title}
                                                    </p>
                                                    {item.meta && (
                                                        <span className="text-[9px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                                                            {item.meta}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.subtitle && (
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    {item.status && <StatusBadge status={item.status} />}
                                                    {item.priority && <PriorityIcon priority={item.priority} />}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <Link
                            href={config.baseHref}
                            onClick={handleItemClick}
                            className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-4 hover:bg-slate-100 transition-colors group"
                        >
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                {items.length > 0 ? `${items.length} showing` : 'View all'}
                            </span>
                            <span className="text-[9px] text-brand-navy font-black uppercase tracking-[0.1em] group-hover:text-brand-gold transition-colors flex items-center gap-1">
                                View All
                                <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
