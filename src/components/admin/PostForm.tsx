"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import { createPost, updatePost } from '@/actions/blog';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const [status, setStatus] = useState(initialData?.status || 'draft');
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
        formData.set('status', status);

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
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/blog" className="text-slate-500 hover:text-brand-navy flex items-center text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>
                <h1 className="text-2xl font-bold text-brand-navy">
                    {isEditMode ? 'Edit Post' : 'New Post'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                           <Label htmlFor="title">Title</Label>
                           <Input 
                               id="title"
                               name="title"
                               required
                               value={title}
                               onChange={handleTitleChange}
                               placeholder="Enter post title..." 
                               className="text-lg"
                           />
                        </div>
                        
                        <div className="space-y-2">
                           <Label>Content</Label>
                           <BlogEditor value={content} onChange={setContent} />
                        </div>
                    </div>

                    {/* Sidebar Metadata */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Post Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                   <Label htmlFor="slug">URL Slug</Label>
                                   <Input 
                                       id="slug"
                                       name="slug"
                                       required
                                       value={slug}
                                       onChange={handleSlugChange}
                                       placeholder="url-slug" 
                                       className="font-mono text-sm"
                                   />
                                </div>

                                <div className="space-y-2">
                                   <Label htmlFor="excerpt">Excerpt</Label>
                                   <Textarea 
                                       id="excerpt"
                                       name="excerpt"
                                       defaultValue={initialData?.excerpt || ''}
                                       rows={3}
                                       placeholder="Brief summary..." 
                                   />
                                </div>

                                <div className="space-y-2">
                                   <Label>Status</Label>
                                   <Select value={status} onValueChange={setStatus}>
                                       <SelectTrigger>
                                           <SelectValue placeholder="Select status" />
                                       </SelectTrigger>
                                       <SelectContent>
                                           <SelectItem value="draft">Draft</SelectItem>
                                           <SelectItem value="published">Published</SelectItem>
                                       </SelectContent>
                                   </Select>
                                   <input type="hidden" name="status" value={status} />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full bg-brand-navy hover:bg-brand-navy/90"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Post
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default PostForm;
