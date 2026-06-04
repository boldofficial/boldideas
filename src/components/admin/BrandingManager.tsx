'use client'

import Image from 'next/image';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { getCompanySettings, updateCompanySettings, uploadCompanyAsset } from '@/actions/financeEnhancements';
import { AlertCircle, Building2, CheckCircle2, FileSignature, Globe, ImageIcon, Mail, MapPin, Phone, Save, Upload } from 'lucide-react';

type CompanySettings = {
    id?: string;
    companyName: string;
    companyAddress: string | null;
    companyEmail: string | null;
    companyPhone: string | null;
    companyWebsite: string | null;
    logoUrl: string | null;
    signatureUrl: string | null;
};

const emptySettings: CompanySettings = {
    companyName: 'Bold Ideas',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    logoUrl: '',
    signatureUrl: '',
};

export default function BrandingManager() {
    const [settings, setSettings] = useState<CompanySettings>(emptySettings);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [brokenImages, setBrokenImages] = useState({ logo: false, signature: false });

    const loadSettings = useCallback(async () => {
        const res = await getCompanySettings();
        if (res.success && res.data) {
            setSettings({
                companyName: res.data.companyName || 'Bold Ideas',
                companyAddress: res.data.companyAddress || '',
                companyEmail: res.data.companyEmail || '',
                companyPhone: res.data.companyPhone || '',
                companyWebsite: res.data.companyWebsite || '',
                logoUrl: res.data.logoUrl || '',
                signatureUrl: res.data.signatureUrl || '',
            });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSettings();
    }, [loadSettings]);

    function updateField<Key extends keyof CompanySettings>(key: Key, value: CompanySettings[Key]) {
        setSettings((current) => ({ ...current, [key]: value }));
    }

    function handleSave(event: FormEvent) {
        event.preventDefault();
        setMessage(null);
        startTransition(async () => {
            const res = await updateCompanySettings(settings);
            setMessage(res.success
                ? { type: 'success', text: 'Branding settings saved across the application.' }
                : { type: 'error', text: res.error || 'Failed to update branding.' });
        });
    }

    function handleUpload(type: 'logo' | 'signature', file: File | null) {
        if (!file) return;
        setMessage(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.set('file', file);
            formData.set('type', type);
            const res = await uploadCompanyAsset(formData);
            if (res.success && res.url) {
                updateField(type === 'logo' ? 'logoUrl' : 'signatureUrl', res.url);
                setBrokenImages((current) => ({ ...current, [type]: false }));
                setMessage({ type: 'success', text: `${type === 'logo' ? 'Logo' : 'Signature'} uploaded. Save settings to publish it everywhere.` });
            } else {
                setMessage({ type: 'error', text: res.error || 'Upload failed.' });
            }
        });
    }

    if (loading) {
        return <div className="rounded-sm border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">Loading brand settings...</div>;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1f2937]">Organization Branding</h2>
                    <p className="mt-1 text-sm text-slate-500">Company identity used by invoices, email templates, receipts, and portal surfaces.</p>
                </div>
                <div className="rounded-[4px] border border-[#dce3ea] bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                    Assets are saved as public upload URLs, not database blobs.
                </div>
            </div>

            {message && (
                <div className={`flex items-center gap-2 rounded-[4px] border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <section className="rounded-[4px] border border-[#dce3ea] bg-white shadow-sm">
                    <div className="border-b border-[#e5eaf0] px-5 py-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                            <Building2 className="h-4 w-4 text-brand-gold" />
                            Company Details
                        </h3>
                    </div>
                    <div className="grid gap-4 p-5 md:grid-cols-2">
                        <Field label="Company Name" value={settings.companyName} onChange={(value) => updateField('companyName', value)} />
                        <Field label="Website" value={settings.companyWebsite || ''} onChange={(value) => updateField('companyWebsite', value)} icon={<Globe className="h-4 w-4" />} />
                        <Field label="Email" type="email" value={settings.companyEmail || ''} onChange={(value) => updateField('companyEmail', value)} icon={<Mail className="h-4 w-4" />} />
                        <Field label="Phone" value={settings.companyPhone || ''} onChange={(value) => updateField('companyPhone', value)} icon={<Phone className="h-4 w-4" />} />
                        <div className="md:col-span-2">
                            <Field label="Business Address" value={settings.companyAddress || ''} onChange={(value) => updateField('companyAddress', value)} icon={<MapPin className="h-4 w-4" />} />
                        </div>
                    </div>
                </section>

                <section className="space-y-5">
                    <AssetUploader
                        label="Company Logo"
                        helper="PNG, JPG, SVG, or WebP. Recommended transparent background."
                        url={settings.logoUrl || ''}
                        broken={brokenImages.logo}
                        icon={<ImageIcon className="h-8 w-8 text-slate-300" />}
                        onUpload={(file) => handleUpload('logo', file)}
                        onBroken={() => setBrokenImages((current) => ({ ...current, logo: true }))}
                    />
                    <AssetUploader
                        label="Digital Signature"
                        helper="Best as transparent PNG for invoice and receipt signatures."
                        url={settings.signatureUrl || ''}
                        broken={brokenImages.signature}
                        icon={<FileSignature className="h-8 w-8 text-slate-300" />}
                        onUpload={(file) => handleUpload('signature', file)}
                        onBroken={() => setBrokenImages((current) => ({ ...current, signature: true }))}
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-brand-navy px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-brand-gold hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isPending ? 'Saving...' : 'Save Brand Settings'}
                    </button>
                </section>
            </form>
        </div>
    );
}

function Field({ label, value, onChange, type = 'text', icon }: { label: string; value: string; onChange: (value: string) => void; type?: string; icon?: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">{label}</span>
            <span className="relative block">
                {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={`h-10 w-full rounded-[4px] border border-[#d4dde6] bg-white px-3 text-sm text-[#334155] outline-none transition focus:border-[#94a3b8] ${icon ? 'pl-10' : ''}`}
                />
            </span>
        </label>
    );
}

function AssetUploader({
    label,
    helper,
    url,
    broken,
    icon,
    onUpload,
    onBroken,
}: {
    label: string;
    helper: string;
    url: string;
    broken: boolean;
    icon: ReactNode;
    onUpload: (file: File | null) => void;
    onBroken: () => void;
}) {
    return (
        <div className="rounded-[4px] border border-[#dce3ea] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-[#334155]">{label}</p>
                    <p className="mt-1 text-[12px] leading-5 text-[#64748b]">{helper}</p>
                </div>
                <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[12px] font-semibold text-[#475569] hover:bg-[#f8fafc]">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input className="hidden" type="file" accept="image/*" onChange={(event) => onUpload(event.target.files?.[0] || null)} />
                </label>
            </div>
            <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-[4px] border border-dashed border-[#d4dde6] bg-[#f8fafc]">
                {url && !broken ? (
                    <Image src={url} alt={label} fill className="object-contain p-4" onError={onBroken} unoptimized />
                ) : (
                    <div className="text-center">
                        <div className="mb-2 flex justify-center">{icon}</div>
                        <p className="text-[12px] font-medium text-slate-400">{url && broken ? 'Image path is broken. Upload again.' : 'No asset uploaded'}</p>
                    </div>
                )}
            </div>
            {url && <p className="mt-2 truncate font-mono text-[11px] text-slate-400">{url}</p>}
        </div>
    );
}
