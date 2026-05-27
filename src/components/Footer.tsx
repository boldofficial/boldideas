import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-brand-navy py-12">
            <div className="absolute bottom-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-brand-gold/20 blur-md pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-16 lg:px-24">
                <div className="mb-8 grid grid-cols-2 gap-16 md:grid-cols-4 lg:grid-cols-6">
                    <div className="col-span-2">
                        <div className="mb-8">
                            <Link href="/" className="relative block h-20 w-72 rounded-md bg-white p-3">
                                <Image
                                    src="/boldideas_logo.png"
                                    alt="Bold Ideas"
                                    fill
                                    className="object-contain"
                                />
                            </Link>
                        </div>
                        <p className="mb-12 max-w-sm text-base font-medium leading-relaxed text-white/60">
                            Websites and practical AI agents for small businesses across Illinois and Wisconsin.
                        </p>
                        <div className="space-y-5">
                            <div className="group flex items-center space-x-4 text-xs font-bold tracking-widest text-white/40">
                                <span className="text-brand-gold">Region</span>
                                <span className="h-px w-4 bg-white/10 transition-all group-hover:w-8"></span>
                                <span>Illinois & Wisconsin</span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs font-bold tracking-widest text-white/40">
                                <span className="text-brand-gold">Comms</span>
                                <span className="h-px w-4 bg-white/10"></span>
                                <span>admin@getboldideas.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-start-4">
                        <h5 className="mb-8 text-xs font-black tracking-[0.3em] text-white">
                            Solutions
                        </h5>
                        <ul className="space-y-5 text-sm font-bold tracking-widest text-white/40">
                            <li><Link href="/services" className="transition-colors hover:text-brand-gold">Website Design</Link></li>
                            <li><Link href="/services" className="transition-colors hover:text-brand-gold">Intake & Automation</Link></li>
                            <li><Link href="/services" className="transition-colors hover:text-brand-gold">Workflow Automation</Link></li>
                            <li><Link href="/services" className="transition-colors hover:text-brand-gold">Local SEO</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-8 text-xs font-black tracking-[0.3em] text-white">
                            Company
                        </h5>
                        <ul className="space-y-5 text-sm font-bold tracking-widest text-white/40">
                            <li><Link href="/" className="transition-colors hover:text-brand-gold">Home</Link></li>
                            <li><Link href="/about" className="transition-colors hover:text-brand-gold">About Us</Link></li>
                            <li><Link href="/locations" className="transition-colors hover:text-brand-gold">Service Areas</Link></li>
                            <li><Link href="/contact" className="transition-colors hover:text-brand-gold">Contact</Link></li>
                            <li><Link href="/privacy" className="transition-colors hover:text-brand-gold">Privacy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-8 text-xs font-black tracking-[0.3em] text-white">
                            Build With Us
                        </h5>
                        <ul className="space-y-5 text-sm font-bold tracking-widest text-white/40">
                            <li><Link href="/book" className="transition-colors hover:text-brand-gold">Book a Call</Link></li>
                            <li><Link href="/services" className="transition-colors hover:text-brand-gold">Services</Link></li>
                            <li><Link href="/blog" className="transition-colors hover:text-brand-gold">Blog</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-10 border-t border-white/5 pt-4 md:flex-row">
                    <p className="text-center text-xs font-bold tracking-[0.4em] text-white/20">
                        (c) 2026 Bold Ideas. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
