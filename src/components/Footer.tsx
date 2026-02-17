import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-12 bg-brand-navy border-t border-white/5 relative overflow-hidden">
            {/* Subtle Grounding Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-brand-gold/20 blur-md pointer-events-none"></div>
            
            <div className="max-w-[1440px] mx-auto relative z-10 px-6 md:px-16 lg:px-24">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-8">
                    <div className="col-span-2">
                        <div className="mb-8">
                            <Image
                                src="/logo.png"
                                alt="Bold Ideas Innovation"
                                width={160}
                                height={50}
                                className="h-10 w-auto brightness-0 invert opacity-90"
                            />
                        </div>
                        <p className="text-white/60 text-base max-w-sm leading-relaxed font-medium mb-12">
                            Practical AI solutions for lean teams and growing businesses. We build the systems that give you back your time.
                        </p>
                        <div className="space-y-5">
                            <div className="flex items-center space-x-4 text-white/40 text-xs font-bold uppercase tracking-widest group">
                                <span className="text-brand-gold">HQ_UNIT</span>
                                <span className="w-4 h-px bg-white/10 group-hover:w-8 transition-all"></span>
                                <span>Lagos, Nigeria</span>
                            </div>
                            <div className="flex items-center space-x-4 text-white/40 text-xs font-bold uppercase tracking-widest">
                                <span className="text-brand-gold">COMMS</span>
                                <span className="w-4 h-px bg-white/10"></span>
                                <span>info@getboldideas.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-start-4">
                        <h5 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
                            Solutions
                        </h5>
                        <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-white/40">
                            <li>
                                <Link href="/services" className="hover:text-brand-gold transition-colors">
                                    AI Training
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-brand-gold transition-colors">
                                    Workflow Automation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-brand-gold transition-colors">
                                    Marketing Systems
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-brand-gold transition-colors">
                                    Custom Tools
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
                            Structure
                        </h5>
                        <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-white/40">
                            <li>
                                <Link href="/" className="hover:text-brand-gold transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-brand-gold transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-brand-gold transition-colors">
                                    Privacy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-0">
                            Products
                        </h5>
                        <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-white/40">
                            <li>
                                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                                    Ezer
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                                    School MS
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                                    Directories
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Final Footer Strip */}
                <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-10">
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em] text-center">
                        © 2025 Bold Ideas. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
