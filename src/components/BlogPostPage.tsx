"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Calendar, Clock, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BlogPostPageProps {
    post: {
        id: string;
        title: string;
        content: any; // JSON
        publishedAt: Date | null;
        slug: string;
    };
}

import BlogRenderer from './blog/BlogRenderer';

interface BlogPostPageProps {
    post: {
        id: string;
        title: string;
        content: any; // JSON
        publishedAt: Date | null;
        slug: string;
    };
    nextPost?: {
        title: string;
        slug: string;
    };
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, nextPost }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-gold/30">
            <Header />
            
            <main className="flex-grow pt-32 pb-24">
                <article className="max-w-4xl mx-auto px-6">
                    {/* Back Link */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-slate-100 pb-12">
                        <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-brand-navy transition-colors text-xs font-mono uppercase tracking-[0.4em] group">
                            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
                            Return_To_Log
                        </Link>
                        
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

                    {/* Content Renderer */}
                    <div className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-slate-100 hidden xl:block"></div>
                        <BlogRenderer content={post.content} />
                    </div>

                    {/* Footer Signature & Next Signal */}
                    <div className="mt-32">
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
