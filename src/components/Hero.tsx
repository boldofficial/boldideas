import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative min-h-screen lg:h-screen w-full lg:overflow-hidden bg-white flex items-center pt-[88px] pb-12 lg:pb-0"
        >
            <div className="absolute inset-0 z-0 select-none bg-[radial-gradient(circle_at_80%_20%,rgba(249,186,81,0.22),transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#e8eef6_100%)]">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#072a52 1px, transparent 1px), linear-gradient(90deg, #072a52 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
                <div className="absolute right-0 top-24 h-[70%] w-[55%] bg-gradient-to-l from-brand-navy/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/45"></div>
            </div>

            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col animate-fade-in relative order-2 lg:order-1 text-center lg:text-left">
                         {/* Headline */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-brand-navy leading-[1.1] tracking-wide mb-4 uppercase">
                            <span className="block">Stop Working Harder.</span>
                            <span className="block text-brand-gold italic">Start Working Smarter with AI.</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base md:text-lg text-brand-navy/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-bold">
                            We help small businesses and solopreneurs implement practical AI systems, automation, and productivity workflows that save time, increase revenue, and eliminate overwhelm.
                        </p>

                         {/* CTA */}
                        <div className="group">
                             <Link
                                href="/book"
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
                    <div className="relative flex justify-center items-center order-1 lg:order-2 animate-fade-in delay-200">
                        <div className="relative w-full max-w-[320px] md:max-w-[450px] lg:max-w-[620px] aspect-square animate-float">
                            <div className="absolute inset-0 bg-brand-gold/20 blur-[60px] md:blur-[100px] rounded-full"></div>
                            <div className="absolute inset-[10%] rounded-full border border-brand-navy/10 bg-white/70 backdrop-blur shadow-2xl"></div>
                            <div className="absolute left-[18%] top-[22%] h-24 w-24 rounded-2xl bg-brand-navy shadow-xl rotate-[-10deg]"></div>
                            <div className="absolute right-[18%] top-[18%] h-28 w-28 rounded-full bg-brand-gold shadow-xl"></div>
                            <div className="absolute bottom-[20%] left-[24%] h-28 w-36 rounded-3xl bg-white border border-brand-navy/10 shadow-xl rotate-[8deg]"></div>
                            <div className="absolute bottom-[26%] right-[22%] h-24 w-24 rounded-2xl bg-brand-navy/90 shadow-xl rotate-[12deg]"></div>
                            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white border border-brand-gold/40 shadow-2xl flex items-center justify-center">
                                <span className="text-5xl font-black text-brand-navy">AI</span>
                            </div>
                            <div className="absolute left-[29%] top-[34%] h-px w-[42%] bg-brand-gold/70 rotate-[14deg]"></div>
                            <div className="absolute left-[32%] top-[58%] h-px w-[38%] bg-brand-navy/30 rotate-[-16deg]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

