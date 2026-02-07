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
    
    // Default test data for "prefilling" the form
    const defaultTestContent = {
        type: 'doc',
        content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Operational Protocol: The New Intelligence Layer' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'In the current landscape, simply using AI is no longer a competitive advantage. The real leverage lies in internal ' }, { type: 'text', marks: [{ type: 'bold' }], text: 'integration' }, { type: 'text', text: '.' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'The Schematic of Scale' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Most teams fail because they treat AI as an external tool. At Bold Ideas, we treat it as an internal nervous system.' }] },
            { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"AI is not a replacement for talent; it\'s the substrate on which talent performs at scale."' }, { type: 'hardBreak' }, { type: 'text', text: '— System_Operator // Bold_Ideas' }] }] },
            { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Terminal Workflow Initialization' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Here is how we initialize a basic automation uplink in our proprietary environment:' }] },
            { type: 'codeBlock', attrs: { language: 'bash' }, content: [{ type: 'text', text: '# Initialize Bold_Intelligence_API\nuplink --protocol secure --target internal-database\ndeploy --workflow-id ai-triage-v1 --mode autonomous' }] },
            { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Visualizing the Uplink' }] },
            { type: 'image', attrs: { src: '/images/blog/test-schematic.png', alt: 'Strategic Uplink Schematic' } },
            { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Core Protocols' }] },
            { 
                type: 'bulletList', 
                content: [
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Data Integrity' }, { type: 'text', text: ': Every transmission is verified against ground-truth benchmarks.' }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Modular Architecture' }, { type: 'text', text: ': Swap models instantly as the frontier moves.' }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Human-in-the-Loop' }, { type: 'text', text: ': Strategic oversight remains the primary directive.' }] }] }
                ] 
            }
        ]
    };

    const [content, setContent] = useState(initialData?.content || defaultTestContent);
    const [title, setTitle] = useState(initialData?.title || 'Deploying The Intelligence Layer: AI Adoption in 2026');
    const [slug, setSlug] = useState(initialData?.slug || 'ai-intelligence-layer-2026');
    const [status, setStatus] = useState(initialData?.status || 'published');
    const [manuallyEditedSlug, setManuallyEditedSlug] = useState(!!initialData?.slug || true);

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
