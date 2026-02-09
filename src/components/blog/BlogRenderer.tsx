"use client";

import React from 'react';

// --- Custom Renderer Components ---
export const RenderNode = ({ node }: { node: any }) => {
    if (!node) return null;

    switch (node.type) {
        case 'doc':
            return <div className="space-y-8">{node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}</div>;
        
        case 'paragraph':
            return (
                <p className="text-slate-600 leading-loose text-base font-light mb-8">
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
                1: "text-3xl md:text-4xl font-black text-brand-navy mt-14 mb-6 uppercase tracking-tight",
                2: "text-xl md:text-2xl font-bold text-brand-navy mt-10 mb-5 relative pl-5 border-l-4 border-brand-gold",
                3: "text-lg font-bold text-brand-navy mt-8 mb-4",
            };
            
            return (
                <Tag className={sizes[Level] || sizes[3]}>
                    {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </Tag>
            );

        case 'blockquote':
            return (
                <div className="bg-brand-navy/5 border-l-4 border-brand-navy p-8 my-10 rounded-r-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-brand-navy text-white text-[9px] font-mono px-3 py-1.5 uppercase tracking-widest opacity-80">
                        Protocol_Status: Active
                     </div>
                     <div className="absolute -bottom-4 -right-4 text-6xl text-brand-navy/5 font-black uppercase pointer-events-none select-none">
                         Quote
                     </div>
                     <blockquote className="relative z-10 italic text-slate-700 text-lg leading-relaxed font-light">
                        {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                     </blockquote>
                </div>
            );

        case 'codeBlock':
            return (
                <div className="my-10 rounded-sm overflow-hidden border border-brand-navy p-0 bg-[#0A1128] text-green-400 font-mono text-sm relative shadow-2xl">
                    <div className="bg-brand-navy text-white px-5 py-3 text-[10px] uppercase tracking-[0.3em] border-b border-white/10 flex justify-between items-center">
                         <span className="flex items-center">
                             <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                             Terminal_Buffer_01
                         </span>
                         <span className="flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-brand-gold"></div>
                         </span>
                    </div>
                    <pre className="p-8 overflow-x-auto selection:bg-white/20">
                        <code>
                            {node.content?.map((child: any, i: number) => child.text).join('\n')}
                        </code>
                    </pre>
                </div>
            );

        case 'bulletList':
            return (
                <ul className="list-none space-y-5 my-10 pl-2">
                     {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </ul>
            );
            
        case 'orderedList':
             return (
                <ol className="list-decimal list-inside space-y-5 my-10 pl-4 text-brand-navy font-bold marker:text-brand-gold marker:font-mono marker:text-sm">
                     {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                </ol>
            );

        case 'listItem':
            return (
                <li className="flex items-start text-slate-600 leading-relaxed font-normal group">
                    <span className="text-brand-gold mr-5 mt-2 text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">PROTOCOL_&gt;</span>
                    <div className="flex-1">
                        {node.content?.map((child: any, i: number) => <RenderNode key={i} node={child} />)}
                    </div>
                </li>
            );
        
        case 'image':
            return (
                <div className="my-10 relative group">
                    <div className="absolute inset-0 bg-brand-navy/5 translate-x-2 translate-y-2 rounded-sm -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500"></div>
                    <div className="relative overflow-hidden rounded-sm border border-brand-navy/10 shadow-xl">
                        <img 
                            src={node.attrs.src} 
                            alt={node.attrs.alt || "Blog Image"} 
                            className="w-full h-auto block transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-brand-navy/80 backdrop-blur-md text-white text-[8px] font-mono px-3 py-1.5 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">
                            Resource_Uplink: Success
                        </div>
                    </div>
                </div>
            );

        case 'horizontalRule':
            return <hr className="my-16 border-t-2 border-slate-100" />;

        case 'hardBreak':
            return <br />;

        default:
            console.warn('Unknown node type:', node.type);
            return null;
    }
};

interface BlogRendererProps {
    content: any;
}

const BlogRenderer: React.FC<BlogRendererProps> = ({ content }) => {
    if (!content) return null;
    return <RenderNode node={content} />;
};

export default BlogRenderer;
