import { getPosts } from '@/actions/blog';
import BlogIndexPage from '@/components/BlogIndexPage';

export default async function BlogIndexRoute() {
    const { data: posts } = await getPosts();

    // Filter for published posts only (unless you want to show drafts too, but usually not)
    const publishedPosts = posts?.filter(post => post.status === 'published') || [];

    return <BlogIndexPage posts={publishedPosts} />;
}
