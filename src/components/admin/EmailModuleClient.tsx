'use client';

import { useMemo, useRef, useState, useTransition } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bold, Inbox, Italic, Link as LinkIcon, List, Mail, Paperclip, RefreshCw, Send, Settings, Trash2, Underline, UserRound, X } from 'lucide-react';
import { sendPortalEmail, syncZohoInbox } from '@/actions/email';
import { applyEmailTemplate, emailTemplates } from '@/lib/emailTemplates';

export type EmailMessage = {
    id: string;
    direction: string;
    status: string;
    mailbox: string;
    fromEmail: string | null;
    fromName: string | null;
    toEmails: string | null;
    subject: string | null;
    textBody: string | null;
    htmlBody: string | null;
    sentAt: Date | string | null;
    receivedAt: Date | string | null;
    leadId: string | null;
    clientId: string | null;
};

export type ConfigStatus = {
    email: string;
    smtpReady: boolean;
    imapReady: boolean;
    accountEmail: string;
    lastSyncedAt: Date | string | null;
};

type ActionResult = {
    success: boolean;
    error?: string;
    imported?: number;
    skipped?: number;
};

export default function EmailModuleClient({
    inbox,
    sent,
    config,
}: {
    inbox: EmailMessage[];
    sent: EmailMessage[];
    config: ConfigStatus;
}) {
    const searchParams = useSearchParams();
    const initialTo = searchParams.get('to') || '';
    const initialSubject = searchParams.get('subject') || '';
    const leadName = searchParams.get('leadName') || 'there';
    const serviceInterest = searchParams.get('serviceInterest') || 'your project';
    const editorRef = useRef<HTMLDivElement>(null);
    const [mailbox, setMailbox] = useState<'INBOX' | 'Sent'>('INBOX');
    const [selectedId, setSelectedId] = useState(inbox[0]?.id || sent[0]?.id || '');
    const [showCompose, setShowCompose] = useState(Boolean(initialTo));
    const [composeSubject, setComposeSubject] = useState(initialSubject);
    const [composerHtml, setComposerHtml] = useState('');
    const [composerText, setComposerText] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    const messages = mailbox === 'INBOX' ? inbox : sent;
    const selected = useMemo(() => {
        return [...inbox, ...sent].find((message) => message.id === selectedId) || messages[0] || null;
    }, [inbox, sent, messages, selectedId]);

    function handleSync() {
        setResult(null);
        startTransition(async () => {
            const response = await syncZohoInbox(40);
            setResult(response);
            if (response.success) window.location.reload();
        });
    }

    function handleSend(formData: FormData) {
        setResult(null);
        formData.set('bodyHtml', composerHtml);
        formData.set('body', composerText);
        attachments.forEach((file) => formData.append('attachments', file));
        startTransition(async () => {
            const response = await sendPortalEmail(formData);
            setResult(response);
            if (response.success) {
                setShowCompose(false);
                setComposerHtml('');
                setComposerText('');
                setAttachments([]);
                window.location.reload();
            }
        });
    }

    function updateComposer(element: HTMLElement | null) {
        if (!element) return;
        setComposerHtml(element.innerHTML);
        setComposerText(element.innerText.trim());
    }

    function applyTemplate(templateId: string) {
        const template = emailTemplates.find((item) => item.id === templateId);
        if (!template || !editorRef.current) return;
        const applied = applyEmailTemplate(template, { leadName, serviceInterest });
        setComposeSubject(applied.subject);
        editorRef.current.innerHTML = applied.body
            .split('\n')
            .map((line) => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<br>')
            .join('');
        updateComposer(editorRef.current);
    }

    function runFormat(command: string, value?: string) {
        document.execCommand(command, false, value);
    }

    function addAttachments(fileList: FileList | null) {
        if (!fileList) return;
        setAttachments((current) => {
            const next = [...current, ...Array.from(fileList)];
            return next.slice(0, 8);
        });
    }

    return (
        <div className="min-h-screen bg-[#f4f6f8] text-[13px] text-[#334155]">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#dce3ea] pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1f2937]">Email</h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <StatusChip label="SMTP" ready={config.smtpReady} />
                        <StatusChip label="IMAP" ready={config.imapReady} />
                        <span className="inline-flex h-7 items-center rounded-[5px] border border-[#d8e0e8] bg-white px-2.5 text-[12px] font-medium text-[#475569]">
                            {config.email || config.accountEmail || 'No sender configured'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowCompose(true)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-[#0f172a] px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1e293b]"
                    >
                        <Send className="h-4 w-4" />
                        Compose
                    </button>
                    <button
                        type="button"
                        onClick={handleSync}
                        disabled={isPending || !config.imapReady}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] font-semibold text-[#475569] shadow-sm transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                        Sync Inbox
                    </button>
                </div>
            </div>

            {result && (
                <div className={`mb-4 rounded-[4px] border px-4 py-3 text-sm ${result.success ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                    {result.success
                        ? `Done. Imported ${result.imported ?? 0}, skipped ${result.skipped ?? 0}.`
                        : result.error}
                </div>
            )}

            {!config.smtpReady || !config.imapReady ? (
                <div className="mb-4 rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                    Configure Zoho in Coolify with <strong>SMTP_HOST</strong>, <strong>SMTP_PORT</strong>, <strong>SMTP_USER</strong>, <strong>SMTP_PASS</strong>, <strong>FROM_EMAIL</strong>, <strong>IMAP_HOST</strong>, <strong>IMAP_PORT</strong>, <strong>IMAP_USER</strong>, and <strong>IMAP_PASS</strong>.
                </div>
            ) : null}

            <div className="grid min-h-[640px] overflow-hidden rounded-[4px] border border-[#dce3ea] bg-white shadow-sm xl:grid-cols-[210px_380px_minmax(0,1fr)]">
                <aside className="border-b border-[#e5eaf0] bg-[#f7f9fb] p-3 xl:border-b-0 xl:border-r">
                    <MailboxButton active={mailbox === 'INBOX'} icon={<Inbox className="h-4 w-4" />} label="Inbox" count={inbox.length} onClick={() => { setMailbox('INBOX'); setSelectedId(inbox[0]?.id || ''); }} />
                    <MailboxButton active={mailbox === 'Sent'} icon={<Send className="h-4 w-4" />} label="Sent" count={sent.length} onClick={() => { setMailbox('Sent'); setSelectedId(sent[0]?.id || ''); }} />
                    <div className="mt-4 rounded-[4px] border border-[#dce3ea] bg-white p-3 text-[12px] leading-5 text-[#64748b]">
                        <div className="mb-2 flex items-center gap-2 font-semibold text-[#334155]">
                            <Settings className="h-4 w-4" />
                            Zoho Mail
                        </div>
                        <p>Last sync: {config.lastSyncedAt ? new Date(config.lastSyncedAt).toLocaleString() : 'Not synced yet'}</p>
                    </div>
                </aside>

                <section className="border-b border-[#e5eaf0] xl:border-b-0 xl:border-r">
                    <div className="flex h-12 items-center justify-between border-b border-[#e5eaf0] px-4">
                        <p className="font-semibold text-[#334155]">{mailbox === 'INBOX' ? 'Inbox' : 'Sent Mail'}</p>
                        <span className="text-[12px] text-[#94a3b8]">{messages.length} messages</span>
                    </div>
                    <div className="max-h-[588px] overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="p-8 text-center text-[#94a3b8]">
                                <Mail className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                <p className="font-medium">No messages yet</p>
                            </div>
                        ) : messages.map((message) => (
                            <button
                                key={message.id}
                                type="button"
                                onClick={() => setSelectedId(message.id)}
                                className={`block w-full border-b border-[#edf1f5] px-4 py-3 text-left transition hover:bg-[#f8fafc] ${selected?.id === message.id ? 'border-l-4 border-l-[#0f172a] bg-[#f8fafc]' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="truncate font-semibold text-[#334155]">{message.direction === 'outbound' ? message.toEmails : message.fromName || message.fromEmail || 'Unknown sender'}</p>
                                    <span className="shrink-0 text-[11px] text-[#94a3b8]">{formatDate(message.receivedAt || message.sentAt)}</span>
                                </div>
                                <p className="mt-1 truncate text-[13px] font-medium text-[#475569]">{message.subject || '(No subject)'}</p>
                                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#64748b]">{message.textBody || stripHtml(message.htmlBody || '') || 'No preview available'}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <main className="flex min-h-[520px] flex-col">
                    {selected ? (
                        <>
                            <div className="border-b border-[#e5eaf0] px-5 py-4">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#1f2937]">{selected.subject || '(No subject)'}</h2>
                                        <p className="mt-1 text-[12px] text-[#64748b]">
                                            {selected.direction === 'outbound' ? `To: ${selected.toEmails}` : `From: ${selected.fromName || selected.fromEmail || 'Unknown'}`}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selected.leadId && <Link href={`/admin/crm/${selected.leadId}`} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[#d4dde6] bg-white px-2.5 text-[12px] font-semibold text-[#475569] hover:bg-[#f8fafc]"><UserRound className="h-3.5 w-3.5" /> Lead</Link>}
                                        <button
                                            type="button"
                                            onClick={() => setShowCompose(true)}
                                            className="inline-flex h-8 items-center gap-1.5 rounded-[4px] bg-[#0f172a] px-2.5 text-[12px] font-semibold text-white"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto bg-white p-5">
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[14px] leading-7 text-[#334155]">
                                    {selected.textBody || stripHtml(selected.htmlBody || '') || 'No readable content.'}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center text-[#94a3b8]">
                            <div className="text-center">
                                <Mail className="mx-auto mb-3 h-12 w-12 opacity-40" />
                                <p>Select a message</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showCompose && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0f172a]/55 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <form action={handleSend} className="flex h-[92vh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-[6px] sm:border sm:border-[#dce3ea]">
                        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#e5eaf0] bg-[#f7f9fb] px-4">
                            <div>
                                <p className="font-semibold text-[#334155]">Compose Email</p>
                                <p className="hidden text-[11px] text-[#94a3b8] sm:block">Rich text, attachments, cc and bcc supported</p>
                            </div>
                            <button type="button" onClick={() => setShowCompose(false)} className="text-[#94a3b8] hover:text-[#334155]">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-4">
                            <EmailInput label="To" name="to" defaultValue={selected?.direction === 'inbound' ? selected.fromEmail || initialTo : initialTo} required />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <EmailInput label="Cc" name="cc" />
                                <EmailInput label="Bcc" name="bcc" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[190px_minmax(0,1fr)]">
                                <label>
                                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">Template</span>
                                    <select onChange={(event) => applyTemplate(event.target.value)} defaultValue="" className="h-9 w-full rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] text-[#334155] outline-none focus:border-[#94a3b8]">
                                        <option value="">Choose template</option>
                                        {emailTemplates.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}
                                    </select>
                                </label>
                                <label>
                                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">Subject</span>
                                    <input name="subject" value={composeSubject || (selected ? `Re: ${selected.subject || ''}` : '')} onChange={(event) => setComposeSubject(event.target.value)} required className="h-9 w-full rounded-[4px] border border-[#d4dde6] px-3 text-[13px] text-[#334155] outline-none focus:border-[#94a3b8]" />
                                </label>
                            </div>
                            {selected?.leadId && <input type="hidden" name="leadId" value={selected.leadId} />}
                            {selected?.clientId && <input type="hidden" name="clientId" value={selected.clientId} />}
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">Message</label>
                                <input type="hidden" name="body" value={composerText} />
                                <input type="hidden" name="bodyHtml" value={composerHtml} />
                                <div className="overflow-hidden rounded-[4px] border border-[#d4dde6] bg-white">
                                    <div className="flex flex-wrap items-center gap-1 border-b border-[#e5eaf0] bg-[#f8fafc] p-2">
                                        <FormatButton title="Bold" onClick={() => runFormat('bold')} icon={<Bold className="h-4 w-4" />} />
                                        <FormatButton title="Italic" onClick={() => runFormat('italic')} icon={<Italic className="h-4 w-4" />} />
                                        <FormatButton title="Underline" onClick={() => runFormat('underline')} icon={<Underline className="h-4 w-4" />} />
                                        <span className="mx-1 h-5 w-px bg-[#dce3ea]" />
                                        <FormatButton title="Bulleted list" onClick={() => runFormat('insertUnorderedList')} icon={<List className="h-4 w-4" />} />
                                        <FormatButton
                                            title="Insert link"
                                            onClick={() => {
                                                const url = window.prompt('Paste link URL');
                                                if (url) runFormat('createLink', url);
                                            }}
                                            icon={<LinkIcon className="h-4 w-4" />}
                                        />
                                    </div>
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        role="textbox"
                                        aria-label="Email message"
                                        onInput={(event) => updateComposer(event.currentTarget)}
                                        onBlur={(event) => updateComposer(event.currentTarget)}
                                        className="min-h-[240px] max-h-[42vh] overflow-y-auto p-4 text-[14px] leading-7 text-[#334155] outline-none empty:before:text-[#94a3b8] empty:before:content-[attr(data-placeholder)] sm:min-h-[300px]"
                                        data-placeholder="Write your message..."
                                    />
                                </div>
                            </div>
                            <div className="rounded-[4px] border border-[#dce3ea] bg-[#f8fafc] p-3">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[12px] font-semibold text-[#334155]">Attachments</p>
                                        <p className="mt-1 text-[11px] text-[#64748b]">Up to 8 files, 10MB each. Documents, images and PDFs are supported.</p>
                                    </div>
                                    <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[12px] font-semibold text-[#475569] hover:bg-[#f8fafc]">
                                        <Paperclip className="h-4 w-4" />
                                        Attach files
                                        <input type="file" multiple className="hidden" onChange={(event) => addAttachments(event.target.files)} />
                                    </label>
                                </div>
                                {attachments.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {attachments.map((file, index) => (
                                            <span key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-[4px] border border-[#dce3ea] bg-white px-2.5 py-1.5 text-[12px] text-[#475569]">
                                                <Paperclip className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
                                                <span className="truncate">{file.name}</span>
                                                <span className="shrink-0 text-[#94a3b8]">{formatFileSize(file.size)}</span>
                                                <button type="button" onClick={() => setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="shrink-0 text-[#94a3b8] hover:text-rose-600">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#e5eaf0] bg-[#f7f9fb] px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
                            <button type="button" onClick={() => setShowCompose(false)} className="h-9 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] font-semibold text-[#475569]">Cancel</button>
                            <button disabled={isPending || !config.smtpReady} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-[#0f172a] px-3 text-[13px] font-semibold text-white disabled:opacity-50">
                                <Send className="h-4 w-4" />
                                {isPending ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function FormatButton({ title, icon, onClick }: { title: string; icon: ReactNode; onClick: () => void }) {
    return (
        <button type="button" title={title} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] text-[#64748b] hover:bg-white hover:text-[#334155]">
            {icon}
        </button>
    );
}

function MailboxButton({ active, icon, label, count, onClick }: { active: boolean; icon: ReactNode; label: string; count: number; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className={`mb-1 flex h-9 w-full items-center justify-between rounded-[4px] px-3 text-[13px] font-medium transition ${active ? 'bg-[#e9eef4] text-[#334155]' : 'text-[#64748b] hover:bg-white'}`}>
            <span className="flex items-center gap-2">{icon}{label}</span>
            <span className="text-[11px] text-[#94a3b8]">{count}</span>
        </button>
    );
}

function StatusChip({ label, ready }: { label: string; ready: boolean }) {
    return (
        <span className={`inline-flex h-7 items-center rounded-[5px] border px-2.5 text-[12px] font-medium ${ready ? 'border-[#d8ebc6] bg-[#fbfff6] text-[#65a30d]' : 'border-[#f5c2c7] bg-[#fff7f7] text-[#dc2626]'}`}>
            {label}: {ready ? 'Ready' : 'Missing'}
        </span>
    );
}

function EmailInput({ label, name, defaultValue = '', required = false }: { label: string; name: string; defaultValue?: string; required?: boolean }) {
    return (
        <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">{label}</label>
            <input
                name={name}
                defaultValue={defaultValue}
                required={required}
                className="h-9 w-full rounded-[4px] border border-[#d4dde6] px-3 text-[13px] text-[#334155] outline-none focus:border-[#94a3b8]"
            />
        </div>
    );
}

function formatDate(value: Date | string | null) {
    if (!value) return '';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatFileSize(size: number) {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

function escapeHtml(value: string) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
