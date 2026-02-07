import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative h-screen min-h-[800px] w-full overflow-hidden bg-brand-navy"
        >
            {/* Background Image - Artistically Blended Bulb for Dark Theme */}
            <div className="absolute inset-y-0 right-0 w-full md:w-2/3 z-0 pointer-events-none select-none">
                <div 
                    className="absolute bottom-0 right-0 w-full h-full bg-contain bg-right-bottom bg-no-repeat opacity-60 transition-all duration-1000 transform translate-y-16 translathe-x-10"
                    style={{ 
                        backgroundImage: 'url("/hero-bg.png")',
                        maskImage: 'linear-gradient(to top left, black 0%, transparent 90%)',
                        WebkitMaskImage: 'linear-gradient(to top left, black 50%, transparent 90%)',
                    }}
                ></div>
                {/* Dark theme blending layers */}
                <div className="absolute inset-0 bg-linear-to-r from-brand-navy via-brand-navy/20 to-transparent"></div>
            </div>

            <div className="max-w-[1440px] mx-auto h-full w-full relative z-10 px-6 md:px-24">
                <div className="flex flex-col justify-center h-full pt-12 animate-fade-in relative">
                    {/* Subtitle - Pushed Higher with more tracking */}
                    <div className="flex flex-col mb-16">
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-white/60 mb-4">
                            PRACTICAL AI FOR SMALL BUSINESSES & SOLOPRENEURS
                        </span>
                        <div className="w-16 h-[3px] bg-brand-gold"></div>
                    </div>

                    {/* Main Title - Tight Grouping */}
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-4 max-w-5xl uppercase">
                        BOLD IDEAS <br />
                        <span className="text-brand-gold italic">INNOVATIONS.</span>
                    </h1>

                    {/* Description - White for Navy Background */}
                    <p className="text-lg md:text-xl text-white/80 max-w-xl mb-12 leading-relaxed font-bold">
                        We help small businesses and solopreneurs work smarter, market better, and scale faster using practical AI and automation.
                    </p>

                    {/* Bottom Action Card - High Contrast White */}
                    <div className="absolute bottom-32 left-0 bg-whddite p-d10 mdd:p-14 md:pdb-20 shadow-[40px_0_100px_-20px_rgba(0,0,0,0.3)] borderd-t-8 border-brand-gold max-w-md group z-20">
                        {/* <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30 mb-4d">
                            Our Mission
                        </h3> */}
                        {/* <p className="text-brand-navy font-bold text-xl mb-12 italic leading-snug">
                            Helping non-technical founders adopt AI that delivers real results.
                        </p> */}
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

