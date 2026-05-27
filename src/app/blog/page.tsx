import { getPosts } from '@/actions/blog';
import BlogIndexPage from '@/components/BlogIndexPage';

const baseUrl = 'https://getboldideas.com';

export const metadata = {
  title: "Blog — Bold Ideas | Websites, AI Agents & Automation",
  description:
    "Practical articles on websites, AI agents, workflow automation, and digital marketing for Illinois and Wisconsin small businesses. Insights to help you grow.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "Blog — Bold Ideas",
    description:
      "Practical articles on websites, AI agents, and workflow automation for local businesses.",
    url: `${baseUrl}/blog`,
    siteName: "Bold Ideas",
    images: [
      {
        url: `${baseUrl}/images/boldideas_logo.png`,
        width: 1536,
        height: 1024,
        alt: "Bold Ideas - Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Bold Ideas",
    description:
      "Practical articles on websites, AI agents, and workflow automation for local businesses.",
    images: [`${baseUrl}/images/boldideas_logo.png`],
  },
  keywords: [
    "small business blog",
    "Illinois business",
    "Wisconsin business",
    "AI for small business",
    "website tips",
    "workflow automation",
    "local SEO",
    "business growth",
  ],
  robots: "index, follow",
};

export default async function BlogIndexRoute() {
    const { data: posts } = await getPosts();

    // Filter for published posts only
    const publishedPosts = posts?.filter(post => post.status === 'published') || [];

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${baseUrl}/blog#collectionpage`,
      "name": "Blog — Bold Ideas",
      "description": "Practical articles on websites, AI agents, workflow automation, and digital marketing for Illinois and Wisconsin small businesses.",
      "url": `${baseUrl}/blog`,
      "isPartOf": {
        "@id": `${baseUrl}/#organization`,
      },
      "breadcrumb": {
        "@id": `${baseUrl}/blog#breadcrumb`,
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": publishedPosts.map((post, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `${baseUrl}/blog/${post.slug}`,
        })),
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/blog#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <BlogIndexPage posts={publishedPosts} />
      </>
    );
}
