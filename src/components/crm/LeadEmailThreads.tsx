'use client';

import { useState } from 'react';
import { Mail, Paperclip, Reply, Send, UserRound } from 'lucide-react';
import LeadEmailComposer from './LeadEmailComposer';

type LeadEmailMessage = {
    id: string;
    direction: string;
    status: string;
    mailbox: string;
    fromEmail: string | null;
    fromName: string | null;
    toEmails: string | null;
    ccEmails: string | null;
    bccEmails: string | null;
    subject: string | null;
    textBody: string | null;
    htmlBody: string | null;
    threadKey: string | null;
    sentAt: Date | string | null;
    receivedAt: Date | string | null;
    createdAt: Date | string | null;
    metadata: unknown;
};

type Thread = {
    key: string;
    subject: string;
    messages: LeadEmailMessage[];
    latestAt: Date | string | null;
};

export default function LeadEmailThreads({
    leadEmail,
    displayName,
    messages,
    leadId,
    serviceInterest,
}: {
    leadId: string;
    leadEmail: string | null;
    displayName: string;
    serviceInterest?: string | null;
    messages: LeadEmailMessage[];
}) {
    const [composer, setComposer] = useState<{ mode: 'new' | 'reply'; subject?: string } | null>(null);
    const threads = groupThreads(messages);
    const totalInbound = messages.filter((message) => message.direction === 'inbound').length;
    const totalOutbound = messages.filter((message) => message.direction === 'outbound').length;

    return (
        <section className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">Email</p>
                    <h2 className="mt-1 text-lg font-black text-brand-navy">Conversation history</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {threads.length} thread{threads.length === 1 ? '' : 's'} / {totalInbound} received / {totalOutbound} sent
                    </p>
                </div>
                {leadEmail ? (
                    <button type="button" onClick={() => setComposer({ mode: 'new', subject: `Following up with ${displayName}` })} className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-brand-navy px-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand-gold hover:text-brand-navy">
                        <Send className="h-4 w-4" />
                        New Email
                    </button>
                ) : (
                    <span className="inline-flex h-10 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 px-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Add email first
                    </span>
                )}
            </div>

            {composer && leadEmail && (
                <div className="border-b border-slate-100 p-5">
                    <LeadEmailComposer
                        leadId={leadId}
                        leadEmail={leadEmail}
                        leadName={displayName}
                        serviceInterest={serviceInterest}
                        mode={composer.mode}
                        initialSubject={composer.subject || `Following up with ${displayName}`}
                        onClose={() => setComposer(null)}
                    />
                </div>
            )}

            {threads.length === 0 ? (
                <div className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                        <Mail className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-black text-brand-navy">No linked emails yet</p>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Emails sent to or received from this lead will appear here once they are linked by email address.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {threads.map((thread) => (
                        <article key={thread.key} className="p-5">
                            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-brand-navy">{thread.subject}</h3>
                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                        {thread.messages.length} message{thread.messages.length === 1 ? '' : 's'} / latest {formatDateTime(thread.latestAt)}
                                    </p>
                                </div>
                                {leadEmail && (
                                    <button type="button" onClick={() => setComposer({ mode: 'reply', subject: `Re: ${thread.subject}` })} className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600 transition hover:border-brand-gold hover:bg-white">
                                        <Reply className="h-3.5 w-3.5" />
                                        Reply
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {thread.messages.map((message) => {
                                    const outbound = message.direction === 'outbound';
                                    const attachments = getAttachmentCount(message.metadata);
                                    return (
                                        <div key={message.id} className={`flex ${outbound ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[92%] rounded-sm border p-4 shadow-sm md:max-w-[78%] ${outbound ? 'border-brand-navy/10 bg-brand-navy text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                                                <div className="mb-3 flex items-start justify-between gap-4">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${outbound ? 'bg-white/10 text-brand-gold' : 'bg-white text-slate-400'}`}>
                                                            {outbound ? <Send className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-black uppercase tracking-[0.12em]">{outbound ? 'Sent' : (message.fromName || message.fromEmail || 'Received')}</p>
                                                            <p className={`mt-0.5 truncate text-[11px] ${outbound ? 'text-white/60' : 'text-slate-400'}`}>
                                                                {outbound ? `To ${message.toEmails || leadEmail || 'recipient'}` : message.fromEmail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`shrink-0 text-[11px] ${outbound ? 'text-white/55' : 'text-slate-400'}`}>{formatDateTime(message.sentAt || message.receivedAt || message.createdAt)}</span>
                                                </div>
                                                <div className={`whitespace-pre-wrap text-sm leading-6 ${outbound ? 'text-white/90' : 'text-slate-700'}`}>
                                                    {previewBody(message)}
                                                </div>
                                                {attachments > 0 && (
                                                    <div className={`mt-3 inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-bold ${outbound ? 'border-white/15 bg-white/10 text-white/75' : 'border-slate-200 bg-white text-slate-500'}`}>
                                                        <Paperclip className="h-3.5 w-3.5" />
                                                        {attachments} attachment{attachments === 1 ? '' : 's'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

function groupThreads(messages: LeadEmailMessage[]) {
    const map = new Map<string, Thread>();
    for (const message of messages) {
        const subject = normalizeSubject(message.subject || '(No subject)');
        const key = message.threadKey || subject;
        const current = map.get(key);
        const date = message.receivedAt || message.sentAt || message.createdAt;

        if (!current) {
            map.set(key, {
                key,
                subject,
                messages: [message],
                latestAt: date,
            });
        } else {
            current.messages.push(message);
            if (date && (!current.latestAt || new Date(date).getTime() > new Date(current.latestAt).getTime())) {
                current.latestAt = date;
            }
        }
    }

    return Array.from(map.values())
        .map((thread) => ({
            ...thread,
            messages: thread.messages.sort((a, b) => dateValue(a.receivedAt || a.sentAt || a.createdAt) - dateValue(b.receivedAt || b.sentAt || b.createdAt)),
        }))
        .sort((a, b) => dateValue(b.latestAt) - dateValue(a.latestAt));
}

function normalizeSubject(subject: string) {
    return subject.replace(/^(re|fw|fwd):\s*/i, '').trim() || '(No subject)';
}

function previewBody(message: LeadEmailMessage) {
    const text = message.textBody || stripHtml(message.htmlBody || '');
    return text || 'No readable content.';
}

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function dateValue(value: Date | string | null) {
    return value ? new Date(value).getTime() : 0;
}

function formatDateTime(value: Date | string | null) {
    if (!value) return 'unknown';
    return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function getAttachmentCount(metadata: unknown) {
    if (!metadata || typeof metadata !== 'object' || !('attachments' in metadata)) return 0;
    const attachments = (metadata as { attachments?: unknown }).attachments;
    return Array.isArray(attachments) ? attachments.length : 0;
}
