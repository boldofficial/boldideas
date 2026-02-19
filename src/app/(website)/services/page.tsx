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

import ServicesHero from '@/components/services/ServicesHero';

const ServicesPage: React.FC = () => {
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

    const services = [
        {
            icon: <Cpu className="w-10 h-10 text-brand-gold" />,
            title: "AI Productivity Training",
            description: "Hands-on AI training designed for solopreneurs and small teams to automate daily tasks, improve workflows, and boost productivity immediately."
        },
        {
            icon: <Workflow className="w-10 h-10 text-brand-gold" />,
            title: "AI Workflow Automation",
            description: "We design simple AI-powered workflows that reduce repetitive tasks, improve efficiency, and free up your time for growth."
        },
        {
            icon: <TrendingUp className="w-10 h-10 text-brand-gold" />,
            title: "AI-Powered Marketing Systems",
            description: "From SEO to automated follow-ups, we build marketing systems that help you generate leads and grow sustainably."
        },
        {
            icon: <MonitorSmartphone className="w-10 h-10 text-brand-gold" />,
            title: "Websites & Custom Tools",
            description: "Conversion-focused websites, dashboards, and tailored digital tools designed around your business needs."
        }
    ];

    return (
        <div className="bg-[#F1F3F9] min-h-screen">
            <ServicesHero />
            
            <section id="services-grid" className="py-24">
                <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                    {/* Carousel Container */}
                    <div className="relative group">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex -ml-4 md:-ml-8">
                                {services.map((service, index) => (
                                    <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:pl-8 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                                        <div className="h-full bg-white rounded-[40px] p-10 flex flex-col items-center text-center shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                                            <div className="mb-8">
                                                {service.icon}
                                            </div>
                                            <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight mb-4">
                                                {service.title}
                                            </h3>
                                            <p className="text-slate-500 leading-relaxed font-medium mb-10 text-sm">
                                                {service.description}
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
        </div>
    );
};

export default ServicesPage;
