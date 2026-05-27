import { getPostBySlug, getPosts, getBlogComments } from '@/actions/blog';
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

    // Fetch comments with actual post ID now that we have it
    const commentsRes = await getBlogComments(post.id);
    const comments = commentsRes.success ? commentsRes.data || [] : [];

    // Related posts: exclude current post, take up to 3
    const relatedPosts = allPosts
        .filter(p => p.id !== post.id && p.status === 'published')
        .slice(0, 3);

    const blogUrl = `https://getboldideas.com/blog/${post.slug}`;

    return (
        <BlogPostPage
            post={post}
            nextPost={nextPost ? { title: nextPost.title, slug: nextPost.slug } : undefined}
            comments={comments}
            relatedPosts={relatedPosts.map(p => ({
                id: p.id,
                slug: p.slug,
                title: p.title,
                coverImage: p.coverImage,
                publishedAt: p.publishedAt,
            }))}
            blogUrl={blogUrl}
        />
    );
}
