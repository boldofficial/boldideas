"use client"

import React from 'react';
import Link from 'next/link';
import { 
    HeartPulse, 
    GraduationCap, 
    LayoutGrid, 
    CheckCircle2, 
    ArrowRight,
    MessageSquare,
    PlayCircle
} from 'lucide-react';

const ReadyMadeSolutions: React.FC = () => {
    const products = [
        {
            icon: <HeartPulse className="w-8 h-8 text-brand-gold" />,
            title: "Ezer",
            subtitle: "Home Care Management System",
            description: "A complete internal management platform designed for care homes and home-care providers.",
            idealFor: "Care agencies, assisted living providers, private caregivers",
            capabilities: [
                "Staff & caregiver management",
                "Client tracking & reporting",
                "Operational dashboards",
                "Secure internal workflows"
            ],
            footer: "Customizable to match your care model and processes."
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-brand-gold" />,
            title: "School Management System",
            subtitle: "Smart Administration for Modern Schools",
            description: "A powerful digital system designed to manage academic, administrative, and operational activities efficiently.",
            idealFor: "Private schools, growing institutions, education providers",
            capabilities: [
                "Student & staff management",
                "Results & report cards",
                "Finance & fee tracking",
                "Parent & communication portal"
            ],
            footer: "Available as SaaS or fully customized deployment."
        },
        {
            icon: <LayoutGrid className="w-8 h-8 text-brand-gold" />,
            title: "Classified Ads & Directory",
            subtitle: "Launch Your Own Marketplace Platform",
            description: "A scalable classifieds and business listing platform tailored for communities, regions, or niche markets.",
            idealFor: "Community leaders, local entrepreneurs, regional platforms",
            capabilities: [
                "Classified listings",
                "Business directory",
                "Event promotion",
                "Monetization features"
            ],
            footer: "Fully customizable with branding and payment integrations."
        }
    ];

    return (
        <section id="solutions" className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                {/* Section Header */}
                <div className="max-w-4xl mb-12 mx-auto text-center">
                    <div className="flex items-center space-x-4 mb-6 justify-center">
                        <div className="w-8 h-[1px] bg-brand-gold"></div>
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-brand-navy/60">
                            Our Products
                        </span>
                        <div className="w-8 h-[1px] bg-brand-gold"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-brand-navy uppercase tracking-tighter mb-6">
                        Ready-Made Solutions You Can <span className="text-brand-gold italic">Launch Immediately</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Beyond consulting and training, we’ve built powerful systems you can deploy, customize, and scale for your organization.
                    </p>
                </div>

                {/* Product Cards Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-24">
                    {products.map((product, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(249,186,81,0.15)] transition-all duration-500 hover:-translate-y-2 group"
                        >
                            <div className="mb-8 p-4 bg-slate-50 rounded-2xl w-fit group-hover:bg-brand-gold group-hover:text-brand-navy transition-colors duration-500">
                                {product.icon}
                            </div>
                            
                            <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight mb-1">
                                {product.title}
                            </h3>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-6 italic">
                                {product.subtitle}
                            </p>
                            
                            <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium">
                                {product.description}
                            </p>

                            <div className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-3 block">Ideal For:</span>
                                <p className="text-xs font-bold text-brand-navy/80">{product.idealFor}</p>
                            </div>

                            <div className="mb-10 space-y-3 flex-grow">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-1 block">Key Capabilities:</span>
                                {product.capabilities.map((cap, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                                        <span className="text-xs font-medium text-slate-600">{cap}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-50 mt-auto">
                                <p className="text-[10px] font-bold text-slate-400 italic mb-6">
                                    👉 {product.footer}
                                </p>
                                <Link 
                                    href="/contact" 
                                    className="inline-flex items-center space-x-2 text-brand-navy font-black text-xs uppercase tracking-widest hover:text-brand-gold transition-colors group/link"
                                >
                                    <span>Learn More</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="bg-brand-navy rounded-[50px] p-12 md:p-20 relative overflow-hidden text-center text-white">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
                            Looking for a <span className="text-brand-gold italic">Custom Solution?</span>
                        </h3>
                        <p className="text-white/60 font-medium mb-12">
                            We can adapt any of our systems to your industry — or build something entirely new around your needs.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link 
                                href="/contact" 
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-5 bg-brand-gold text-brand-navy text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white transition-all duration-300 shadow-xl group"
                            >
                                <PlayCircle className="w-4 h-4" />
                                <span>Request a Demo</span>
                            </Link>
                            <Link 
                                href="/contact" 
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-5 bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/20 transition-all duration-300 border border-white/10 group"
                            >
                                <span>Discuss Customization</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReadyMadeSolutions;
