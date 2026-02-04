import React from 'react';

const AboutProblemSolution: React.FC = () => {
    return (
        <section className="relative border-y border-brand-navy/5 overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Left: The Friction (The Problem) - Redesigned as System Diagnostic (Slate/Silver Theme) */}
                <div className="flex-1 bg-brand-navy p-10 lg:p-24 relative overflow-hidden group">
                    {/* Animated Grid Texture */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                         style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                    </div>
                    
                    {/* Scanning Bar Animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent h-40 w-full animate-[scan_6s_linear_infinite] pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tighter leading-none">
                            Modern Organizations <br />
                            don't fail because they <br />
                            <span className="text-white/20 italic underline decoration-white/10">lack ideas.</span>
                        </h2>

                        <div className="grid gap-8">
                            <div className="relative flex items-start space-x-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2"></div>
                                <p className="text-white/80 text-lg font-medium leading-relaxed">
                                    They struggle because systems are slow, teams are overwhelmed, and tools don’t talk to each other.
                                </p>
                            </div>
                            <div className="relative flex items-start space-x-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2"></div>
                                <p className="text-white font-black text-xl tracking-tight">
                                    Bold Ideas exists to fix that.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: The Solution (Bold Ideas) */}
                <div className="flex-1 bg-white p-10 lg:p-20 relative overflow-hidden group">
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #002D5B 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-8 h-px bg-brand-gold"></div>
                            <span className="text-[10px] sm:text-xs font-mono text-brand-navy/40 tracking-[0.3em] uppercase">
                                Output // Bold_Ideas
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-10 tracking-tight leading-tight">
                            Trusted AI & Digital <br />
                            <span className="text-brand-gold italic decoration-brand-gold/30">Transformation Partner.</span>
                        </h2>

                        <p className="text-slate-500 font-bold mb-8">We work as your AI implementation and digital growth partner, helping you:</p>

                        <div className="space-y-6 max-w-lg">
                            {[
                                'Reduce manual work with AI automation',
                                'Improve team productivity using practical AI tools',
                                'Build custom internal systems tailored to your operations',
                                'Strengthen marketing, operations, and decision-making with data-driven AI',
                            ].map((msg, i) => (
                                <div key={i} className="flex items-start space-x-5 group/item border-l-2 border-brand-navy/10 pl-6 py-1">
                                    <span className="text-brand-gold font-black mt-1">
                                        ✔
                                    </span>
                                    <p className="text-slate-500 text-sm md:text-base font-medium group-hover/item:text-brand-navy transition-colors leading-snug">
                                        {msg}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutProblemSolution;
