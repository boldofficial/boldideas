"use client";

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Quote, List, Code, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BlogEditorProps {
    value?: any;
    onChange: (content: any) => void;
}

import { marked } from 'marked';

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true, 
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]',
            },
            handlePaste: (view, event, slice) => {
                const text = event.clipboardData?.getData('text/plain');
                if (text) {
                    const hasMarkdown = /^(#|\*|-|`|>|\[|\d\.)/m.test(text) || /\*\*|__|~~/.test(text);
                    if (hasMarkdown) {
                         try {
                             const html = marked.parse(text, { async: false }) as string;
                             if (html && editor) {
                                 editor.commands.insertContent(html);
                                 return true;
                             }
                         } catch (e) {
                             console.error("Markdown parse error", e);
                         }
                    }
                }
                return false;
            }
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt('URL');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        
        if (url === null) {
            return;
        }

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title?: string }) => (
        <Button
            onClick={onClick}
            variant="ghost"
            size="sm"
            type="button"
            title={title}
            className={cn(
                "h-8 w-8 p-0",
                isActive && "bg-brand-navy text-white hover:bg-brand-navy/90"
            )}
        >
            {children}
        </Button>
    );

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
            {/* Editor Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
                    <Code className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Add Link">
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Add Image">
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="flex-grow"></div>

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content Area */}
            <div className="bg-white min-h-[400px] text-brand-navy p-4 font-sans">
                 <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default BlogEditor;
