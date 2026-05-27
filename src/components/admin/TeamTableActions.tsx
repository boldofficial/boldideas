'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, UserX, Trash2, ShieldCheck, Shield, User } from 'lucide-react';
import { updateUserRole } from '@/actions/team';
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

type Props = { user: UserData };

export default function TeamTableActions({ user }: Props) {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleRoleChange = async (role: string) => {
        await updateUserRole(user.id, role);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Change Role</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => handleRoleChange('admin')} disabled={user.role === 'admin'}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Set as Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('staff')} disabled={user.role === 'staff'}>
                        <Shield className="mr-2 h-4 w-4" /> Set as Staff
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('client')} disabled={user.role === 'client'}>
                        <User className="mr-2 h-4 w-4" /> Set as Client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('user')} disabled={user.role === 'user'}>
                        <User className="mr-2 h-4 w-4" /> Set as User
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowDelete(true)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {showEdit && <UserEditModal user={user} onClose={() => setShowEdit(false)} />}
            {showDelete && <UserDeleteConfirm userId={user.id} userName={user.name || user.email} onClose={() => setShowDelete(false)} />}
        </>
    );
}
