"use client"

import React from 'react';

const StorySection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    
    const slides = [
        {
            text: "At Bold Ideas, we specialize in helping non-technical founders and growing teams adopt AI in ways that deliver real results—without complexity, hype, or wasted tools.",
            label: "The Bold Ideas Promise"
        },
        {
            text: "We believe technology should be invisible. Our goal is to build systems so seamless that you forget they're there, leaving you free to focus on what only you can do.",
            label: "Our Core Drive"
        },
        {
            text: "Automation isn't just about efficiency; it's about freedom. We build the digital backbone that gives you back your most valuable asset: your time.",
            label: "Mission Philosophy"
        }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section
            id="aboutus"
            className="relative py-16 px-6 md:px-24 bg-white overflow-hidden"
        >
            <div className="max-w-[1440px] mx-auto relative z-10">
                {/* Section Header - Architectural Style */}
                <div className="flex flex-col mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-[2px] bg-brand-gold"></div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-navy/60">
                            Our Philosophy
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy leading-tight tracking-tighter uppercase max-w-3xl">
                        Built for Founders, <br />
                        <span className="text-brand-gold italic">Creators & Growing</span> <br />
                        Businesses.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                    {/* Left Column: Focal Statement Carousel */}
                    <div className="relative">
                        <p className="text-xl md:text-2xl text-slate-800 font-bold leading-relaxed mb-8">
                            Small businesses don't need more apps. They need <span className="text-brand-navy italic">systems that save time</span>, reduce stress, and increase revenue.
                        </p>
                        
                        <div className="bg-brand-navy p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl min-h-[380px] flex flex-col justify-between">
                            {/* Decorative Gold Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-[60px] rounded-full"></div>
                            
                            <div className="relative z-10 h-full">
                                {slides.map((slide, idx) => (
                                    <div 
                                        key={idx}
                                        className={`transition-all duration-700 absolute inset-0 ${
                                            idx === currentSlide 
                                            ? "opacity-100 translate-x-0" 
                                            : "opacity-0 translate-x-8 pointer-events-none"
                                        }`}
                                    >
                                        <p className="text-lg md:text-xl font-medium leading-relaxed italic opacity-90">
                                            &ldquo;{slide.text}&rdquo;
                                        </p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-auto relative z-20 pt-10 border-t border-white/10 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
                                    {slides[currentSlide].label}
                                </span>
                                <div className="flex space-x-3">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                idx === currentSlide 
                                                ? "bg-brand-gold w-6" 
                                                : "bg-white/20 hover:bg-white/40"
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Benefits List */}
                    <div className="space-y-12">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-navy mb-8 border-b border-gray-100 pb-4">
                            Bold Ideas exists to help you:
                        </h3>
                        
                        <div className="grid gap-10">
                            {[
                                {
                                    title: "Use AI to reclaim hours every week",
                                    desc: "Turn time-consuming manual processes into swift, automated workflows."
                                },
                                {
                                    title: "Automate routine business tasks",
                                    desc: "Focus on your genius while AI handles the repetitive administrative heavy lifting."
                                },
                                {
                                    title: "Improve marketing consistency and reach",
                                    desc: "Deploy AI-enhanced systems that speak your brand voice across every channel."
                                },
                                {
                                    title: "Build simple, scalable digital systems",
                                    desc: "No bloated software. Just lean, efficient tools that grow with your ambition."
                                },
                                {
                                    title: "Stay competitive—without hiring a large team",
                                    desc: "Leverage AI to punch way above your weight class in any market."
                                }
                            ].map((benefit, idx) => (
                                <div key={idx} className="group flex items-start space-x-6">
                                    <span className="text-brand-gold font-black text-sm italic mt-1 transition-transform group-hover:translate-x-1">
                                        0{idx + 1}.
                                    </span>
                                    <div>
                                        <h4 className="text-base font-black text-brand-navy uppercase tracking-tight mb-2">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
