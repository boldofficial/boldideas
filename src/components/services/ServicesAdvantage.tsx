import React from 'react';

const advantages = [
  {
    title: "Real-World Expertise",
    desc: "Strategies built on proven, real-world experience. Measured outcome protocols for corporate scaling.",
    icon: "🏗️",
    id: "EXP_01"
  },
  {
    title: "Tailored AI Solutions",
    desc: "Custom architectural design for your specific industry constraints and organizational goals.",
    icon: "📐",
    id: "SOL_02"
  },
  {
    title: "Proven ROI",
    desc: "Metrics-first approach. Revenue growth, cost savings, and verifiable productivity gains.",
    icon: "📊",
    id: "ROI_03"
  }
];

const ServicesAdvantage: React.FC = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-slate-900 border-t border-white/5">
         {/* Internal Grid Texture - More Subtle */}
         <div className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
         </div>
         
         {/* Accent Glow */}
         <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 text-white">
               {/* <div className="inline-flex items-center space-x-3 border border-brand-gold/20 px-4 py-2 mb-8 bg-brand-navy/50 backdrop-blur-sm">
                   <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                   <p className="text-[10px] md:text-xs font-mono text-brand-gold uppercase tracking-[0.5em]">SYSTEM_ADVANTAGE:PROTOCOL_V4</p>
               </div> */}
               <h2 className="text-base  md:text-4xl font-bold uppercase leading-none">
                  <span className="text-brand-gold tracking-[0.5em]">WHY PARTNER WITH US?</span>
               </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-1px bg-white/5 border border-white/5">
               {advantages.map((item, i) => (
                 <div key={i} className="bg-slate-900 p-10 lg:p-14 relative group hover:bg-slate-800/50 transition-all duration-500">
                    <div className="absolute top-6 right-8 font-mono text-[10px] text-white/10 group-hover:text-brand-gold transition-colors">{item.id}</div>
                    
                    <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-3xl mb-10 group-hover:scale-110 transition-transform duration-500 border border-white/10 group-hover:border-brand-gold/30">
                       {item.icon}
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight group-hover:text-brand-gold transition-colors">
                        {item.title}
                    </h3>
                    
                    <p className="text-slate-400 text-base leading-relaxed font-medium">
                        {item.desc}
                    </p>
                    
                    <div className="mt-10 flex items-center space-x-4 opacity-20 group-hover:opacity-100 transition-opacity">
                        <div className="h-[1px] w-12 bg-white/20"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>
  );
};

export default ServicesAdvantage;
