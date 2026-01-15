"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import { createPost, updatePost } from '@/actions/blog';
import { Loader2, ArrowLeft, Save, Globe } from 'lucide-react';
import Link from 'next/link';

interface PostFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: any; // JSON
        status: string | null;
    };
    isEditMode?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, isEditMode = false }) => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState(initialData?.content || {});
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [manuallyEditedSlug, setManuallyEditedSlug] = useState(!!initialData?.slug);

    // Slugify helper
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/&/g, '-and-')   // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        
        // Only auto-update slug if user hasn't manually edited it
        // OR if it's a new post (no initial data) and user hasn't touched slug yet
        if (!manuallyEditedSlug) {
            setSlug(slugify(newTitle));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setManuallyEditedSlug(true);
    };

    // Form submission handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        // Append rich text content manually since it's state-controlled
        formData.append('content', JSON.stringify(content));
        // Ensure managed state values are used
        formData.set('title', title);
        formData.set('slug', slug);

        let res;
        if (isEditMode && initialData?.id) {
            res = await updatePost(initialData.id, formData);
        } else {
            res = await createPost(formData);
        }

        if (res.success) {
            router.push('/admin/blog');
            router.refresh(); // Refresh list
        } else {
            alert(`Error: ${res.error}`);
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/admin/blog" className="text-slate-500 hover:text-brand-navy flex items-center text-sm font-mono transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    BACK_TO_LOG
                </Link>
                <h1 className="text-2xl font-black text-brand-navy uppercase tracking-tight">
                    {isEditMode ? 'Edit_Transmission' : 'New_Transmission'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Title</label>
                           <input 
                               name="title"
                               required
                               value={title}
                               onChange={handleTitleChange}
                               placeholder="ENTER_TITLE" 
                               className="w-full text-2xl font-bold bg-transparent border-b border-brand-navy/10 pb-2 focus:outline-none focus:border-brand-gold text-brand-navy placeholder:text-slate-300 transition-colors"
                           />
                        </div>
                        
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                               <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Content_Body</label>
                           </div>
                           <BlogEditor value={content} onChange={setContent} />
                        </div>
                    </div>

                    {/* Sidebar Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-sm border border-brand-navy/10 shadow-sm space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Slug</label>
                               <input 
                                   name="slug"
                                   required
                                   value={slug}
                                   onChange={handleSlugChange}
                                   placeholder="url-slug" 
                                   className="w-full bg-slate-50 p-2 rounded-sm border border-slate-200 text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-gold"
                               />
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Excerpt</label>
                               <textarea 
                                   name="excerpt"
                                   defaultValue={initialData?.excerpt || ''}
                                   rows={3}
                                   placeholder="Brief summary..." 
                                   className="w-full bg-slate-50 p-2 rounded-sm border border-slate-200 text-sm text-brand-navy focus:outline-none focus:border-brand-gold resize-none"
                               />
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Status</label>
                               <select 
                                   name="status"
                                   defaultValue={initialData?.status || 'draft'}
                                   className="w-full bg-slate-50 p-2 rounded-sm border border-slate-200 text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-gold"
                               >
                                   <option value="draft">DRAFT</option>
                                   <option value="published">PUBLISHED</option>
                               </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-brand-navy text-white py-3 rounded-sm font-bold hover:bg-brand-gold hover:text-brand-navy transition-all flex items-center justify-center text-xs tracking-widest uppercase disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        SAVING...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        SAVE_TRANSMISSION
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default PostForm;
