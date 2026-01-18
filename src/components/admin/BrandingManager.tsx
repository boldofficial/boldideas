'use client'

import { useState, useEffect } from 'react';
import { getCompanySettings, updateCompanySettings } from '@/actions/financeEnhancements';
import { Building2, Mail, Globe, Phone, MapPin, Upload, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import Image from 'next/image';

export default function BrandingManager() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        const res = await getCompanySettings();
        if (res.success) setSettings(res.data);
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const res = await updateCompanySettings(settings);
        if (res.success) {
            setMessage({ type: 'success', text: 'Branding updated successfully' });
        } else {
            setMessage({ type: 'error', text: 'Failed to update branding' });
        }
        setSaving(false);
    }

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-400">Loading settings...</div>;

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in p-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Branding & Identity</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage company information, logos, and digital signatures.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-brand-navy" />
                            Company Profile
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Company Name</label>
                                <input
                                    type="text"
                                    value={settings?.companyName || ''}
                                    onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-navy outline-none"
                                    placeholder="e.g. Bold Ideas Innovations Ltd."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Tagline / Subtext</label>
                                <input
                                    type="text"
                                    value={settings?.companyAddress || ''} // Reusing address field for tag if needed or handle properly
                                    onChange={e => setSettings({ ...settings, companyAddress: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-navy outline-none"
                                    placeholder="Digital Innovation Agency"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                                    <input
                                        type="email"
                                        value={settings?.companyEmail || ''}
                                        onChange={e => setSettings({ ...settings, companyEmail: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-navy outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                                    <input
                                        type="text"
                                        value={settings?.companyWebsite || ''}
                                        onChange={e => setSettings({ ...settings, companyWebsite: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-navy outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Assets (Visuals) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-brand-navy" />
                            Visual Identity
                        </h3>

                        <div className="space-y-6">
                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Company Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 group">
                                        {settings?.logoUrl ? (
                                            <Image src={settings.logoUrl} alt="Logo" fill className="object-contain p-2" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-200" />
                                        )}
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Upload className="w-5 h-5 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setSettings({ ...settings, logoUrl: reader.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 leading-tight">Recommended: PNG or SVG with transparent background. Max 500kb.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Digital Signature</label>
                                <div className="flex flex-col gap-3">
                                    <div className="w-full h-24 relative border border-slate-200 border-dashed rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 group">
                                        {settings?.signatureUrl ? (
                                            <Image src={settings.signatureUrl} alt="Signature" fill className="object-contain p-4" />
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                                                <p className="text-[10px] text-slate-400">Click to upload signature</p>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Update Signature</span>
                                            <input
                                                type="file"
                                                accept="image/png"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setSettings({ ...settings, signatureUrl: reader.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic">Upload a transparent PNG of your handwritten signature for the best visual result.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-brand-navy text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Branding Settings
                            </>
                        )}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 animate-slide-up ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
