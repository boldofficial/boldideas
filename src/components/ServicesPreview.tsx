"use client"

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { 
    Cpu, 
    Workflow, 
    TrendingUp, 
    MonitorSmartphone, 
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

import { services } from '@/data/services';

const getIcon = (name: string) => {
    switch (name) {
        case 'cpu': return <Cpu className="w-10 h-10 text-brand-gold" />;
        case 'workflow': return <Workflow className="w-10 h-10 text-brand-gold" />;
        case 'trending-up': return <TrendingUp className="w-10 h-10 text-brand-gold" />;
        case 'monitor-smartphone': return <MonitorSmartphone className="w-10 h-10 text-brand-gold" />;
        default: return <Cpu className="w-10 h-10 text-brand-gold" />;
    }
};

const ServicesPreview: React.FC = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        align: 'start',
        loop: false,
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 1 },
            '(min-width: 1024px)': { slidesToScroll: 1 }
        }
    });

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback((emblaApi: any) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section id="services-preview" className="py-24 bg-[#F1F3F9]">
            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="w-8 h-[1px] bg-brand-gold"></div>
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-brand-navy/60">
                            Our Services
                        </span>
                        <div className="w-8 h-[1px] bg-brand-gold"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-brand-navy uppercase tracking-tighter mb-6">
                        How We <span className="text-brand-gold italic">Help You Grow</span> with AI
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Simple, practical solutions designed to help small businesses and solopreneurs work smarter and scale faster.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4 md:-ml-8">
                            {services.map((service, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:pl-8 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                                    <div className="h-full bg-white rounded-[40px] p-10 flex flex-col items-center text-center shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                                        <div className="mb-8">
                                            {getIcon(service.iconName)}
                                        </div>
                                        <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight mb-4">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 leading-relaxed font-medium mb-10 text-sm">
                                            {service.intro}
                                        </p>
                                        <Link 
                                            href="/services" 
                                            className="mt-auto inline-flex items-center px-10 py-3 bg-brand-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-navy transition-all duration-300 shadow-[0_4px_15px_rgba(249,186,81,0.3)]"
                                        >
                                            READ MORE
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-navy hover:bg-brand-gold hover:text-white transition-all z-20 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-navy hover:bg-brand-gold hover:text-white transition-all z-20 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesPreview;
