import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative h-screen w-full overflow-hidden bg-brand-navy"
        >
            {/* Background Image - Smaller Bulb */}
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2 z-0 pointer-events-none select-none">
                <div 
                    className="absolute bottom-0 right-0 w-full h-full bg-contain bg-right-bottom bg-no-repeat opacity-60 transition-all duration-1000"
                    style={{ 
                        backgroundImage: 'url("/hero-bg.png")',
                        maskImage: 'radial-gradient(circle at center, black 0%, transparent 85%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 85%)',
                    }}
                ></div>
                {/* Dark theme blending layers */}
                <div className="absolute inset-0 bg-linear-to-r from-brand-navy via-brand-navy/20 to-transparent"></div>
            </div>

            <div className="max-w-[1440px] mx-auto h-full w-full relative z-10 px-6 md:px-24">
                <div className="flex flex-col justify-center h-full animate-fade-in relative">
                    {/* Subtitle - Reduced bottom margin */}
                    <div className="flex flex-col mb-6">
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-white/60 mb-3">
                            AI & AUTOMATION FOR AMBITIOUS BUSINESSES
                        </span>
                        <div className="w-16 h-[3px] bg-brand-gold"></div>
                    </div>

                    {/* Main Title - Larger fonts, tighter spacing */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-6 max-w-5xl uppercase">
                        <span className="text-brand-gold">WORK SMARTER.</span> <br />
                        <span className="text-brand-gold italic">SCALE FASTER.</span>
                    </h1>

                    {/* Description - Reduced bottom margin */}
                    <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-bold">
                        We help small businesses and solopreneurs automate operations, sharpen marketing, and unlock growth with practical AI solutions that deliver real results.
                    </p>

                    {/* Bottom Action Card */}
                    <div className="shadow-[40px_0_100px_-20px_rgba(0,0,0,0.3)] max-w-md group z-20">
                        <Link 
                            href="https://crm.getboldideas.com/book" 
                            target="_blank"
                            className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-brand-gold transition-all group-hover:translate-x-2"
                        >
                            BOOK A CONSULTATION
                            <svg className="ml-4 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;