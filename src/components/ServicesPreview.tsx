"use client"

import React from 'react';
import Link from 'next/link';
import { 
    Cpu, 
    Workflow, 
    TrendingUp, 
    MonitorSmartphone, 
    ArrowRight 
} from 'lucide-react';

const ServicesPreview: React.FC = () => {
    const services = [
        {
            icon: <Cpu className="w-8 h-8 text-brand-gold" />,
            title: "AI Productivity Training",
            subtitle: "Train Smarter. Work Faster.",
            description: "Hands-on AI training designed for solopreneurs and small teams to automate daily tasks, improve workflows, and boost productivity immediately."
        },
        {
            icon: <Workflow className="w-8 h-8 text-brand-gold" />,
            title: "AI Workflow Automation",
            subtitle: "Automate What Slows You Down.",
            description: "We design simple AI-powered workflows that reduce repetitive tasks, improve efficiency, and free up your time for growth."
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-brand-gold" />,
            title: "AI-Powered Marketing Systems",
            subtitle: "Attract & Convert Consistently.",
            description: "From SEO to automated follow-ups, we build marketing systems that help you generate leads and grow sustainably."
        },
        {
            icon: <MonitorSmartphone className="w-8 h-8 text-brand-gold" />,
            title: "Websites & Custom Tools",
            subtitle: "Build Systems That Scale.",
            description: "Conversion-focused websites, dashboards, and tailored digital tools designed around your business needs."
        }
    ];

    return (
        <section id="services-preview" className="py-24 bg-white">
            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
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

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {services.map((service, index) => (
                        <div 
                            key={index} 
                            className="p-10 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(249,186,81,0.15)] transition-all duration-500 flex flex-col items-start group hover:-translate-y-1"
                        >
                            <div className="p-4 bg-brand-navy rounded-2xl mb-8 group-hover:bg-brand-gold transition-colors duration-500">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight mb-2">
                                {service.title}
                            </h3>
                            <p className="text-sm font-black text-brand-gold uppercase tracking-widest mb-4 italic">
                                {service.subtitle}
                            </p>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center pt-8 border-t border-slate-100">
                    <h3 className="text-2xl md:text-3xl font-black text-brand-navy uppercase tracking-tight mb-4">
                        Ready to See <span className="text-brand-gold italic">How It Works?</span>
                    </h3>
                    <p className="text-slate-500 font-medium mb-10 max-w-xl mx-auto">
                        Explore our full range of services and discover how Bold Ideas can help you build a smarter business.
                    </p>
                    <Link 
                        href="/services" 
                        className="inline-flex items-center space-x-3 px-10 py-5 bg-brand-navy text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 shadow-xl group"
                    >
                        <span>View All Services</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesPreview;
