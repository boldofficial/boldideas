import React from 'react';
import { ContactForm } from './CRMForms';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-brand-navy min-h-screen relative overflow-hidden flex flex-col">
      {/* Cinematic Hero Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/contact_uplink_array.png"
          alt="Strategic Uplink Hub"
          className="w-full h-full object-cover opacity-30 contrast-125 transition-transform duration-[20s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy/60 to-brand-navy"></div>
        {/* Schematic Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Context & Transmission Metadata */}
          <div className="lg:col-span-5 animate-fade-in relative pt-10">
             <div className="inline-flex items-center space-x-4 mb-10">
                <div className="w-10 h-px bg-brand-gold"></div>
                <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Operational // Strategic_Uplink</span>
                </div>
             </div>

             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-10 uppercase">
               Smarter <span className="text-brand-gold">Work.</span><br />
               Faster <span className="text-brand-gold">Growth.</span><br />
               <span className="text-white">Bold Ideas.</span>
             </h1>

             <p className="text-base md:text-lg text-white/50 mb-16 max-w-md leading-relaxed font-medium pb-10 border-b border-white/5">
                We don’t just talk about AI—we <span className="text-white font-bold">deploy it into real workflows</span>. Request a strategy session to audit your digital backbone and unlock measurable efficiency.
             </p>

             <div className="grid sm:grid-cols-2 gap-12">
                <div className="group">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4 flex items-center">
                        <span className="mr-3 text-sm">📍</span> HQ_BASE
                    </h3>
                    <p className="text-white/40 font-mono text-xs leading-relaxed uppercase tracking-wider">
                        Lagos, Nigeria<br/>
                        Strategic Operations Unit
                    </p>
                </div>

                <div className="group">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4 flex items-center">
                        <span className="mr-3 text-sm">📧</span> COMM_CHANNEL
                    </h3>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-wider">
                        info@getboldideas.com
                    </p>
                    <div className="w-0 group-hover:w-full h-px bg-brand-gold/30 transition-all duration-500 mt-2"></div>
                </div>
             </div>
          </div>

          {/* Right Column: Transmission Interface */}
          <div className="lg:col-span-7 relative">
             <div className="relative group">
                <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rounded-3xl"></div>
                
                <div className="relative bg-brand-navy/40 backdrop-blur-xl border border-white/10 p-1 rounded-sm shadow-2xl overflow-hidden">
                    {/* Decorative Corner Tabs */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] -rotate-45 translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-4 right-4 flex space-x-1 opacity-20">
                        <div className="w-1 h-1 bg-white"></div>
                        <div className="w-8 h-1 bg-white"></div>
                    </div>

                    <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                       <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">SECURE_TRANSMISSION_PROTOCOL // V3.2</span>
                       <div className="flex space-x-1.5">
                          <div className="w-1 h-1 bg-green-500/50 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                       </div>
                    </div>

                    <div className="p-8 lg:p-12">
                       <ContactForm theme="dark" className="shadow-none border-none p-0" />
                    </div>
                </div>
             </div>
             
             {/* Technical metadata footer for the form */}
             <div className="mt-8 flex items-center justify-between px-2">
                <div className="flex items-center space-x-6 text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
                    <span>Auth: Level 4</span>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <span>Loc: Global_Transit</span>
                </div>
                <div className="text-[8px] font-mono text-white/10 tracking-widest">
                    SYSTEM_READY_FOR_DATA_PACKETS
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
