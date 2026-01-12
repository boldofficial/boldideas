
import React from 'react';

const StorySection: React.FC = () => {
  return (
    <section id="aboutus" className="relative py-32 px-4 bg-white overflow-hidden border-t border-brand-navy/5">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-brand-navy/10 hidden lg:block"></div>
            
            <div className="inline-block px-3 py-1 mb-8 border border-brand-navy/10 bg-brand-light">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-brand-navy">Mission_Log: 01</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy leading-none tracking-tighter mb-8 bg-clip-text">
              The Future of Work <br/>
              <span className="text-brand-gold italic">Is Automated.</span>
            </h2>
            
            <div className="pl-6 border-l-2 border-brand-gold/20 mb-12">
               <p className="text-lg text-slate-600 font-light leading-relaxed">
                 Manual processes are a glitch in the system. Repetitive tasks, unscalable content, and uncontrolled ad spend are errors we patch. We built Bold Ideas Innovation to deploy the fix: simple systems, clear playbooks, and campaigns that compound.
               </p>
            </div>
            
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-brand-navy to-brand-gold opacity-20 blur rounded-sm group-hover:opacity-40 transition-opacity"></div>
               <div className="bg-white p-8 relative border border-brand-navy/10 shadow-xl rounded-sm">
                  {/* Technical Header */}
                  <div className="flex justify-between items-center mb-4 border-b border-brand-navy/5 pb-2">
                     <span className="font-mono text-[9px] text-brand-gold uppercase tracking-widest">TARGET_AUDIENCE</span>
                     <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-brand-navy rounded-full"></div>
                        <div className="w-1 h-1 bg-brand-navy rounded-full"></div>
                        <div className="w-1 h-1 bg-brand-navy rounded-full"></div>
                     </div>
                  </div>
                  <p className="text-brand-navy font-bold leading-relaxed italic">
                    "We partner with forward-thinking SMEs, ambitious entrepreneurs, and scaling startups. If you're ready to embrace the future of work and build a self-sustaining growth machine, initiate the partnership."
                  </p>
               </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Header Block */}
               <div className="md:col-span-2 bg-brand-navy p-8 text-white relative overflow-hidden group border border-brand-navy rounded-sm">
                  <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-white/20 tracking-widest">CORE_VALUES</div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-gold/10 blur-[50px] rounded-full"></div>
                  
                  <span className="text-brand-gold font-mono text-xs mb-2 block">&gt; SYSTEM_VALUES</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight relative z-10">Operating <br/>Principles</h3>
               </div>

               {[
                 { label: 'Human Centric', text: 'Tech serves people.', id: '01', icon: '👤' },
                 { label: 'Scalability', text: 'Simplicity scales.', id: '02', icon: '📈' },
                 { label: 'Objectivity', text: 'Data > Opinion.', id: '03', icon: '📊' },
                 { label: 'Advantage', text: 'Speed is leverage.', id: '04', icon: '⚡' },
               ].map((item, i) => (
                 <div key={i} className="bg-white p-6 border border-brand-navy/10 hover:border-brand-gold hover:shadow-lg transition-all duration-300 group rounded-sm relative">
                   {/* Corner Accents */}
                   <div className="absolute top-0 right-0 w-0 h-0 border-t-[8px] border-r-[8px] border-t-transparent border-r-brand-navy/10 group-hover:border-r-brand-gold transition-colors"></div>
                   
                   <div className="font-mono text-[9px] text-slate-300 mb-4 group-hover:text-brand-gold transition-colors">VAL_{item.id}</div>
                   
                   <div className="mb-3 text-2xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                   
                   <h4 className="text-sm font-black text-brand-navy uppercase tracking-wide mb-2">{item.label}</h4>
                   <p className="text-xs text-slate-500 font-mono leading-relaxed group-hover:text-brand-navy transition-colors">{item.text}</p>
                 </div>
               ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default StorySection;

