"use client";

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Quote, List, Code, Undo, Redo } from 'lucide-react';

interface BlogEditorProps {
    value?: any;
    onChange: (content: any) => void;
}

import { marked } from 'marked';

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            // Markdown extension removed to prevent HTML escaping during insertContent
            // We handle Markdown pasting manually via handlePaste below
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
                    // Check if the text looks like markdown (headers, lists, blockquotes, code, bold/italic)
                    const hasMarkdown = /^(#|\*|-|`|>|\[|\d\.)/m.test(text) || /\*\*|__|~~/.test(text);
                    if (hasMarkdown) {
                         try {
                             // Parse markdown to HTML
                             const html = marked.parse(text, { async: false }) as string;
                             if (html && editor) {
                                 editor.commands.insertContent(html);
                                 return true; // Prevent default paste
                             }
                         } catch (e) {
                             console.error("Markdown parse error", e);
                         }
                    }
                }
                return false; // Default behavior
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
        
        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, children }: { onClick: () => void, isActive?: boolean, children: React.ReactNode }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-sm transition-colors ${isActive ? 'bg-brand-gold text-brand-navy' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            type="button"
        >
            {children}
        </button>
    );

    return (
        <div className="border border-white/10 bg-brand-navy/50 rounded-sm overflow-hidden flex flex-col">
            {/* Editor Toolbar - Schematic Style */}
            <div className="bg-brand-navy border-b border-white/10 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
                <div className="mr-2 px-2 py-1 bg-white/5 rounded-sm border border-white/5 text-[9px] font-mono text-brand-gold tracking-widest uppercase">
                    SYS_EDIT_MODE
                </div>
                
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}>
                    <Code className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="flex-grow"></div>

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content Area */}
            <div className="bg-white min-h-[400px] text-brand-navy p-4 font-sans">
                 <EditorContent editor={editor} />
            </div>

            {/* Tech Footer */}
            <div className="bg-brand-navy/90 p-1 border-t border-white/10 flex justify-between items-center px-4">
                 <span className="text-[9px] font-mono text-slate-500">INPUT_STREAM_ACTIVE</span>
                 <span className="text-[9px] font-mono text-slate-500">CHARS: {editor.storage.characterCount?.characters() || 0}</span>
            </div>
        </div>
    );
};

export default BlogEditor;
