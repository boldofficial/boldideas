import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative h-screen w-full overflow-hidden bg-brand-navy"
        >
            {/* Background Image - Better positioned bulb */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[55%] z-0 pointer-events-none select-none">
                <div 
                    className="absolute bottom-0 right-[-5%] w-[85%] h-[85%] bg-contain bg-right-bottom bg-no-repeat opacity-50 transition-all duration-1000"
                    style={{ 
                        backgroundImage: 'url("/hero-bg.png")',
                        maskImage: 'radial-gradient(ellipse at center right, black 20%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center right, black 20%, transparent 75%)',
                    }}
                ></div>
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/40 to-transparent"></div>
            </div>

            <div className="max-w-[1440px] mx-auto h-full w-full relative z-10 px-6 md:px-16 lg:px-24">
                <div className="flex flex-col justify-center h-full animate-fade-in relative max-w-4xl">
                    {/* Subtitle with better spacing */}
                    <div className="flex flex-col mb-8">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.45em] text-white/50 mb-4">
                            AI & AUTOMATION FOR AMBITIOUS BUSINESSES
                        </span>
                        <div className="w-20 h-[2px] bg-brand-gold"></div>
                    </div>

                    {/* Main Title - Letter spacing + no line breaks */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-wide mb-8 uppercase">
                        <span className="block">WORK SMARTER.</span>
                        <span className="block text-brand-gold italic">SCALE FASTER.</span>
                    </h1>

                    {/* Punchier, shorter description */}
                    <p className="text-base md:text-lg lg:text-xl text-white/75 max-w-2xl mb-12 leading-relaxed font-medium">
                        Automate operations, sharpen marketing, and unlock growth with practical AI solutions built for small businesses and solopreneurs.
                    </p>

                    {/* CTA with better visual weight */}
                    <div className="group">
                        <Link 
                            href="https://crm.getboldideas.com/book" 
                            target="_blank"
                            className="inline-flex items-center px-8 py-4 bg-brand-gold text-brand-navy text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 hover:bg-brand-gold/90 hover:translate-x-1 hover:shadow-lg"
                        >
                            BOOK A CONSULTATION
                            <svg className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;