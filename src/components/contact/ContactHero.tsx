import React from 'react';
import Link from 'next/link';

const ContactHero: React.FC = () => {
    return (
        <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden bg-brand-navy mt-[88px]">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/contact_uplink_array.png" 
                    alt="Strategic Uplink Hub" 
                    className="w-full h-full object-cover opacity-40 brightness-50"
                />
                <div className="absolute inset-0 bg-brand-navy/60"></div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10 w-full flex flex-col items-center text-center px-6 md:px-16 lg:px-24">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6">
                    Contact Us
                </h1>

                {/* Breadcrumbs */}
                <div className="flex items-center space-x-3 text-xs md:text-sm font-medium text-white/80 uppercase tracking-widest">
                    <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                    <span className="text-white/40">{'>'}</span>
                    <span className="text-brand-gold font-bold">Contact</span>
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
