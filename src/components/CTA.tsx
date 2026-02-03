import React from 'react';
import Link from 'next/link';

const CTA: React.FC = () => {
    return (
        <section id="consultation" className="relative py-32 px-6 lg:px-24 bg-white overflow-hidden">
            {/* Architectural Grid Backdrop - Darker for White BG */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.05]" 
                    style={{ 
                        backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', 
                        backgroundSize: '80px 80px' 
                    }}></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content Block */}
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-4 mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
                                Ready to Work Smarter With AI?
                            </span>
                            <div className="w-12 h-[1px] bg-brand-gold/30"></div>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-brand-navy uppercase tracking-tighter leading-none mb-10">
                            Build Your <br />
                            <span className="text-brand-gold italic">Digital Edge.</span>
                        </h2>

                        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                            Whether you're a solopreneur trying to do more with less, or a growing team ready to upskill with AI— <span className="text-brand-navy italic">Bold Ideas is your AI partner.</span>
                        </p>
                    </div>

                    {/* Right: Triple Action Layout */}
                    <div className="grid gap-4">
                        {/* Primary: Book Consultation */}
                        <Link href="/contact" className="group relative bg-brand-navy p-8 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-brand-navy/10">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">01 // Primary Action</span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Book a Consultation</h3>
                            </div>
                            <div className="mt-8 flex items-center justify-between relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Start Engineering →</span>
                                <div className="w-12 h-12 rounded-sm border border-white/10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-brand-gold" stroke="currentColor" strokeWidth="3">
                                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            {/* Animated Background Text Decoration */}
                            <div className="absolute -bottom-4 -right-8 text-8xl font-black text-white/[0.03] italic pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">STRATEGY</div>
                        </Link>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Secondary: Join Training */}
                            <Link href="/services#training" className="group bg-slate-50 border border-slate-100 p-8 transition-all duration-500 hover:border-brand-gold/30 hover:bg-white hover:shadow-xl hover:shadow-brand-gold/5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4 block">Action 02</span>
                                <h4 className="text-lg font-black text-brand-navy uppercase tracking-tight mb-2">Join AI Training</h4>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Hands-on implementation for teams.</p>
                                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest group-hover:underline">Browse Programs →</span>
                            </Link>

                            {/* Tertiary: Build Smarter Systems */}
                            <Link href="/services#systems" className="group bg-slate-50 border border-slate-100 p-8 transition-all duration-500 hover:border-brand-gold/30 hover:bg-white hover:shadow-xl hover:shadow-brand-gold/5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4 block">Action 03</span>
                                <h4 className="text-lg font-black text-brand-navy uppercase tracking-tight mb-2">Build Systems</h4>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Scalable automation & tools.</p>
                                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest group-hover:underline">View Capabilities →</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
