'use client';

import { useRef, useState, useTransition } from 'react';
import { Bold, Italic, Link as LinkIcon, List, Paperclip, Send, Trash2, Underline, X } from 'lucide-react';
import { sendPortalEmail } from '@/actions/email';
import { applyEmailTemplate, emailTemplates } from '@/lib/emailTemplates';

export default function LeadEmailComposer({
    leadId,
    leadEmail,
    leadName,
    serviceInterest,
    initialSubject = '',
    mode = 'new',
    onClose,
}: {
    leadId: string;
    leadEmail: string;
    leadName: string;
    serviceInterest?: string | null;
    initialSubject?: string;
    mode?: 'new' | 'reply';
    onClose?: () => void;
}) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [subject, setSubject] = useState(initialSubject || `Following up with ${leadName}`);
    const [bodyHtml, setBodyHtml] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    function updateEditor() {
        const editor = editorRef.current;
        if (!editor) return;
        setBodyHtml(editor.innerHTML);
        setBodyText(editor.innerText.trim());
    }

    function format(command: string, value?: string) {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        updateEditor();
    }

    function applyTemplate(templateId: string) {
        const template = emailTemplates.find((item) => item.id === templateId);
        if (!template || !editorRef.current) return;
        const applied = applyEmailTemplate(template, {
            leadName,
            serviceInterest: serviceInterest || 'your project',
        });
        setSubject(applied.subject);
        editorRef.current.innerHTML = applied.body
            .split('\n')
            .map((line) => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<br>')
            .join('');
        updateEditor();
    }

    function addAttachments(files: FileList | null) {
        if (!files) return;
        setAttachments((current) => [...current, ...Array.from(files)].slice(0, 8));
    }

    function handleSubmit(formData: FormData) {
        setMessage(null);
        updateEditor();
        formData.set('to', leadEmail);
        formData.set('subject', subject);
        formData.set('leadId', leadId);
        formData.set('bodyHtml', bodyHtml);
        formData.set('body', bodyText);
        attachments.forEach((file) => formData.append('attachments', file));

        startTransition(async () => {
            const response = await sendPortalEmail(formData);
            if (response.success) {
                setMessage({ type: 'success', text: 'Email sent and logged to this lead.' });
                setAttachments([]);
                if (editorRef.current) editorRef.current.innerHTML = '';
                setBodyHtml('');
                setBodyText('');
                setTimeout(() => window.location.reload(), 800);
            } else {
                setMessage({ type: 'error', text: response.error || 'Failed to send email.' });
            }
        });
    }

    return (
        <form action={handleSubmit} className="rounded-sm border border-brand-gold/30 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-gold">{mode === 'reply' ? 'Reply from CRM' : 'Send from CRM'}</p>
                    <p className="mt-1 text-sm font-black text-brand-navy">To {leadEmail}</p>
                </div>
                {onClose && (
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="grid gap-3 p-4">
                <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                    <label>
                        <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Template</span>
                        <select onChange={(event) => applyTemplate(event.target.value)} defaultValue="" className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-navy">
                            <option value="">Choose template</option>
                            {emailTemplates.map((template) => (
                                <option key={template.id} value={template.id}>{template.label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Subject</span>
                        <input value={subject} onChange={(event) => setSubject(event.target.value)} className="h-10 w-full rounded-sm border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-brand-navy" />
                    </label>
                </div>

                <input type="hidden" name="to" value={leadEmail} />
                <input type="hidden" name="subject" value={subject} />
                <input type="hidden" name="leadId" value={leadId} />
                <input type="hidden" name="body" value={bodyText} />
                <input type="hidden" name="bodyHtml" value={bodyHtml} />

                <div className="overflow-hidden rounded-sm border border-slate-200">
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 p-2">
                        <ToolbarButton label="Bold" onClick={() => format('bold')} icon={<Bold className="h-4 w-4" />} />
                        <ToolbarButton label="Italic" onClick={() => format('italic')} icon={<Italic className="h-4 w-4" />} />
                        <ToolbarButton label="Underline" onClick={() => format('underline')} icon={<Underline className="h-4 w-4" />} />
                        <ToolbarButton label="List" onClick={() => format('insertUnorderedList')} icon={<List className="h-4 w-4" />} />
                        <ToolbarButton
                            label="Link"
                            onClick={() => {
                                const url = window.prompt('Paste link URL');
                                if (url) format('createLink', url);
                            }}
                            icon={<LinkIcon className="h-4 w-4" />}
                        />
                    </div>
                    <div
                        ref={editorRef}
                        contentEditable
                        role="textbox"
                        aria-label="Lead email message"
                        onInput={updateEditor}
                        onBlur={updateEditor}
                        data-placeholder="Write your message..."
                        className="min-h-[220px] p-4 text-sm leading-7 text-slate-700 outline-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)]"
                    />
                </div>

                <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-bold text-slate-500">Attach documents, proposals, PDFs, or images.</p>
                        <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-slate-200 bg-white px-3 text-xs font-black uppercase tracking-[0.12em] text-slate-600 hover:border-brand-gold">
                            <Paperclip className="h-4 w-4" />
                            Attach
                            <input type="file" multiple className="hidden" onChange={(event) => addAttachments(event.target.files)} />
                        </label>
                    </div>
                    {attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                                <span key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-sm border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
                                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    <span className="truncate">{file.name}</span>
                                    <button type="button" onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-slate-400 hover:text-rose-600">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`rounded-sm border px-3 py-2 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end">
                    <button disabled={isPending || !subject.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-brand-navy px-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand-gold hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-50">
                        <Send className="h-4 w-4" />
                        {isPending ? 'Sending...' : 'Send Email'}
                    </button>
                </div>
            </div>
        </form>
    );
}

function ToolbarButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
    return (
        <button type="button" title={label} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-slate-500 hover:bg-white hover:text-brand-navy">
            {icon}
        </button>
    );
}

function escapeHtml(value: string) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
