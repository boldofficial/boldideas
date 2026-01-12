
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 overflow-hidden bg-brand-light relative">
      {/* Background Schematic Grid & Ghost Imagery */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0,45,91,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,45,91,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none mix-blend-multiply overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000" 
          alt="" 
          className="w-full h-full object-cover grayscale scale-110"
        />
      </div>

      {/* Hero: System Initialization */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="flex items-center space-x-3 mb-12 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_#FFB81C]"></div>
            <span className="text-[10px] font-mono font-black text-brand-navy/40 uppercase tracking-[0.5em]">System_Boot: About_Us</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-brand-navy leading-none tracking-tighter mb-12">
            Automate. <br />
            <span className="text-brand-gold italic">Innovate.</span> <br />
            Thrive.
          </h1>
          
          <div className="max-w-2xl bg-white/40 backdrop-blur-md border border-brand-navy/5 p-8 rounded-3xl shadow-2xl relative group">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-brand-gold group-hover:scale-110 transition-transform"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-brand-gold group-hover:scale-110 transition-transform"></div>
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              Bold Ideas Innovation is an AI digital marketing & automation agency that helps ambitious teams work smarter and grow faster. We blend AI consulting, workflow automation, and AI-powered digital marketing to turn big goals into measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* The Split-System Console: Logic vs Outcome with Macro Textures */}
      <section className="relative border-y border-brand-navy/5 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Left: The Logic (Terminal Style) */}
          <div className="flex-1 bg-brand-navy p-12 lg:p-24 relative overflow-hidden group">
             {/* Macro Texture: Dark Circuitry */}
             <div className="absolute inset-0 opacity-10 pointer-events-none grayscale contrast-125 mix-blend-overlay">
               <img 
                 src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1200" 
                 alt="" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]"
               />
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-20 font-mono text-[100px] text-white/10 font-black pointer-events-none select-none">0101</div>
             <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded bg-white/10 text-brand-gold font-mono text-[10px] mb-8 tracking-widest uppercase">INPUT: THE_FRICTION</span>
                <h2 className="text-4xl font-black text-white mb-12 tracking-tight">Why We <br/><span className="text-white/30 italic underline decoration-brand-gold/30">Exist</span></h2>
                
                <div className="space-y-12">
                  {[
                    { cmd: "ERR_01", msg: "Too many repetitive tasks." },
                    { cmd: "ERR_02", msg: "Content that's hard to scale." },
                    { cmd: "ERR_03", msg: "Ad spend difficult to control." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-6 group/item">
                       <span className="font-mono text-brand-gold text-xs mt-1.5">{item.cmd}</span>
                       <p className="text-white/60 text-lg font-medium group-hover/item:text-white transition-colors">-- {item.msg}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Right: The Outcome (The Result) */}
          <div className="flex-1 bg-white p-12 lg:p-24 relative overflow-hidden group">
             {/* Macro Texture: Fiber Optic Light */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale contrast-150 mix-blend-multiply">
               <img 
                 src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                 alt="" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]"
               />
             </div>
             <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #002D5B 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
             <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded bg-brand-navy text-brand-gold font-mono text-[10px] mb-8 tracking-widest uppercase">OUTPUT: BOLD_IDEAS</span>
                <h2 className="text-4xl font-black text-brand-navy mb-12 tracking-tight">Making AI <br/><span className="text-brand-gold italic">Practical.</span></h2>
                
                <div className="space-y-12">
                  {[
                    { tag: "SYSTEMS", msg: "Simple systems." },
                    { tag: "PLAYBOOKS", msg: "Clear playbooks." },
                    { tag: "COMPOUND", msg: "Campaigns that compound." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-6 group/item">
                       <span className="bg-brand-navy/5 text-brand-navy font-black text-[9px] px-2 py-0.5 rounded tracking-widest mt-1.5">{item.tag}</span>
                       <p className="text-slate-500 text-lg font-medium group-hover/item:text-brand-navy transition-colors">&gt;&gt; {item.msg}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Engineering Schematic: Core Logic Modules with Texture Popups */}
      <section className="py-40 px-4 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-block border border-brand-navy/10 px-3 py-1 mb-4">
                 <p className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.4em]">Core_Protocols</p>
              </div>
              <h2 className="text-5xl font-black text-brand-navy tracking-tighter leading-none">Operating <br/>Principles.</h2>
            </div>
            <div className="hidden md:block w-1/2 h-px bg-brand-navy/20 relative">
               <div className="absolute right-0 -top-1 w-2 h-2 bg-brand-gold shadow-[0_0_8px_#FFB81C]"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: '01', title: 'Human Centric', desc: 'Technology serves people, not the other way around.', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692' },
              { id: '02', title: 'Simplicity', desc: 'Simplicity scales, complexity breaks.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' },
              { id: '03', title: 'Objectivity', desc: 'Data beats opinion everytime.', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475' },
              { id: '04', title: 'Speed', desc: 'Speed of implementation is a competitive advantage.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa' },
              { id: '05', title: 'Growth', desc: 'Continuous iteration leads to exponential growth.', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b' },
              { id: '06', title: 'ROI', desc: 'A focus on ROI and measurable outcomes.', img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107' },
              { id: '07', title: 'Clarity', desc: 'No jargon—just plain English and results.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' },
              { id: '08', title: 'Partnership', desc: 'A true partnership mindset, not just a vendor.', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
            ].map((mod, i) => (
              <div key={i} className="bg-white border border-brand-navy/10 p-8 group hover:border-brand-gold transition-colors duration-300 relative overflow-hidden rounded-sm">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-500 grayscale">
                  <img src={`${mod.img}?auto=format&fit=crop&q=40&w=400`} alt="" className="w-full h-full object-cover" />
                </div>
                
                {/* Corner Accents */}
                <div className="absolute top-0 right-0 p-2 font-mono text-[9px] text-brand-navy/20 group-hover:text-brand-gold">M_{mod.id}</div>
                
                <div className="relative z-10">
                  <div className="w-8 h-8 flex items-center justify-center text-brand-navy font-black text-xs mb-8 bg-brand-light border border-brand-navy/5 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
                    {mod.id}
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-4 transition-colors uppercase tracking-tight">{mod.title}</h3>
                  <p className="text-sm text-slate-500 font-mono leading-relaxed transition-colors">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Ecosystems: The diagnostic look with subtle textures */}
      <section className="py-32 px-4 bg-brand-light border-t border-brand-navy/5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-sm p-12 lg:p-20 shadow-xl border border-brand-navy/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-[5s]"></div>
             
             <div className="grid lg:grid-cols-3 gap-16 relative z-10">
                <div className="lg:col-span-1">
                   <div className="inline-block border border-brand-navy/10 px-3 py-1 mb-4">
                      <p className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.4em]">Target_Nodes</p>
                   </div>
                   <h2 className="text-4xl font-black text-brand-navy tracking-tight mb-8 leading-none">Who We <br/>Help.</h2>
                   <p className="text-slate-500 font-light leading-relaxed">We partner with forward-thinking SMEs, ambitious entrepreneurs, and scaling startups.</p>
                </div>
                <div className="lg:col-span-2 space-y-4">
                   {[
                     { name: "SMEs", focus: "EFFICIENCY", desc: "Teams tired of the manual grind and ready for self-sustaining growth systems." },
                     { name: "Entrepreneurs", focus: "VISION", desc: "Ambitious leaders ready to embrace the future of work." },
                     { name: "Startups", focus: "SCALE", desc: "Scaling companies wanting to build a self-sustaining growth machine." }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-sm bg-brand-light/50 border border-brand-navy/5 group/item hover:border-brand-navy hover:bg-white transition-all duration-300">
                        <div className="mb-4 md:mb-0">
                           <span className="font-mono text-[9px] text-brand-gold mb-2 block tracking-widest uppercase">NODE_0{i+1}: CONNECTED</span>
                           <h4 className="text-2xl font-black text-brand-navy">{item.name}</h4>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <span className="px-2 py-0.5 rounded-sm bg-brand-navy text-brand-gold text-[8px] font-mono font-bold tracking-widest mb-2">{item.focus}</span>
                           <p className="text-xs text-slate-500 font-mono max-w-xs">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Schematic: The Final Block with Deep Texture Background */}
      <section className="py-40 px-4 relative overflow-hidden">
        {/* Background Texture for the whole section */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale contrast-125">
           <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
           <div>
              <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/20 px-4 py-1.5 rounded-full mb-8">
                 <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                 <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-navy">Sys_Stack: Active</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-brand-navy mb-12 tracking-tighter leading-none">
                 Tools We <br/><span className="text-brand-gold italic">Work With.</span>
              </h2>
              <div className="space-y-6">
                 {[
                   { label: 'TRANSPARENCY', val: 'Transparent communication.' },
                   { label: 'ROADMAPS', val: 'Clear roadmaps.' },
                   { label: 'OUTCOMES', val: 'Focus on ROI & measurable results.' }
                 ].map((spec, i) => (
                   <div key={i} className="flex items-center space-x-6 p-6 rounded-sm border border-brand-navy/5 bg-white shadow-sm hover:border-brand-gold transition-colors group">
                      <div className="w-12 h-12 rounded-sm bg-brand-navy flex items-center justify-center text-brand-gold font-bold group-hover:scale-105 transition-transform font-mono">0{i+1}</div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">{spec.label}</p>
                         <p className="text-brand-navy font-bold">{spec.val}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative">
              <div className="absolute inset-0 bg-brand-gold/20 blur-[120px] rounded-full"></div>
              <div className="relative bg-brand-navy rounded-sm p-12 lg:p-16 border-4 border-white shadow-2xl overflow-hidden group/box">
                 {/* Internal Texture: Silicon Chip Detail */}
                 <div className="absolute inset-0 opacity-[0.08] pointer-events-none grayscale brightness-50 contrast-150 mix-blend-screen">
                    <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800" alt="" className="w-full h-full object-cover group-hover/box:scale-110 transition-transform duration-[10s]" />
                 </div>
                 
                 <div className="flex justify-between items-center mb-16 relative z-10">
                    <div className="flex space-x-2">
                       <div className="w-3 h-3 rounded-full bg-white/10"></div>
                       <div className="w-3 h-3 rounded-full bg-white/10"></div>
                       <div className="w-3 h-3 rounded-full bg-white/10"></div>
                    </div>
                    <span className="font-mono text-[9px] text-brand-gold tracking-widest">ECOSYSTEM_V2</span>
                 </div>
                 
                 <div className="space-y-16 relative z-10">
                    <div className="absolute left-[39px] top-8 bottom-8 w-[2px] bg-white/10"></div>
                    {[
                      { l: "INPUT", t: "OpenAI / Gemini / Notion", i: "🧠" },
                      { l: "LOGIC", t: "Make.com / Python / Scripts", i: "⚡" },
                      { l: "OUTPUT", t: "HubSpot / Airtable / Google Sheets", i: "🚀" }
                    ].map((node, i) => (
                      <div key={i} className="flex items-center space-x-8 relative z-10 group">
                         <div className="w-20 h-20 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover:bg-brand-gold group-hover:scale-105 transition-all text-white group-hover:text-brand-navy">
                            {node.i}
                         </div>
                         <div>
                            <span className="text-[9px] font-black text-brand-gold tracking-[0.3em] uppercase block mb-1 font-mono">{node.l}</span>
                            <span className="text-xl font-bold text-white">{node.t}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};


export default AboutPage;
