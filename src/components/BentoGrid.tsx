'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BentoGrid: React.FC = () => {
    const services = [
        {
            id: '01',
            category: 'Core Offering',
            title: 'AI Productivity Training',
            image: '/images/rebrand/ai-training-small.png',
            description: 'Practical training designed for non-technical founders and lean teams. Reclaim hours every week by mastering AI for content, admin, and planning.',
            link: '/training'
        },
        {
            id: '02',
            category: 'Enterprise',
            title: 'Team Upskilling',
            image: '/images/rebrand/ai-training-teams.png',
            description: 'Structured AI adoption for departments and firms. Focus on secure usage, team-wide workflows, and department-specific use cases.',
            link: '/training#teams'
        },
        {
            id: '03',
            category: 'Systems',
            title: 'Consulting & Automation',
            image: '/images/rebrand/ai-automation.png',
            description: 'We build the digital backbone of your business—AI assistants and automated reporting that scales.',
            link: '/services#automation'
        },
        {
            id: '04',
            category: 'Marketing',
            title: 'Growth Systems',
            image: '/images/rebrand/marketing-growth.png',
            description: 'SEO strategy and lead capture designed for lean teams. Attract and convert customers consistently.',
            link: '/services#growth'
        },
        {
            id: '05',
            category: 'Development',
            title: 'Websites & Internal Tools',
            image: '/images/rebrand/web-systems.png',
            description: 'Custom admin dashboards and conversion-focused builds that grow alongside your vision.',
            link: '/services#builds'
        }
    ];

    return (
        <section id="services" className="py-0 px-6 lg:px-24 bg-white relative overflow-hidden">
            {/* Subtle Vertical Dividers matching reference */}
            <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-0 hidden lg:flex justify-around px-24">
                <div className="w-[1px] h-full bg-slate-100"></div>
                <div className="w-[1px] h-full bg-slate-100"></div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center text-center mb-16 md:mb-20">
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-brand-gold mb-6 block">
                        Our Capabilities
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy leading-tight uppercase tracking-tighter max-w-2xl mb-6">
                        Precision Systems <br />
                        <span className="text-brand-gold italic">Built for Scale.</span>
                    </h2>
                    <div className="w-12 h-[2px] bg-brand-gold mb-6"></div>
                    <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                        We don't just recommend tools. We build the architecture that helps your business think and act faster.
                    </p>
                </div>

                {/* Structured Pattern Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 lg:gap-y-20 gap-x-12">
                    {services.map((service, index) => {
                        const isEven = (index + 1) % 2 === 0;
                        
                        return (
                            <div key={service.id} className="flex flex-col items-center">
                                {/* Order logic: Img-Text for odd, Text-Img for even (on desktop) */}
                                <div className={`flex flex-col items-center w-full ${isEven ? 'lg:flex-col-reverse' : 'lg:flex-col'}`}>
                                    
                                    {/* Image Container */}
                                    <div className="w-full aspect-square md:aspect-[4/3] relative overflow-hidden border border-slate-100 shadow-sm rounded-sm mb-10 lg:mb-0 group">
                                        <Image 
                                            src={service.image} 
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-all duration-700"></div>
                                    </div>

                                    {/* Text Content */}
                                    <div className={`flex flex-col items-center text-center py-6 lg:py-10 px-4 ${isEven ? 'lg:pb-12' : 'lg:pt-12'}`}>
                                        <span className="hidden text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4">
                                            Capability — 0{index + 1}
                                        </span>
                                        <h3 className="text-base md:text-lg font-black text-brand-navy uppercase tracking-tight mb-4 leading-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-xs">
                                            {service.description}
                                        </p>
                                        <Link 
                                            href={service.link}
                                            className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-navy hover:text-brand-gold transition-colors inline-flex items-center group"
                                        >
                                            View Details
                                            <span className="ml-2 transform group-hover:translate-x-1 transition-all">→</span>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Final Slot for CTA or Placeholder to keep grid balance */}
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 rounded-sm">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6">
                            Next Phase
                        </span>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight text-center mb-8">
                            Custom AI Solutions <br /> for Your Business
                        </h3>
                        <Link href="https://crm.getboldideas.com/book" target="_blank">
                            <button className="px-6 py-3 border border-brand-navy text-brand-navy text-[10px] font-black uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Global Link */}
                <div className="my-4 md:my-8 md:mt-12 pt-12 border-t border-slate-100 flex justify-center">
                    <Link href="/services" className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-navy/40 hover:text-brand-gold transition-colors">
                        View Complete Service Catalog —
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
