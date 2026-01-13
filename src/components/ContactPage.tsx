"use client";

import React from 'react';

import { submitContactForm } from '@/actions/contact';
import { Loader2 } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setIsSubmitting(true);
      
      const formData = new FormData(event.currentTarget);
      const res = await submitContactForm(formData);

      if (res.success) {
          setStatus('success');
          (event.target as HTMLFormElement).reset();
      } else {
          setStatus('error');
      }
      setIsSubmitting(false);
  }

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
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-brand-navy">Uplink_Ready</span>
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
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy mb-1">Transmission_Target</h3>
                      <p className="text-slate-500 font-mono text-sm">hello@myezer.org</p>
                   </div>
                </div>

                <div className="flex items-start space-x-6 group">
                   <div className="w-12 h-12 flex items-center justify-center border border-brand-navy/10 bg-white rounded-sm group-hover:border-brand-gold transition-colors">
                      <span className="text-2xl">📍</span>
                   </div>
                   <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy mb-1">Base_Coordinates</h3>
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
                   <span className="font-mono text-[9px] text-brand-navy/40 uppercase tracking-widest">SECURE_CHANNEL_V1</span>
                   <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-brand-navy/20 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-brand-navy/20 rounded-full"></div>
                   </div>
                </div>

                <div className="p-8">
                   {status === 'success' ? (
                       <div className="bg-green-50 border border-green-200 p-6 rounded-sm text-center animate-in fade-in slide-in-from-bottom-4">
                           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                               <span className="text-xl">✅</span>
                           </div>
                           <h3 className="text-brand-navy font-black uppercase tracking-widest text-sm mb-2">Transmission Successful</h3>
                           <p className="text-slate-600 text-xs font-mono">Secure uplink established. We will respond via designated channel.</p>
                           <button onClick={() => setStatus('idle')} className="mt-4 text-[10px] font-bold underline text-brand-navy hover:text-brand-gold uppercase tracking-widest">
                               Send_Another_Packet
                           </button>
                       </div>
                   ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="relative group">
                            <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-brand-navy/50 mb-2 group-focus-within:text-brand-gold transition-colors">
                               Identity_Name
                            </label>
                            <input 
                              name="name"
                              type="text" 
                              className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-gold focus:bg-white transition-all rounded-sm placeholder:text-slate-300"
                              placeholder="ENTER_NAME"
                              required
                            />
                         </div>
                         <div className="relative group">
                            <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-brand-navy/50 mb-2 group-focus-within:text-brand-gold transition-colors">
                               Comms_Email
                            </label>
                            <input 
                              name="email"
                              type="email" 
                              className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-gold focus:bg-white transition-all rounded-sm placeholder:text-slate-300"
                              placeholder="ENTER_EMAIL"
                              required
                            />
                         </div>
                      </div>

                      <div className="relative group">
                         <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-brand-navy/50 mb-2 group-focus-within:text-brand-gold transition-colors">
                            Transmission_Content
                         </label>
                         <textarea 
                           name="content"
                           rows={6}
                           className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-mono text-brand-navy focus:outline-none focus:border-brand-gold focus:bg-white transition-all rounded-sm placeholder:text-slate-300 resize-none"
                           placeholder="INITIATE_MESSAGE_SEQUENCE..."
                           required
                         ></textarea>
                      </div>

                      <button disabled={isSubmitting} className="w-full bg-brand-navy text-white px-8 py-5 rounded-sm font-black hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg uppercase tracking-widest text-xs border border-transparent hover:border-brand-navy relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed">
                         <span className="relative z-10 flex items-center justify-center">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    UPLINKING...
                                </>
                            ) : (
                                <>
                                    TRANSMIT_DATA
                                    <span className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity">_&gt;</span>
                                </>
                            )}
                         </span>
                         <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none opacity-10"></div>
                      </button>
                   </form>
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
