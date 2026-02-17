import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative min-h-screen w-full overflow-hidden bg-white flex items-center"
        >
             {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0 select-none">
                 <Image
                    src="/hero-bg-people.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-50"
                    priority
                 />
                 {/* White Fade Overlay */}
                 <div className="absolute inset-0 bg-white/20"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/30"></div>
            </div>

            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24 py-20 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col animate-fade-in relative max-w-2xl order-2 lg:order-1">
                         {/* Subtitle */}
                        <div className="flex flex-col mb-6">
                             <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.45em] text-brand-navy mb-4">
                                AI & AUTOMATION FOR AMBITIOUS BUSINESSES
                             </span>
                             <div className="w-16 h-[3px] bg-brand-gold"></div>
                        </div>

                         {/* Headline */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-brand-navy leading-[1.1] tracking-wide mb-6 uppercase">
                            <span className="block">Stop Working Harder.</span>
                            <span className="block text-brand-gold italic">Start Working Smarter with AI.</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base md:text-lg text-brand-navy/80 max-w-xl mb-10 leading-relaxed font-bold">
                            We help small businesses and solopreneurs implement practical AI systems, automation, and productivity workflows that save time, increase revenue, and eliminate overwhelm.
                        </p>

                         {/* CTA */}
                        <div className="group">
                             <Link
                                href="https://crm.getboldideas.com/book"
                                target="_blank"
                                className="inline-flex items-center px-8 py-5 bg-brand-gold text-brand-navy text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white hover:text-brand-navy shadow-[0_0_20px_rgba(249,186,81,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                            >
                                BOOK A CONSULTATION
                                <svg className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Illustration */}
                    <div className="relative h-full flex justify-center items-center order-1 lg:order-2 animate-fade-in delay-200">
                        <div className="relative w-full max-w-[500px] lg:max-w-[650px] aspect-square">
                            <div className="absolute inset-0 bg-brand-gold/20 blur-[100px] rounded-full"></div>
                             <Image
                                src="/hero-illustration-removebg-preview.png"
                                alt="AI Automation Illustration"
                                fill
                                className="object-contain drop-shadow-2xl animate-float"
                                priority
                             />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

