'use client';

import { useState } from 'react';
import { updateUserProfile, uploadAvatar } from '@/actions/users';
import { useRouter } from 'next/navigation';

type User = {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    address: string | null;
    avatarUrl: string | null;
    role: string | null;
};

export default function ProfileSettings({ user, onUpdate }: { user: User; onUpdate?: () => void }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [uploading, setUploading] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(user.avatarUrl);
    const router = useRouter();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        const res = await uploadAvatar(formData);

        if (res.success && res.url) {
            setCurrentAvatar(res.url); // Show preview
            // The hidden input will be updated automatically via state or we can force it
        } else {
            alert('Upload failed: ' + res.error);
        }
        setUploading(false);
    }

    async function handleSubmit(formData: FormData) {
        setStatus('loading');

        // Ensure avatarUrl is consistent
        if (currentAvatar) {
            formData.set('avatarUrl', currentAvatar);
        }

        const res = await updateUserProfile(user.id, formData);

        if (res.success) {
            setStatus('success');
            if (onUpdate) onUpdate();
            router.refresh();
            setTimeout(() => setStatus('idle'), 2000);
        } else {
            setStatus('error');
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Settings</h2>

            <form action={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Profile Image</label>
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                    ...
                                </div>
                            )}
                            {currentAvatar ? (
                                <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-slate-300">?</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-navy/10 file:text-brand-navy hover:file:bg-brand-navy/20 cursor-pointer"
                            />
                            <p className="text-[10px] text-slate-400 mt-2">Recommended: Square JPG/PNG, max 2MB.</p>
                            <input type="hidden" name="avatarUrl" value={currentAvatar || ''} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                        <input
                            name="name"
                            defaultValue={user.name || ''}
                            className="w-full p-3 border border-slate-200 rounded text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                            placeholder="Agent Name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Identity (Email)</label>
                        <input
                            disabled
                            value={user.email}
                            className="w-full p-3 border border-slate-200 rounded text-slate-400 bg-slate-50 cursor-not-allowed font-mono text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Home Address</label>
                    <input
                        name="address"
                        defaultValue={user.address || ''}
                        className="w-full p-3 border border-slate-200 rounded text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                        placeholder="123 Agency Blvd, Sector 7..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Biography / Operational Notes</label>
                    <textarea
                        name="bio"
                        defaultValue={user.bio || ''}
                        rows={4}
                        className="w-full p-3 border border-slate-200 rounded text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                        placeholder="Specialization, skills, or operational notes..."
                    />
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <button
                        disabled={status === 'loading' || uploading}
                        className="bg-brand-navy text-white px-6 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Saving...' : 'Save Changes'}
                    </button>

                    {status === 'success' && (
                        <span className="text-green-600 text-xs font-bold animate-pulse">Saved Successfully</span>
                    )}
                </div>
            </form>
        </div>
    );
}
