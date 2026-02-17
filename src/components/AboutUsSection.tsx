"use client"

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const AboutUsSection: React.FC = () => {
    const points = [
        "Turn AI into real workflows",
        "Automate repetitive tasks",
        "Improve productivity without overwhelm",
        "Build simple digital systems that scale"
    ];

    return (
        <section id="about" className="py-24 bg-brand-navy text-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 blur-[120px] rounded-full translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/2"></div>

            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Heading */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-[2px] bg-brand-gold"></div>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-gold">
                                About Bold Ideas
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase tracking-tighter">
                            We Don’t Just <br />
                            <span className="text-brand-gold italic">Teach AI.</span> <br />
                            We Implement It.
                        </h2>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex flex-col space-y-8">
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                            Bold Ideas is an AI-first consulting and digital growth company built to help small businesses and solopreneurs work smarter.
                        </p>
                        
                        <p className="text-base text-white/70 leading-relaxed">
                            We saw a problem: Many business owners know AI is powerful — but they don’t know how to apply it practically in their daily operations. That’s where we come in.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {points.map((point, index) => (
                                <div key={index} className="flex items-start space-x-3 group">
                                    <CheckCircle2 className="w-5 h-5 text-brand-gold mt-1 flex-shrink-0" />
                                    <span className="text-sm md:text-base font-bold text-white/90 group-hover:text-brand-gold transition-colors italic">
                                        {point}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-base text-white/70 leading-relaxed pt-4 border-t border-white/10">
                            Our approach is practical, hands-on, and tailored to your business — not generic templates or complicated tech setups.
                        </p>

                        <div className="pt-2">
                            <Link 
                                href="/about" 
                                className="inline-flex items-center space-x-2 text-brand-gold font-bold text-sm uppercase tracking-widest hover:text-white transition-colors group/link"
                            >
                                <span>Read More about Our Story</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
