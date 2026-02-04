import React from 'react';
import Link from 'next/link';
import { BookingForm } from './BookingForm';

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

                        <h2 className="text-4xl md:text-6xl font-black text-brand-navy uppercase tracking-tighter leading-none mb-10">
                            Ready to Make <br />
                            AI Work For Your <br />
                            <span className="text-brand-gold italic">Organization?</span>
                        </h2>

                        <div className="space-y-6">
                            <p className="text-slate-500 text-lg font-bold leading-relaxed max-w-xl">
                                Whether you want to:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Train your team on AI productivity',
                                    'Automate internal processes',
                                    'Improve digital marketing performance',
                                    'Build custom AI-powered tools'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-slate-500 text-sm font-medium">
                                        <span className="text-brand-gold">👉</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-brand-navy text-lg font-black italic border-t border-brand-navy/5 pt-6">
                                Bold Ideas is ready to partner with you.
                            </p>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="w-full">
                         <div className="relative z-10">
                            <BookingForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
