import { getPostBySlug } from '@/actions/blog';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: post } = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return <PostForm initialData={post} isEditMode />;
}
