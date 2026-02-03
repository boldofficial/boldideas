import React from 'react';
import { ContactForm } from './CRMForms';

const ContactPage: React.FC = () => {

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Context & Info */}
          <div className="animate-fade-in relative">
             <div className="absolute -left-6 top-0 bottom-0 w-1 bg-brand-gold/50 hidden lg:block"></div>
             
             <div className="inline-flex items-center space-x-2 border border-brand-navy/10 bg-brand-light px-3 py-1 mb-8 rounded-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.3em] text-brand-navy">Uplink_Ready</span>
             </div>

             <h1 className="text-5xl md:text-7xl font-black text-brand-navy leading-none tracking-tighter mb-8">
               Establish <br />
               <span className="text-brand-gold italic">Connection.</span>
             </h1>

             <p className="text-lg text-slate-600 mb-12 max-w-lg leading-relaxed font-light">
               Ready to automate and thrive? Let's discuss how we can transform your business with intelligent automation and data-driven marketing.
             </p>

             <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                   <div className="w-12 h-12 flex items-center justify-center border border-brand-navy/10 bg-white rounded-sm group-hover:border-brand-gold transition-colors">
                      <span className="text-2xl">📧</span>
                   </div>
                   <div>
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-brand-navy mb-1">Transmission_Target</h3>
                      <p className="text-slate-500 font-mono text-sm">{process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
                   </div>
                </div>

                <div className="flex items-start space-x-6 group">
                   <div className="w-12 h-12 flex items-center justify-center border border-brand-navy/10 bg-white rounded-sm group-hover:border-brand-gold transition-colors">
                      <span className="text-2xl">📍</span>
                   </div>
                   <div>
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-brand-navy mb-1">Base_Coordinates</h3>
                      <p className="text-slate-500 font-mono text-sm">San Francisco, CA<br/>Sector 7G</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Schematic Form */}
          <div className="relative">
             <div className="bg-white border border-brand-navy/10 p-1 rounded-sm shadow-2xl relative">
                {/* Tech Corners */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-brand-gold"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-brand-gold"></div>

                <div className="bg-brand-navy/5 p-3 flex justify-between items-center border-b border-brand-navy/5">
                   <span className="font-mono text-[9px] md:text-[11px] text-brand-navy/40 uppercase tracking-widest">SECURE_CHANNEL_V1</span>
                   <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-brand-navy/20 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-brand-navy/20 rounded-full"></div>
                   </div>
                </div>

                <div className="p-2 md:p-6">
                   <ContactForm className="shadow-none border-none p-0 md:p-0" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
