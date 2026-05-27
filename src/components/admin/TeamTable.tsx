'use client';

import { useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BulkActionsToolbar } from '@/components/ui/bulk-actions-toolbar';
import { Trash2, UserX } from 'lucide-react';
import { deleteUser, hardDeleteUser } from '@/actions/team';
import TeamTableActions from './TeamTableActions';
import TeamTablePagination from './TeamTablePagination';

type User = {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    address: string | null;
    avatarUrl: string | null;
    role: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
};

type Props = {
    users: User[];
    page: number;
    totalPages: number;
};

export default function TeamTable({ users, page, totalPages }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const allSelected = users.length > 0 && selectedIds.length === users.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < users.length;

    const toggleAll = () => {
        setSelectedIds(allSelected ? [] : users.map(u => u.id));
    };

    const toggleOne = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleBulkDeactivate = async (ids: string[]) => {
        setIsDeleting(true);
        await Promise.all(ids.map(id => deleteUser(id)));
        setSelectedIds([]);
        setIsDeleting(false);
    };

    const handleBulkDelete = async (ids: string[]) => {
        setIsDeleting(true);
        await Promise.all(ids.map(id => hardDeleteUser(id)));
        setSelectedIds([]);
        setIsDeleting(false);
    };

    return (
        <div className="space-y-4">
            <BulkActionsToolbar
                selectedCount={selectedIds.length}
                totalCount={users.length}
                selectedIds={selectedIds}
                resourceName="user"
                onClearSelection={() => setSelectedIds([])}
                actions={[
                    { id: 'deactivate', label: 'Deactivate', icon: UserX, variant: 'outline',
                      onClick: handleBulkDeactivate, loading: isDeleting },
                    { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive',
                      onClick: handleBulkDelete, loading: isDeleting },
                ]}
            />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox checked={allSelected || (someSelected && 'indeterminate')}
                                    onCheckedChange={toggleAll} aria-label="Select all" />
                            </TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id} data-state={selectedIds.includes(user.id) ? 'selected' : undefined}>
                                <TableCell>
                                    <Checkbox checked={selectedIds.includes(user.id)}
                                        onCheckedChange={() => toggleOne(user.id)} aria-label="Select row" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatarUrl || undefined} />
                                            <AvatarFallback className="bg-brand-navy text-white text-xs">
                                                {user.email[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name || 'No Name'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        user.role === 'admin' ? 'default' : 
                                        user.role === 'staff' ? 'secondary' : 
                                        user.role === 'client' ? 'outline' : 
                                        'outline'
                                    } className={user.role === 'client' ? 'border-brand-gold text-brand-gold' : ''}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive ? 'default' : 'destructive'} 
                                        className={user.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <TeamTableActions user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <TeamTablePagination page={page} totalPages={totalPages} />
        </div>
    );
}
