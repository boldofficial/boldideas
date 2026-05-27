import React from 'react';

const AboutApproach: React.FC = () => {
    return (
        <section className="py-12 bg-white relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto relative z-10 px-6 md:px-16 lg:px-24">
                <div className="mb-20 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black text-brand-navy tracking-[0.3em] leading-none">
                        <span className="text-brand-navy">Our </span>
                        <span className="text-brand-gold italic">Approach</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute left-0 top-[40px] w-full h-[1px] bg-slate-100 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
                        {[
                            { step: '01', title: 'Discover', desc: 'We audit your specific operations to find the highest-impact automation opportunities.' },
                            { step: '02', title: 'Design', desc: 'We Architect custom AI workflows and digital systems tailored to your unique scaling needs.' },
                            { step: '03', title: 'Deploy', desc: 'We implement and integrate the tools directly into your daily operations—no downtime, just results.' },
                            { step: '04', title: 'Train', desc: 'We provide hands-on AI productivity training to ensure your team is confident and automated.' },
                            { step: '05', title: 'Support & Scale', desc: 'We provide ongoing implementation support to refine and scale your systems as you grow.' },
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 group">
                                <div className="mb-6 lg:mb-10 flex justify-center">
                                    <div className="w-20 h-20 bg-white border border-slate-100 flex items-center justify-center font-black text-brand-navy group-hover:bg-brand-navy group-hover:text-brand-gold group-hover:border-brand-navy transition-all duration-500 shadow-sm relative">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="text-center px-2">
                                    <h4 className="text-lg font-black uppercase tracking-tight text-brand-navy mb-3">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutApproach;
