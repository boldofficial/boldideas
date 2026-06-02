'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, FileText, MessageSquare, Plus, UserPlus } from 'lucide-react';

const actions = [
  { label: 'Lead', href: '/admin/crm', icon: UserPlus },
  { label: 'Task', href: '/admin/tasks', icon: FileText },
  { label: 'Invoice', href: '/admin/finance', icon: Plus },
  { label: 'Calendar', href: '/admin/calendar', icon: Calendar },
  { label: 'Inbox', href: '/admin/messages', icon: MessageSquare },
];

export default function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="inline-flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-sm font-semibold text-brand-navy shadow-sm transition-colors hover:border-brand-gold hover:text-brand-gold"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}
