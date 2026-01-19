import { getUsers, getUsersCount } from '@/actions/team';
import TeamTable from '@/components/admin/TeamTable';

const ITEMS_PER_PAGE = 20;

type Props = {
    searchParams: Promise<{ page?: string }>;
};

export default async function TeamPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || '1', 10));
    
    const [{ data: users }, { count }] = await Promise.all([
        getUsers(page),
        getUsersCount()
    ]);
    
    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Team Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage user roles, status, and profile information.
                    </p>
                </div>
                <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg text-sm border max-w-md">
                    <span className="font-bold block mb-1">ℹ️ How to add staff:</span>
                    Ask your team member to <strong>Sign Up</strong> first. Then change their role below.
                </div>
            </div>

            <TeamTable users={users || []} page={page} totalPages={totalPages} />
        </div>
    );
}
