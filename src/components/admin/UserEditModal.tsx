'use client';

import { updateUser, type UserUpdateData } from '@/actions/team';
import { useState } from 'react';

type UserData = {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    address: string | null;
    avatarUrl: string | null;
};

type Props = {
    user: UserData;
    onClose: () => void;
};

export default function UserEditModal({ user, onClose }: Props) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
        address: user.address || '',
        avatarUrl: user.avatarUrl || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        const updateData: UserUpdateData = {};
        if (formData.name !== user.name) updateData.name = formData.name;
        if (formData.bio !== user.bio) updateData.bio = formData.bio;
        if (formData.address !== user.address) updateData.address = formData.address;
        if (formData.avatarUrl !== user.avatarUrl) updateData.avatarUrl = formData.avatarUrl;
        
        if (Object.keys(updateData).length > 0) {
            await updateUser(user.id, updateData);
        }
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-brand-navy">Edit User</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Email</label>
                        <input type="email" value={user.email} disabled
                            className="w-full p-3 border border-slate-200 rounded bg-slate-50 text-slate-500 cursor-not-allowed" />
                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed here</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full p-3 border border-slate-200 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
                            placeholder="Short bio..."
                            className="w-full p-3 border border-slate-200 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none resize-none" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange}
                            placeholder="Address"
                            className="w-full p-3 border border-slate-200 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Avatar URL</label>
                        <input type="url" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange}
                            placeholder="https://..."
                            className="w-full p-3 border border-slate-200 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none" />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button type="button" onClick={onClose} disabled={isSaving}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving}
                            className="px-4 py-2 text-sm font-bold text-white bg-brand-navy hover:bg-brand-gold hover:text-brand-navy rounded transition-colors disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
