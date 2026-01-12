
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 px-4 bg-brand-light overflow-hidden">
      <div className="absolute top-0 left-0 w-1/2 h-full bg-brand-navy/[0.02] -skew-x-12 transform -translate-x-1/4 pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="text-left animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white border border-brand-navy/5 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy/60">AI Digital Marketing & Automation Agency</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-brand-navy leading-[1.05] tracking-tighter mb-8">
            Automate. <br />
            <span className="text-brand-gold italic">Innovate.</span><br />
            Thrive.
          </h1>
          
          <p className="text-lg text-slate-600 max-w-xl mb-12 leading-relaxed font-light">
            Bold Ideas Innovation is an AI digital marketing & automation agency that helps ambitious teams work smarter and grow faster. We blend AI consulting, workflow automation, and AI-powered digital marketing—to turn big goals into measurable results.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-start gap-6">
            <button className="w-full sm:w-auto px-10 py-5 bg-brand-navy text-white font-black rounded-2xl hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_20px_40px_rgba(255,184,28,0.2)] transition-all flex items-center justify-center group shadow-xl uppercase tracking-widest text-xs">
              INITIALIZE PROTOCOL
              <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[550px] aspect-square">
            <div className="absolute inset-0 bg-brand-gold/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[85%] h-[85%] glass-card rounded-[4rem] border border-white p-12 shadow-2xl flex items-center justify-center group overflow-hidden bg-white/60">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002D5B 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                   <path d="M100,20 C65,20 40,45 40,80 C40,110 60,135 75,145 L75,165 C75,170 80,175 85,175 L115,175 C120,175 125,170 125,165 L125,145 C140,135 160,110 160,80 C160,45 135,20 100,20 Z" fill="none" stroke="#002D5B" strokeWidth="4" className="opacity-10"/>
                   <g className="animate-circuit">
                     <line x1="100" y1="140" x2="100" y2="70" stroke="#FFB81C" strokeWidth="6" strokeLinecap="round" />
                     <circle cx="100" cy="65" r="6" fill="#FFB81C" />
                     <path d="M100,120 L80,100 L80,80" fill="none" stroke="#FFB81C" strokeWidth="5" strokeLinecap="round" />
                     <circle cx="80" cy="75" r="5" fill="#FFB81C" />
                     <path d="M100,110 L120,90 L120,70" fill="none" stroke="#FFB81C" strokeWidth="5" strokeLinecap="round" />
                     <circle cx="120" cy="65" r="5" fill="#FFB81C" />
                   </g>
                   <rect x="80" y="165" width="40" height="6" rx="2" fill="#002D5B" />
                   <rect x="82" y="174" width="36" height="6" rx="2" fill="#002D5B" />
                   <rect x="85" y="183" width="30" height="6" rx="2" fill="#002D5B" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
