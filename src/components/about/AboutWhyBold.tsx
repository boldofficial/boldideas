import React from 'react';

const AboutWhyBold: React.FC = () => {
    return (
        <section className="py-12 bg-brand-navy relative overflow-hidden">
            {/* Background Tech Decal */}
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                <div className="text-[200px] font-black leading-none text-white select-none">
                    BOLD
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10 px-6 md:px-16 lg:px-24">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        {/* <div className="inline-flex items-center space-x-2 bg-white/5 px-2 py-1 mb-6 border-l-2 border-brand-gold">
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
                                Unique_Value_Proposition
                            </p>
                        </div> */}
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                            Why <br />
                            <span className="text-brand-gold italic text-4xl lg:text-6xl">Bold Ideas?</span>
                        </h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md italic mb-12">
                            We don’t just deliver tools. <br />
                            <span className="text-white font-black not-italic border-t border-white/10 pt-4 mt-4 block">We build capacity, systems, and results.</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            'We turn abstract AI concepts into concrete workflows',
                            'Practical automation that saves you hours every week',
                            'Simplified tech systems designed for real growth',
                            'A results-first approach—no fluff, just implementation',
                            'Partner-level support to ensure your long-term success'
                        ].map((spec, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-6 p-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-gold/30 transition-all group">
                                <div className="w-10 h-10 flex items-center justify-center border border-brand-gold text-brand-gold font-mono text-xs">
                                    ✔
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm leading-snug italic">{spec}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutWhyBold;
