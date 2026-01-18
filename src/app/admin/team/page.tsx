import { getUsers, updateUserRole } from '@/actions/team';
import UserRoleManager from '@/components/admin/UserRoleManager';

export default async function TeamPage() {
    const { data: users } = await getUsers();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Team Management</h1>
                    <p className="text-slate-500 mt-2">Manage user roles and access permissions.</p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded text-sm border border-blue-100 max-w-md">
                    <span className="font-bold block mb-1">ℹ️ How to add staff:</span>
                    Ask your team member to <strong>Sign Up</strong> for an account first. Then, find them in the list below and change their role to <strong>Staff</strong> or <strong>Admin</strong>.
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-bold text-slate-600 text-sm">User</th>
                            <th className="p-4 font-bold text-slate-600 text-sm">Email</th>
                            <th className="p-4 font-bold text-slate-600 text-sm">Role</th>
                            <th className="p-4 font-bold text-slate-600 text-sm">Joined</th>
                            <th className="p-4 font-bold text-slate-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users?.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-xs">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-700">{user.name || 'No Name'}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 font-mono text-sm">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400 text-xs">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 items-center opacity-50 group-hover:opacity-100 transition-opacity">
                                        <UserRoleManager userId={user.id} initialRole={user.role || 'user'} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!users || users.length === 0) && (
                    <div className="p-8 text-center text-slate-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
