import React from 'react';

const AboutTargetAudience: React.FC = () => {
    return (
        <section className="py-12 bg-white relative overflow-hidden">

            <div className="max-w-[1440px] mx-auto relative z-10 px-6 md:px-16 lg:px-24">
                <div className="bg-white rounded-xl p-10 lg:p-16 shadow-[0_32px_64px_-16px_rgba(0,45,91,0.1)] border border-slate-100 flex flex-col lg:flex-row gap-16 lg:items-start">

                    {/* Left: Branding & Intent */}
                    <div className="lg:w-[35%] w-full">
                        <h2 className="text-5xl font-black text-brand-navy tracking-tighter leading-[0.9] mb-10">
                            Who We <br />
                            <span className="text-brand-gold italic">Serve</span>
                        </h2>
                        <div className="space-y-6">
                            <p className="text-slate-500 text-lg font-bold leading-tight">
                                We work with:
                            </p>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] italic">
                                If your organization wants to <span className="text-brand-navy font-bold">use AI productively</span>—not experiment endlessly—Bold Ideas is for you.
                            </p>
                        </div>
                    </div>

                    {/* Right: The Service Grid / Matrix */}
                    <div className="lg:w-[65%] w-full space-y-4">
                        {[
                            { name: 'Solopreneurs & High-Value Consultants', id: '01', focus: 'AUTOMATION' },
                            { name: 'Small & Medium Businesses', id: '02', focus: 'EFFICIENCY' },
                            { name: 'Corporate Teams & Organizations', id: '03', focus: 'PRODUCTIVITY' },
                            { name: 'Schools & Training Institutions', id: '04', focus: 'CAPACITY' },
                            { name: 'NGOs & Community Ecosystems', id: '05', focus: 'MISSION' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group flex md:flex-row flex-col md:items-center justify-between p-6 bg-slate-50/50 border border-slate-100/50 rounded-lg hover:bg-white hover:border-brand-gold/20 hover:shadow-xl hover:shadow-brand-navy/5 transition-all duration-500">
                                
                                <div className="flex items-center space-x-6">
                                    {/* Diagnostic Disc */}
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                        <div className="absolute w-3 h-3 rounded-full border border-brand-gold/30 animate-ping"></div>
                                    </div>
                                    
                                    <h4 className="text-lg font-extrabold text-brand-navy/90 group-hover:text-brand-navy transition-colors">
                                        {item.name}
                                    </h4>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center mt-4 md:mt-0">
                                    <span className="px-3 py-1 bg-white border border-slate-200 text-[8px] font-black tracking-widest text-slate-400 group-hover:text-brand-navy group-hover:border-brand-navy transition-all uppercase">
                                        {item.focus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutTargetAudience;
