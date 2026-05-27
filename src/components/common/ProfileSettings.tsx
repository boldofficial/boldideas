'use client';

import { useState } from 'react';
import { updateUserProfile, uploadAvatar } from '@/actions/users';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Image as ImageIcon, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
            setTimeout(() => setStatus('idle'), 3000);
        } else {
            setStatus('error');
        }
    }

    return (
        <Card className="border-l-4 border-l-brand-gold shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-brand-navy flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Settings
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form action={handleSubmit} className="space-y-8">
                    {/* Profile Image Section */}
                    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" />
                            Profile Image
                        </label>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-brand-gold/20 flex items-center justify-center overflow-hidden shrink-0 relative shadow-sm group">
                                {uploading && (
                                    <div className="absolute inset-0 bg-brand-navy/60 flex items-center justify-center text-white z-10 backdrop-blur-[2px]">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {currentAvatar ? (
                                    <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full bg-brand-navy/5 flex items-center justify-center">
                                        <User className="w-10 h-10 text-brand-navy/20" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full space-y-3">
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="avatar-upload"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="avatar-upload"
                                        className="inline-flex items-center px-4 py-2 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all cursor-pointer shadow-sm active:scale-95"
                                    >
                                        Browse...
                                    </label>
                                    <span className="ml-4 text-xs text-slate-500 font-medium">
                                        {uploading ? 'Processing...' : 'No file selected.'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Recommended: Square JPG, PNG or WebP. Max size: 2MB.
                                </p>
                                <input type="hidden" name="avatarUrl" value={currentAvatar || ''} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <Input
                                name="name"
                                defaultValue={user.name || ''}
                                className="bg-white border-slate-200 focus-visible:ring-brand-navy h-11"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Identity (Email)</label>
                            <Input
                                disabled
                                value={user.email}
                                className="bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed h-11 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Home Address
                        </label>
                        <Input
                            name="address"
                            defaultValue={user.address || ''}
                            className="bg-white border-slate-200 focus-visible:ring-brand-navy h-11"
                            placeholder="123 Agency Blvd, Sector 7..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            Biography / Operational Notes
                        </label>
                        <Textarea
                            name="bio"
                            defaultValue={user.bio || ''}
                            rows={5}
                            className="bg-white border-slate-200 focus-visible:ring-brand-navy resize-none"
                            placeholder="Tell us about your specialization, skills, or operational notes..."
                        />
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100">
                        <Button
                            disabled={status === 'loading' || uploading}
                            className="bg-brand-navy text-white px-8 py-6 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-navy transition-all shadow-md active:scale-[0.98] w-full sm:w-auto"
                        >
                            {status === 'loading' ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </div>
                            ) : 'Save Changes'}
                        </Button>

                        {status === 'success' && (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-500">
                                <CheckCircle2 className="w-4 h-4" />
                                Changes saved successfully
                            </div>
                        )}
                        
                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-500">
                                <AlertCircle className="w-4 h-4" />
                                Failed to update profile
                            </div>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
