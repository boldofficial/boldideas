import { getPostBySlug, getPosts } from '@/actions/blog';
import BlogPostPage from '@/components/BlogPostPage';
import { notFound } from 'next/navigation';

export default async function BlogPostRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [postRes, allPostsRes] = await Promise.all([
        getPostBySlug(slug),
        getPosts()
    ]);

    if (!postRes.success || !postRes.data) {
        notFound();
    }

    const post = postRes.data;
    const allPosts = allPostsRes.data || [];
    const currentIndex = allPosts.findIndex(p => p.id === post.id);
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    return <BlogPostPage post={post} nextPost={nextPost ? { title: nextPost.title, slug: nextPost.slug } : undefined} />;
}
