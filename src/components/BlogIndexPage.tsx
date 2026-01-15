"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    coverImage: string | null;
}

interface BlogIndexPageProps {
    posts: Post[];
}

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ posts }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-gold/30">
            <Header />
            
            <main className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="mb-16 relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-1 bg-brand-navy/10 hidden xl:block"></div>
                        <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-6 tracking-tighter uppercase relative z-10">
                            Transmission<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-navy">Log_V1</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed font-light border-l-4 border-brand-gold pl-6">
                            Insights, updates, and schematic breakdowns of our latest operations in the digital space.
                        </p>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group block h-full">
                                <article className="bg-white h-full border border-slate-200 rounded-sm overflow-hidden hover:border-brand-gold hover:shadow-xl hover:shadow-brand-gold/10 transition-all duration-300 flex flex-col relative">
                                    {/* Tech Overlay */}
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-6 h-6 text-brand-gold" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center text-[10px] font-mono font-bold text-slate-400 mb-4 uppercase tracking-widest space-x-4">
                                            <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'DRAFT'}
                                            </span>
                                            <span className="w-1 h-1 bg-brand-gold rounded-full"></span>
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                LOG_ENTRY
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-black text-brand-navy mb-4 leading-tight group-hover:text-brand-gold transition-colors uppercase">
                                            {post.title}
                                        </h2>

                                        <p className="text-slate-600 leading-relaxed mb-6 flex-grow font-light">
                                            {post.excerpt || "Decrypting content..."}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-brand-navy uppercase tracking-widest">
                                            <span>Read_Protocol</span>
                                            <span className="group-hover:translate-x-1 transition-transform">_&gt;</span>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Bar */}
                                    <div className="h-1 bg-brand-navy/5 group-hover:bg-brand-gold transition-colors"></div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                         <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-sm">
                             <div className="text-4xl mb-4">📡</div>
                             <h3 className="text-xl font-bold text-brand-navy uppercase">No Signals Detected</h3>
                             <p className="text-slate-500 font-mono mt-2">The transmission log is currently empty.</p>
                         </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default BlogIndexPage;
