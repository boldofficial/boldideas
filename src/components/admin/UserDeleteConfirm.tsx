'use client';

import { deleteUser, hardDeleteUser } from '@/actions/team';
import { useState } from 'react';

type Props = {
    userId: string;
    userName: string;
    onClose: () => void;
};

export default function UserDeleteConfirm({ userId, userName, onClose }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        
        const result = deleteType === 'hard' 
            ? await hardDeleteUser(userId)
            : await deleteUser(userId);
            
        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Failed to delete user');
        }
        setIsDeleting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Delete User</h2>
                </div>
                
                <p className="text-slate-600 mb-4">
                    You are about to delete <strong className="text-brand-navy">{userName}</strong>.
                </p>
                
                <div className="space-y-3 mb-6">
                    <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="radio" name="deleteType" value="soft" checked={deleteType === 'soft'}
                            onChange={() => setDeleteType('soft')} className="mt-1" />
                        <div>
                            <span className="font-bold text-slate-700 block">Deactivate</span>
                            <span className="text-sm text-slate-500">User will be disabled but data is preserved.</span>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-red-200 rounded cursor-pointer hover:bg-red-50 transition-colors">
                        <input type="radio" name="deleteType" value="hard" checked={deleteType === 'hard'}
                            onChange={() => setDeleteType('hard')} className="mt-1" />
                        <div>
                            <span className="font-bold text-red-600 block">Permanently Delete</span>
                            <span className="text-sm text-red-500">User will be removed from the database. This cannot be undone!</span>
                        </div>
                    </label>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}
                
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} disabled={isDeleting}
                        className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={isDeleting}
                        className={`px-4 py-2 text-sm font-bold text-white rounded transition-colors disabled:opacity-50 ${
                            deleteType === 'hard' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-navy hover:bg-brand-gold hover:text-brand-navy'
                        }`}>
                        {isDeleting ? 'Deleting...' : deleteType === 'hard' ? 'Permanently Delete' : 'Deactivate'}
                    </button>
                </div>
            </div>
        </div>
    );
}
