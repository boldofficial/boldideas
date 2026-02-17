"use client"

import React from 'react';
import { 
    UserCheck, 
    Store, 
    Globe, 
    Users 
} from 'lucide-react';

const TargetAudience: React.FC = () => {
    const audiences = [
        {
            icon: <UserCheck className="w-8 h-8 text-brand-gold" />,
            title: "Solopreneurs & Consultants",
            description: "You wear multiple hats every day. We help you automate admin work, streamline content creation, and build simple systems so you can focus on clients and revenue — not busywork."
        },
        {
            icon: <Store className="w-8 h-8 text-brand-gold" />,
            title: "Small Business Owners",
            description: "Running a business is already demanding. We implement AI-powered workflows that improve operations, marketing, and customer follow-up — without adding complexity."
        },
        {
            icon: <Globe className="w-8 h-8 text-brand-gold" />,
            title: "Online Businesses & Creators",
            description: "From content planning to audience growth and automated engagement, we help you build AI-enhanced systems that scale your digital presence consistently."
        },
        {
            icon: <Users className="w-8 h-8 text-brand-gold" />,
            title: "Growing Teams (SMBs)",
            description: "As your team expands, inefficiencies multiply. We provide structured AI productivity training and automation systems that improve collaboration, clarity, and output across departments."
        }
    ];

    return (
        <section id="who-we-serve" className="py-24 bg-brand-navy relative overflow-hidden">
            {/* Architectural Flourish */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-gold/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                {/* Section Header */}
                <div className="max-w-4xl mb-12 mx-auto text-center">
                    <div className="flex items-center space-x-4 mb-6 justify-center">
                        <div className="w-8 h-[1px] bg-brand-gold"></div>
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-white/60">
                            Who We Serve
                        </span>
                        <div className="w-8 h-[1px] bg-brand-gold"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 leading-[1.1]">
                        Built for <span className="text-brand-gold italic text-glow-gold">Lean Teams</span> <br className="hidden md:block"/> & Growing Businesses
                    </h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <p className="text-lg text-white/70 font-medium leading-relaxed">
                            AI shouldn’t be reserved for big corporations with massive budgets.
                        </p>
                        <p className="text-lg text-white/70 font-medium leading-relaxed">
                            We help ambitious founders and growing teams use AI practically — <span className="text-white">right where they are.</span>
                        </p>
                    </div>
                </div>

                {/* Audience Grid */}
                <div className="grid md:grid-cols-2 gap-12 border-t border-white/10 pt-16">
                    {audiences.map((item, index) => (
                        <div key={index} className="flex flex-col space-y-6 group">
                            <div className="flex items-start space-x-6">
                                <div className="flex-shrink-0 p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-brand-gold group-hover:border-brand-gold transition-all duration-500">
                                    <div className="group-hover:text-brand-navy transition-colors duration-500">
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/60 leading-relaxed font-medium">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;
