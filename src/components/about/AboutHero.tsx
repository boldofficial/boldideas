import React from 'react';

const AboutHero: React.FC = () => {
    return (
        <section className="relative min-h-[75vh] flex items-center px-6 lg:px-24 py-24 overflow-hidden bg-brand-navy">
            {/* Background Image: Strategic AI Masterclass */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/corporate_hero.png" 
                    alt="Strategic AI Masterclass" 
                    className="w-full h-full object-cover opacity-50 contrast-125 transition-transform duration-[15s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/70 to-brand-navy/30"></div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10 w-full">
                <div className="max-w-3xl">
                    {/* Subtitle / Strategic Tag */}
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-6 h-[2px] bg-brand-gold"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
                            About Bold Ideas
                        </span>
                    </div>
                    
                    {/* Corporate Flagship Heading */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight uppercase mb-10">
                        <span className="tracking-[0.3em]">Your AI Partner</span> <br />
                        <span className="tracking-[0.3em]">For Smarter Work,</span> <br />
                        <span className="text-brand-gold italic tracking-[0.3em]">Faster Growth.</span>
                    </h1>

                    {/* Unified Narrative Block */}
                    <div className="relative pl-6 md:pl-10 border-l border-brand-gold/20">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-medium leading-relaxed mb-8 max-w-xl text-justify">
                            We help businesses, institutions, and organizations implement AI, automation, and digital systems that actually work.
                        </p>

                        <div className="pt-8 border-t border-white/5">
                            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
                                At Bold Ideas, we don’t just talk about artificial intelligence—we <span className="text-brand-gold font-bold">deploy it into real workflows</span>, train your teams to use it confidently, and help you unlock measurable productivity, efficiency, and growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
