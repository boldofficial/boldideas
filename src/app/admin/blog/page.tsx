import { getPosts } from '@/actions/blog';
import AdminBlogList from '@/components/admin/AdminBlogList';

export default async function AdminBlogPage() {
    const { data: posts, success } = await getPosts();

    if (!success) {
        return <div className="p-8 text-red-500">Failed to load transmissions.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <AdminBlogList initialPosts={posts || []} />
        </div>
    );
}
