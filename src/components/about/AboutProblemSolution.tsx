import React from 'react';

const AboutProblemSolution: React.FC = () => {
    const points = [
        "Turn AI into real workflows",
        "Automate repetitive tasks",
        "Improve productivity without overwhelm",
        "Build simple digital systems that scale"
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Heading */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-[2px] bg-brand-gold"></div>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-navy/60">
                                About Bold Ideas
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight uppercase tracking-tighter text-brand-navy">
                            We Don’t Just <br />
                            <span className="text-brand-gold italic">Teach AI.</span> <br />
                            We Implement It.
                        </h2>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex flex-col space-y-8">
                        <p className="text-lg md:text-xl text-brand-navy font-bold leading-relaxed">
                            Bold Ideas is an AI-first consulting and digital growth company built to help small businesses and solopreneurs work smarter.
                        </p>
                        
                        <p className="text-base text-slate-500 leading-relaxed font-medium">
                            We saw a problem: Many business owners know AI is powerful — but they don’t know how to apply it practically in their daily operations. That’s where we come in.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            {points.map((point, index) => (
                                <div key={index} className="flex items-start space-x-3 group">
                                    <div className="w-5 h-5 rounded-full border border-brand-gold flex items-center justify-center mt-1 flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                    </div>
                                    <span className="text-sm md:text-base font-bold text-brand-navy group-hover:text-brand-gold transition-colors italic">
                                        {point}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-base text-slate-500 leading-relaxed pt-8 border-t border-slate-100 font-medium">
                            Our approach is practical, hands-on, and tailored to your business — not generic templates or complicated tech setups.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutProblemSolution;
