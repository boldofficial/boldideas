'use client';

import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');

    const shareLinks = [
        {
            name: 'Twitter',
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            icon: Twitter,
            color: 'hover:bg-black hover:text-white',
        },
        {
            name: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: Linkedin,
            color: 'hover:bg-[#0A66C2] hover:text-white',
        },
        {
            name: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: Facebook,
            color: 'hover:bg-[#1877F2] hover:text-white',
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1.5 mr-1">
                <Share2 className="w-3 h-3" />
                Share
            </span>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${link.name}`}
                    className={`w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all duration-200 ${link.color} hover:scale-110 active:scale-95`}
                >
                    <link.icon className="w-4 h-4" />
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                aria-label="Copy link"
                className={`w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                    copied
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'text-slate-400 hover:bg-brand-navy hover:text-brand-gold'
                }`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
            </button>
        </div>
    );
}
