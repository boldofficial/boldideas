"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/actions/blog';
import { Edit, Trash2, Plus, Eye, FileText } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string | null;
    publishedAt: Date | null;
    createdAt: Date | null;
}

interface AdminBlogListProps {
    initialPosts: Post[];
}

const AdminBlogList: React.FC<AdminBlogListProps> = ({ initialPosts }) => {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        setIsDeleting(id);
        const res = await deletePost(id);
        
        if (res.success) {
            router.refresh();
        } else {
            alert('Failed to delete post');
        }
        setIsDeleting(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                   <h1 className="text-2xl font-black text-brand-navy tracking-tight uppercase">Transmission Log</h1>
                   <p className="text-slate-500 font-mono text-xs">Manage uplink content.</p>
                </div>
                <Link href="/admin/blog/create">
                    <button className="bg-brand-navy text-white px-4 py-2 rounded-sm font-bold hover:bg-brand-gold hover:text-brand-navy transition-colors flex items-center text-xs tracking-widest uppercase">
                        <Plus className="w-4 h-4 mr-2" />
                        New_Entry
                    </button>
                </Link>
            </div>

            <div className="bg-white border border-brand-navy/10 rounded-sm overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-brand-navy/5 text-brand-navy font-mono text-[10px] uppercase tracking-widest border-b border-brand-navy/10">
                        <tr>
                            <th className="p-4 font-bold">Signal_Title</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold">Published</th>
                            <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-navy/5">
                        {initialPosts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400 font-mono text-sm">
                                    NO_SIGNALS_DETECTED
                                </td>
                            </tr>
                        ) : (
                            initialPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-brand-navy/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-brand-navy">{post.title}</div>
                                        <div className="text-xs text-slate-400 font-mono">/{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-sm text-[9px] font-mono font-bold tracking-widest uppercase ${
                                            post.status === 'published' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {post.status || 'DRAFT'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 font-mono">
                                        {post.publishedAt 
                                            ? new Date(post.publishedAt).toLocaleDateString() 
                                            : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {post.status === 'published' && (
                                                <Link href={`/blog/${post.slug}`} target="_blank">
                                                    <button className="p-1 hover:text-brand-navy text-slate-400 transition-colors" title="View">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            )}
                                            <Link href={`/admin/blog/${post.slug}`}>
                                                <button className="p-1 hover:text-brand-gold text-slate-400 transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post.id)}
                                                disabled={isDeleting === post.id}
                                                className="p-1 hover:text-red-500 text-slate-400 transition-colors" 
                                                title="Delete"
                                            >
                                                {isDeleting === post.id ? (
                                                    <span className="animate-spin w-4 h-4 block border-2 border-slate-400 border-t-transparent rounded-full"></span>
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogList;
