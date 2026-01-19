'use client';

import { useState } from 'react';
import UserRoleManager from './UserRoleManager';
import UserStatusToggle from './UserStatusToggle';
import UserEditModal from './UserEditModal';
import UserDeleteConfirm from './UserDeleteConfirm';

type UserData = {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    address: string | null;
    avatarUrl: string | null;
    role: string | null;
    isActive: boolean | null;
};

type Props = {
    user: UserData;
};

export default function UserActionsCell({ user }: Props) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <div className="flex items-center justify-end gap-3">
            <UserStatusToggle userId={user.id} initialStatus={user.isActive ?? true} />
            <UserRoleManager userId={user.id} initialRole={user.role || 'user'} />
            
            <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded transition-colors"
                title="Edit user"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>
            
            <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Deactivate user"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            </button>
            
            {showEditModal && (
                <UserEditModal user={user} onClose={() => setShowEditModal(false)} />
            )}
            
            {showDeleteModal && (
                <UserDeleteConfirm 
                    userId={user.id} 
                    userName={user.name || user.email} 
                    onClose={() => setShowDeleteModal(false)} 
                />
            )}
        </div>
    );
}
