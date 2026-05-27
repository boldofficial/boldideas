"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Calendar, Clock, ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

import BlogRenderer from './blog/BlogRenderer';
import ShareButtons from './blog/ShareButtons';
import CommentSystem from './shared/CommentSystem';
import Image from 'next/image';
import { postBlogComment } from '@/actions/blog';

interface Comment {
    id: string;
    content: string | null;
    attachmentUrl: string | null;
    createdAt: Date | null;
    userName: string | null;
    userAvatar: string | null;
    guestName?: string | null;
}

interface BlogPostPageProps {
    post: {
        id: string;
        title: string;
        content: any; // JSON
        publishedAt: Date | null;
        slug: string;
        coverImage?: string | null;
    };
    nextPost?: {
        title: string;
        slug: string;
    };
    comments?: Comment[];
    relatedPosts?: {
        id: string;
        slug: string;
        title: string;
        coverImage?: string | null;
        publishedAt: Date | null;
    }[];
    blogUrl?: string;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, nextPost, comments = [], relatedPosts = [], blogUrl }) => {
    const canonicalUrl = blogUrl || `https://getboldideas.com/blog/${post.slug}`;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-gold/30">
            <Header />
            
            <main className="flex-grow pt-24 pb-16">
                <article className="max-w-4xl mx-auto px-6">
                    {/* Back Link & Share */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-slate-100 pb-12">
                        <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-brand-navy transition-colors text-xs font-mono uppercase tracking-[0.4em] group">
                            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
                            Return_To_Log
                        </Link>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center space-x-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">
                                <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-2 text-brand-gold" />
                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'REALTIME'}
                                </span>
                                <span className="w-1 h-1 bg-brand-gold/30 rounded-full"></span>
                                <span className="flex items-center">
                                     <Clock className="w-3 h-3 mr-2 text-brand-gold" />
                                     {Math.ceil(JSON.stringify(post.content).length / 500)} MIN_READ
                                </span>
                            </div>
                            <ShareButtons url={canonicalUrl} title={post.title} />
                        </div>
                    </div>

                    {/* Title & Entry ID */}
                    <div className="mb-20">
                        <div className="inline-block bg-brand-navy text-white text-[9px] font-mono px-3 py-1 uppercase tracking-[0.5em] mb-8">
                            ENTRY_SIGNAL // {post.id.slice(0, 12)}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-brand-navy leading-[0.95] tracking-tighter uppercase mb-6">
                            {post.title}
                        </h1>
                    </div>

                    {/* Feature Image */}
                    {post.coverImage && (
                      <div className="relative mb-14 overflow-hidden rounded-2xl border border-slate-200">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={1200}
                          height={675}
                          className="w-full object-cover"
                          priority
                        />
                      </div>
                    )}

                    {/* Content Renderer */}
                    <div className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-slate-100 hidden xl:block"></div>
                        <BlogRenderer content={post.content} />
                    </div>

                    {/* Share Bar at Bottom */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 font-medium">
                            Found this helpful? Share it with your network.
                        </p>
                        <ShareButtons url={canonicalUrl} title={post.title} />
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-20">
                            <div className="flex items-center gap-3 mb-10">
                                <Sparkles className="w-5 h-5 text-brand-gold" />
                                <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">
                                    Related Articles
                                </h2>
                                <div className="flex-1 h-[1px] bg-slate-100"></div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((rp) => (
                                    <Link
                                        key={rp.id}
                                        href={`/blog/${rp.slug}`}
                                        className="group block bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300"
                                    >
                                        <div className="aspect-video bg-slate-50 overflow-hidden">
                                            {rp.coverImage ? (
                                                <img
                                                    src={rp.coverImage}
                                                    alt={rp.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Sparkles className="w-8 h-8 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-sm font-bold text-brand-navy uppercase leading-tight group-hover:text-brand-gold transition-colors line-clamp-2">
                                                {rp.title}
                                            </h3>
                                            {rp.publishedAt && (
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mt-3">
                                                    {new Date(rp.publishedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blog Comments */}
                    <div className="mt-20">
                        <CommentSystem
                            postId={post.id}
                            initialComments={comments}
                            onSubmit={postBlogComment}
                            title="Discussion"
                            placeholder="Share your thoughts on this article..."
                            className="border border-slate-200 rounded-2xl overflow-hidden"
                        />
                    </div>

                    {/* Footer Signature & Next Signal */}
                    <div className="mt-20">
                        <div className="pt-10 border-t-2 border-brand-navy flex flex-col md:flex-row justify-between items-center gap-10">
                             <div className="text-3xl md:text-4xl font-black text-brand-navy/10 uppercase tracking-tighter select-none">
                                END_OF_TRANS
                             </div>
                             
                             {nextPost && (
                                 <Link 
                                    href={`/blog/${nextPost.slug}`}
                                    className="group text-right"
                                 >
                                    <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-2">Next_Signal_&gt;</span>
                                    <span className="text-lg font-black text-brand-navy uppercase group-hover:text-brand-gold transition-colors">{nextPost.title}</span>
                                 </Link>
                             )}

                             {!nextPost && (
                                <div className="text-right">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-2">End_Of_Queue</span>
                                    <Link href="/blog" className="text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors underline uppercase tracking-widest">Back to archives</Link>
                                </div>
                             )}
                        </div>
                    </div>
                </article>
            </main>
            
            <Footer />
        </div>
    );
};

export default BlogPostPage;
