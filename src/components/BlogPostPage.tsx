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

// --- Custom Renderer Components ---
const RenderNode = ({ node }: { node: any }) => {
    if (!node) return null;

    switch (node.type) {
        case 'doc':
            return <div className="space-y-6">{node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}</div>;
        
        case 'paragraph':
            return (
                <p className="text-slate-700 leading-8 text-lg font-light mb-6">
                    {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </p>
            );

        case 'text':
            let text = <>{node.text}</>;
            if (node.marks) {
                node.marks.forEach((mark: any) => {
                    if (mark.type === 'bold') text = <strong className="font-black text-brand-navy">{text}</strong>;
                    if (mark.type === 'italic') text = <em className="italic text-slate-600">{text}</em>;
                    if (mark.type === 'code') text = <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-brand-navy">{text}</code>;
                    if (mark.type === 'link') text = <a href={mark.attrs.href} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-brand-navy underline transition-colors">{text}</a>;
                });
            }
            return text;

        case 'heading':
            const Level = node.attrs.level as 1 | 2 | 3;
            const Tag = `h${Level}` as React.ElementType;
            const sizes: Record<number, string> = {
                1: "text-4xl md:text-5xl font-black text-brand-navy mt-12 mb-6 uppercase tracking-tight",
                2: "text-2xl md:text-3xl font-bold text-brand-navy mt-10 mb-5 relative pl-4 border-l-4 border-brand-gold",
                3: "text-xl font-bold text-brand-navy mt-8 mb-4",
            };
            
            return (
                <Tag className={sizes[Level] || sizes[3]}>
                    {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </Tag>
            );

        case 'blockquote':
            return (
                <div className="bg-brand-navy/5 border-l-4 border-brand-navy p-6 my-8 rounded-r-sm relative">
                     <div className="absolute top-0 right-0 bg-brand-navy text-white text-[9px] font-mono px-2 py-1 uppercase tracking-widest">
                        System_Alert
                     </div>
                     <blockquote className="relative z-10 italic text-slate-700 text-lg leading-relaxed font-light">
                        {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                     </blockquote>
                </div>
            );

        case 'codeBlock':
            return (
                <div className="my-8 rounded-sm overflow-hidden border border-brand-navy p-0 bg-[#0A1128] text-green-400 font-mono text-sm relative shadow-2xl">
                    <div className="bg-brand-navy text-white px-4 py-2 text-[10px] uppercase tracking-widest border-b border-white/10 flex justify-between">
                         <span>Terminal_Output</span>
                         <span className="flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500"></div>
                             <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         </span>
                    </div>
                    <pre className="p-6 overflow-x-auto">
                        <code>
                            {node.content?.map((child: any, i: number) => child.text).join('\n')}
                        </code>
                    </pre>
                </div>
            );

        case 'bulletList':
            return (
                <ul className="list-none space-y-4 my-8 pl-2">
                     {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </ul>
            );
            
        case 'orderedList':
             return (
                <ol className="list-decimal list-inside space-y-4 my-8 pl-4 text-brand-navy font-bold marker:text-brand-gold marker:font-mono">
                     {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </ol>
            );

        case 'listItem':
            return (
                <li className="flex items-start text-slate-700 leading-relaxed font-normal group">
                    <span className="text-brand-gold mr-4 mt-1.5 text-xs opacity-50 group-hover:opacity-100 transition-opacity">►</span>
                    <div>
                        {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                    </div>
                </li>
            );
        
        case 'image':
            return (
                <div className="my-10 relative group">
                    <div className="absolute inset-0 bg-brand-gold/20 translate-x-2 translate-y-2 rounded-sm -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
                    <img 
                        src={node.attrs.src} 
                        alt={node.attrs.alt || "Blog Image"} 
                        className="w-full rounded-sm border border-brand-navy/10 shadow-lg block"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-mono px-2 py-1 uppercase hidden group-hover:block">
                        IMG_SRC: {node.attrs.src.slice(0, 20)}...
                    </div>
                </div>
            );

        default:
            console.warn('Unknown node type:', node.type);
            return null;
    }
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-gold/30">
            <Header />
            
            <main className="flex-grow pt-32 pb-20">
                <article className="max-w-4xl mx-auto px-6">
                    {/* Back Link */}
                    <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-brand-navy mb-8 transition-colors text-xs font-mono uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Return_To_Log
                    </Link>

                    {/* Meta Header */}
                    <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-mono uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-8">
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-brand-gold" />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                        </span>
                        <span className="flex items-center">
                             <Clock className="w-4 h-4 mr-2 text-brand-gold" />
                             {Math.ceil(JSON.stringify(post.content).length / 500)} MIN READ
                        </span>
                        <div className="flex-grow"></div>
                        <button className="flex items-center hover:text-brand-navy transition-colors">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share_Protocol
                        </button>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-brand-navy mb-12 leading-tight uppercase tracking-tight">
                        {post.title}
                    </h1>

                    {/* Content Renderer */}
                    <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-brand-navy prose-p:text-slate-600 prose-a:text-brand-gold hover:prose-a:text-brand-navy">
                        <RenderNode node={post.content} />
                    </div>

                    {/* Footer Signature */}
                    <div className="mt-20 pt-10 border-t-2 border-brand-navy flex justify-between items-center">
                         <div className="text-3xl font-black text-brand-navy/20 uppercase tracking-tighter">
                             End_Of_Transmission
                         </div>
                         <div className="font-mono text-[10px] text-slate-400">
                             ID: {post.id}
                         </div>
                    </div>
                </article>
            </main>
            
            <Footer />
        </div>
    );
};

export default BlogPostPage;
