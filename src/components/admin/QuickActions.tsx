'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, UserPlus, FileText, Calendar, MessageSquare } from 'lucide-react';

const actions = [
  {
    label: 'Add Lead',
    href: '/admin/crm',
    icon: UserPlus,
    color: 'text-blue-600',
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200',
  },
  {
    label: 'Create Task',
    href: '/admin/tasks',
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-purple-50 hover:bg-purple-100',
    border: 'border-purple-200',
  },
  {
    label: 'New Invoice',
    href: '/admin/finance',
    icon: Plus,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    border: 'border-emerald-200',
  },
  {
    label: 'View Calendar',
    href: '/admin/calendar',
    icon: Calendar,
    color: 'text-amber-600',
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-200',
  },
  {
    label: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
    color: 'text-rose-600',
    bg: 'bg-rose-50 hover:bg-rose-100',
    border: 'border-rose-200',
  },
];

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border ${action.bg} ${action.border} ${action.color} text-sm font-medium transition-all hover:shadow-sm active:scale-[0.97]`}
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}
