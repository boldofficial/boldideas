'use client';

import { updateUserRole } from '@/actions/team';

type Props = {
    userId: string;
    initialRole: string;
};

export default function UserRoleManager({ userId, initialRole }: Props) {
    return (
        <form action={async (formData) => {
            await updateUserRole(userId, formData.get('role') as string);
        }}>
            <select
                name="role"
                defaultValue={initialRole || 'user'}
                className="p-1 border rounded text-xs bg-white focus:border-brand-navy outline-none cursor-pointer"
                onChange={(e) => e.target.form?.requestSubmit()}
            >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>
        </form>
    );
}
