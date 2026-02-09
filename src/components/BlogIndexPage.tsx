"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Signal, Terminal, Zap } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import BlogRenderer from './blog/BlogRenderer';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: any;
    publishedAt: Date | null;
    coverImage: string | null;
}

interface BlogIndexPageProps {
    posts: Post[];
}

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ posts }) => {
    // Separate the latest post from the rest
    const [featuredPost, otherPosts] = useMemo(() => {
        if (!posts || posts.length === 0) return [null, []];
        const [latest, ...rest] = posts;
        return [latest, rest];
    }, [posts]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-gold/30">
            <Header />
            
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Page Header - High Tech Protocol Style */}
                    <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-brand-navy/10 pb-12">
                        <div className="relative group">
                            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-brand-gold hidden lg:block"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-6 block">
                                Archives // Transmission_Log
                            </span>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-brand-navy leading-[0.9] tracking-tighter uppercase relative z-10">
                                Collective <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-navy italic">Intel.</span>
                            </h1>
                        </div>
                        <div className="mt-8 md:mt-0 text-right">
                             <div className="inline-flex items-center space-x-3 bg-brand-navy text-white px-4 py-2 rounded-sm text-[10px] font-mono uppercase tracking-widest">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                <span>Status: Uplink_Verified</span>
                             </div>
                             <p className="text-slate-500 font-mono text-[9px] mt-4 uppercase tracking-[0.3em]">
                                Last_Sync: {new Date().toLocaleTimeString()}
                             </p>
                        </div>
                    </div>

                    {!featuredPost ? (
                         <div className="text-center py-32 border-2 border-dashed border-brand-navy/10 rounded-sm">
                             <div className="text-5xl mb-6">📡</div>
                             <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tighter">No Active Signals</h3>
                             <p className="text-slate-500 font-mono mt-4 text-sm">Waiting for incoming data packets from base coordinates.</p>
                         </div>
                    ) : (
                        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                            
                            {/* Featured Post: Full Reading Experience */}
                            <div className="lg:col-span-8 animate-fade-in">
                                <article className="group">
                                    {/* Meta Bar */}
                                    <div className="flex items-center text-[10px] font-mono font-bold text-slate-400 mb-8 uppercase tracking-[0.3em] space-x-6">
                                        <span className="flex items-center group-hover:text-brand-gold transition-colors">
                                            <Calendar className="w-3 h-3 mr-2" />
                                            {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : 'REALTIME'}
                                        </span>
                                        <span className="w-1 h-1 bg-brand-gold/30 rounded-full"></span>
                                        <span className="flex items-center">
                                            <Signal className="w-3 h-3 mr-2 text-brand-gold" />
                                            PRIMARY_DATA_STREAM
                                        </span>
                                        <span className="hidden sm:inline-flex items-center text-brand-navy/20">
                                            ID_{featuredPost.id.slice(0, 8)}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-12 leading-[1.1] tracking-tighter uppercase transition-all duration-700 group-hover:tracking-tight">
                                        {featuredPost.title}
                                    </h2>

                                    {/* Full Content Rendering */}
                                    <div className="relative">
                                        <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-slate-100 hidden xl:block"></div>
                                        <BlogRenderer content={featuredPost.content} />
                                    </div>

                                    {/* Final Footer Signature */}
                                    <div className="mt-20 pt-10 border-t border-brand-navy/10 flex flex-col md:flex-row justify-between items-center gap-6">
                                         <div className="text-2xl font-black text-brand-navy/10 uppercase tracking-tighter select-none">
                                            END_OF_TRANS
                                         </div>
                                         <Link 
                                            href={`/blog/${featuredPost.slug}`}
                                            className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold hover:text-brand-navy transition-all px-6 py-3 border border-brand-gold/20 hover:border-brand-navy bg-white/50 backdrop-blur-sm"
                                         >
                                            PERMALINK_&gt;
                                         </Link>
                                    </div>
                                </article>
                            </div>

                            {/* Sidebar: Read More Signals */}
                            <div className="lg:col-span-4 space-y-16">
                                {/* Section Header */}
                                <div className="space-y-4">
                                     <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-navy flex items-center">
                                         <Zap className="w-4 h-4 mr-3 text-brand-gold" />
                                         Recent_Signals
                                     </h3>
                                     <div className="w-16 h-1 bg-brand-gold"></div>
                                </div>

                                {otherPosts.length === 0 ? (
                                    <div className="p-8 border border-brand-navy/5 bg-slate-100/50 rounded-sm">
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
                                            No additional signals in queue.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {otherPosts.map((post) => (
                                            <Link 
                                                href={`/blog/${post.slug}`} 
                                                key={post.id} 
                                                className="group block border-b border-slate-100 pb-8 last:border-0"
                                            >
                                                <article className="space-y-4 transition-all duration-300 transform group-hover:translate-x-2">
                                                    <div className="flex items-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                                                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'LEGACY'}</span>
                                                        <span className="mx-3 opacity-30">//</span>
                                                        <span className="text-brand-gold/60">ENTRY_{post.id.slice(0, 4)}</span>
                                                    </div>
                                                    
                                                    <h4 className="text-lg font-black text-brand-navy leading-tight uppercase group-hover:text-brand-gold transition-colors">
                                                        {post.title}
                                                    </h4>

                                                    <div className="flex items-center text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy group-hover:text-brand-gold transition-colors">
                                                        Read_Full <ArrowRight className="w-3 h-3 ml-2 group-hover:ml-4 transition-all" />
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Technical Decorative Block */}
                                <div className="p-8 bg-brand-navy rounded-sm relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-brand-gold/5 transition-colors"></div>
                                     <Terminal className="w-8 h-8 text-brand-gold/40 mb-6" />
                                     <h5 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-4">Uplink_Capabilities</h5>
                                     <p className="text-white/40 text-[10px] leading-relaxed font-mono uppercase tracking-wider mb-8">
                                        Practical AI adoption for lean teams. Deploying intelligence into real workflows.
                                     </p>
                                     <Link 
                                        href="https://crm.getboldideas.com/book" 
                                        target="_blank"
                                        className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold hover:text-white transition-colors"
                                     >
                                        Connect_ToBase
                                     </Link>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default BlogIndexPage;
