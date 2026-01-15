import { getPostBySlug } from '@/actions/blog';
import BlogPostPage from '@/components/BlogPostPage';
import { notFound } from 'next/navigation';

export default async function BlogPostRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: post, success } = await getPostBySlug(slug);

    if (!success || !post) {
        notFound();
    }

    return <BlogPostPage post={post} />;
}
