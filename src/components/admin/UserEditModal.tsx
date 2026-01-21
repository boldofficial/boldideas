'use client';

import { updateUser, type UserUpdateData } from '@/actions/team';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, MapPin, Image as ImageIcon, Check } from 'lucide-react';

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
        
        try {
            if (Object.keys(updateData).length > 0) {
                await updateUser(user.id, updateData);
            }
            toast.success('User profile updated');
            onClose();
        } catch (error) {
            toast.error('Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-none shadow-2xl">
                <DialogHeader className="p-6 border-b bg-slate-50/80">
                    <div>
                        <DialogTitle className="font-black text-2xl text-brand-navy uppercase tracking-tight italic">Edit Profile</DialogTitle>
                        <DialogDescription className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                            User Identity Module // {user.email}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2 opacity-60">
                            <Label className="text-[10px] uppercase font-bold text-slate-500">Email Address (Locked)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    type="email" 
                                    value={user.email} 
                                    disabled 
                                    className="pl-10 bg-slate-100 border-slate-200 text-xs font-medium cursor-not-allowed" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-slate-500">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="pl-10 bg-white border-slate-200 text-xs font-bold text-brand-navy" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-slate-500">Professional Bio</Label>
                            <Textarea 
                                name="bio" 
                                value={formData.bio} 
                                onChange={handleChange} 
                                rows={3}
                                placeholder="Short bio..."
                                className="bg-white border-slate-200 text-xs font-medium resize-none" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-slate-500">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        type="text" 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="pl-10 bg-white border-slate-200 text-xs font-bold text-brand-navy" 
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-slate-500">Avatar URI</Label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        type="url" 
                                        name="avatarUrl" 
                                        value={formData.avatarUrl} 
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="pl-10 bg-white border-slate-200 text-xs font-bold text-brand-navy" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter className="pt-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose} 
                            disabled={isSaving}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSaving}
                            className="bg-brand-navy text-brand-gold px-8 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-navy/20"
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
                                    <span>Syncing</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    <span>Save Profile</span>
                                </div>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
