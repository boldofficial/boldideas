import Link from 'next/link';

const CTA: React.FC = () => {
    return (
        <section id="consultation" className="relative py-12 px-6 bg-white overflow-hidden">
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

                    {/* Right: Booking Link Panel */}
                    <div className="w-full">
                         <div className="relative group">
                            <div className="absolute inset-0 bg-brand-gold blur-2xl opacity-10 group-hover:opacity-20 transition-opacity rounded-3xl"></div>
                            <div className="relative bg-brand-navy p-12 lg:p-16 border border-white/10 shadow-2xl overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-white/10 -translate-x-4 translate-y-4"></div>

                                <div className="relative z-10 text-center">
                                    <div className="w-20 h-20 bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/10 rounded-full">
                                        <span className="text-4xl text-brand-gold">📅</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6">
                                        Secure Your <br />
                                        <span className="text-brand-gold">Strategy Protocol</span>
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium mb-10 max-w-xs mx-auto">
                                        Schedule a direct session with our implementation architects to audit your digital infrastructure.
                                    </p>
                                    
                                    <a 
                                        href="https://crm.getboldideas.com/book"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center bg-brand-gold text-brand-navy font-black text-[10px] uppercase tracking-[0.4em] px-10 py-5 hover:bg-white transition-colors w-full"
                                    >
                                        BOOK NOW
                                    </a>
                                    
                                    <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] font-mono text-white/30 tracking-widest uppercase">
                                        <div className="w-2 h-2 rounded-full bg-green-500/40 animate-pulse"></div>
                                        <span>System Ready: Immediate Deployment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
