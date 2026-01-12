
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section id="consultation" className="py-24 px-4 relative overflow-hidden bg-brand-navy">
      {/* Circuit Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#FFB81C 1px, transparent 1px), linear-gradient(90deg, #FFB81C 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>
      
      {/* Decorative Macro Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="border border-brand-gold/30 bg-brand-navy/50 backdrop-blur-md p-1 rounded-sm relative group">
           {/* Tech Corners */}
           <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-brand-gold"></div>
           <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-brand-gold"></div>
           <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-brand-gold"></div>
           <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-brand-gold"></div>

           <div className="relative p-12 md:p-20 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-b-sm border-b border-l border-r border-brand-gold/30">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] animate-pulse">System_Ready</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter relative z-10">
                  Ready to <br/>
                  <span className="text-brand-gold">Automate & Thrive?</span>
                </h2>
                
                <div className="w-24 h-1 bg-brand-gold/50 mx-auto mb-8"></div>
                
                <p className="text-slate-300 text-lg mb-12 max-w-xl mx-auto font-mono leading-relaxed">
                  &gt; Let's discuss how we can transform your business with intelligent automation and data-driven marketing.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                  <button className="bg-brand-gold text-brand-navy px-12 py-5 rounded-sm font-black hover:bg-white transition-all shadow-xl uppercase tracking-widest text-xs relative overflow-hidden group/btn">
                    <span className="relative z-10">Schedule Consultation</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  <button className="bg-transparent text-white px-12 py-5 rounded-sm font-bold border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all uppercase tracking-widest text-xs font-mono">
                    View_Case_Studies
                  </button>
                </div>
           </div>
           
           {/* Scanning Line Effect */}
           <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold/20 animate-scan"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CTA;
