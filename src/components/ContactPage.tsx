import React from 'react';
import { ContactForm } from './CRMForms';
import ContactHero from './contact/ContactHero';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-[#F1F3F9] min-h-screen relative overflow-hidden flex flex-col">
      <ContactHero />

      <div className="py-12 md:py-20 relative z-10 w-full flex-1">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Context */}
            <div className="lg:col-span-5 animate-fade-in relative">
              

               <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-brand-navy leading-[0.95] tracking-tighter mb-6 uppercase">
                 Smarter <span className="text-brand-gold italic">Work.</span><br />
                 Faster <span className="text-brand-gold">Growth.</span><br />
                 <span className="text-brand-navy">Bold Ideas.</span>
               </h2>

               <p className="text-base md:text-lg text-slate-500 mb-12 max-w-md leading-relaxed font-medium">
                  We don’t just talk about AI—we <span className="text-brand-navy font-bold">deploy it into real workflows</span>. Request a strategy session to audit your digital backbone and unlock measurable efficiency.
               </p>

               <div className="grid sm:grid-cols-2 gap-8">
                  <div className="group">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4 flex items-center">
                          <span className="mr-3 text-sm">📍</span> HQ_BASE
                      </h3>
                      <p className="text-slate-400 font-mono text-xs leading-relaxed uppercase tracking-wider">
                          Lagos, Nigeria<br/>
                          Strategic Operations Unit
                      </p>
                  </div>

                  <div className="group">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4 flex items-center">
                          <span className="mr-3 text-sm">📧</span> COMM_CHANNEL
                      </h3>
                      <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                          info@getboldideas.com
                      </p>
                      <div className="w-0 group-hover:w-full h-px bg-brand-gold/30 transition-all duration-500 mt-2"></div>
                  </div>
               </div>
            </div>

            {/* Right Column: Transmission Interface (The Form) */}
            <div className="lg:col-span-7 relative">
               <div className="relative group">
                  <div className="absolute inset-0 bg-brand-navy blur-3xl opacity-[0.03] group-hover:opacity-[0.05] transition-opacity rounded-3xl"></div>
                  
                  <div className="relative bg-white border border-slate-200 p-1 rounded-sm shadow-[0_32px_64px_-16px_rgba(0,45,91,0.08)] overflow-hidden">
                      {/* Decorative Corner Tabs */}
                      
                      

                      <div className="p-8">
                         <ContactForm theme="light" className="shadow-none border-none p-0" />
                      </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
