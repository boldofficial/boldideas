import React from 'react';

const services = [
  {
    id: '01',
    title: 'AI Productivity Training',
    tag: 'FLAGSHIP',
    description: 'Hands-on AI productivity training designed specifically for corporate teams, government agencies, and NGOs.',
    details: [
      'Automate repetitive documentation',
      'AI-enhanced executive briefings',
      'Department-specific workflows',
      'Safe & ethical AI application'
    ],
    icon: '🧠',
    status: 'OPTIMIZED'
  },
  {
    id: '02',
    title: 'AI Consulting & Automation',
    tag: 'SYSTEMS',
    description: 'Custom AI-powered workflows that fit your organization—not generic SaaS tools.',
    details: [
      'AI customer support agents',
      'Internal AI staff assistants',
      'Automated doc generation',
      'Cross-department automation'
    ],
    icon: '⚡',
    // status: 'ACTIVE'
  },
  {
    id: '03',
    title: 'Digital Marketing & Growth',
    tag: 'INFRASTRUCTURE',
    description: 'We combine AI + digital marketing strategy to help businesses grow sustainably.',
    details: [
      'AI-assisted SEO & Content',
      'Lead generation funnels',
      'Social media automation',
      'CRM & follow-up systems'
    ],
    icon: '📈',
    status: 'SCALING'
  },
  {
    id: '04',
    title: 'Custom Websites & Tools',
    tag: 'DEVELOPMENT',
    description: 'Scalable, secure digital platforms built for real-world business performance.',
    details: [
      'Conversion-focused websites',
      'Admin dashboards & portals',
      'AI-powered LMS & finance tools',
      'Tailored internal business tools'
    ],
    icon: '💻',
    status: 'DEPLOYED'
  }
];

const ServicesList: React.FC = () => {
  return (
    <section className="px-6 py-32 bg-brand-light relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>
      
      {/* Ghost Background Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-brand-navy opacity-[0.01] pointer-events-none select-none tracking-tighter">
        CORE
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* FLAGSHIP: AI Productivity Training - Large Featured Block */}
          <div className="col-span-12 lg:col-span-8 group relative bg-white border border-brand-navy/10 p-1 hover:border-brand-gold/50 transition-all duration-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Connection Line Decor */}
            <div className="absolute top-12 right-12 w-24 h-[1px] bg-brand-gold/20 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            
            <div className="h-full bg-slate-50 p-8 lg:p-16 relative overflow-hidden group-hover:bg-white transition-colors duration-700 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                        <span className="text-xs font-black text-brand-gold tracking-[0.3em] bg-brand-gold/10 px-3 py-1 rounded-sm border border-brand-gold/20">{services[0].tag}</span>
                        <span className="w-8 h-[1px] bg-brand-gold/30"></span>
                    </div>
                  </div>
                  <div className="w-20 h-20 flex items-center justify-center text-6xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    {services[0].icon}
                  </div>
                </div>

                <h3 className="text-4xl lg:text-5xl font-black text-brand-navy mb-8 group-hover:text-brand-gold transition-colors uppercase tracking-tight leading-[0.9]">
                  {services[0].title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h3>
                
                <p className="text-slate-500 text-lg lg:text-xl leading-relaxed mb-12 font-medium max-w-2xl border-l-2 border-brand-gold/20 pl-8">
                  {services[0].description}
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 bg-brand-navy/[0.02] p-8 -mx-8 -mb-8 lg:-mx-16 lg:-mb-16 border-t border-brand-navy/5 mt-auto">
                {services[0].details.map((detail, idx) => (
                  <div key={idx} className="flex items-center space-x-4 text-sm text-slate-600 font-mono group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover/item:scale-150 transition-transform"></div>
                    <span className="group-hover/item:text-brand-navy transition-colors">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Consulting & Automation - Side Block */}
          <div className="col-span-12 lg:col-span-4 group relative bg-brand-navy border border-brand-navy p-1 hover:border-brand-gold/50 transition-all duration-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="h-full bg-slate-900 p-8 lg:p-10 relative overflow-hidden group-hover:bg-brand-navy transition-colors duration-700 flex flex-col">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <span className="text-[10px] font-black text-brand-gold tracking-widest px-2 py-0.5 border border-brand-gold/30 rounded-sm">{services[1].status}</span>
              </div>
              
              <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">
                {services[1].icon}
              </div>
              
              <h3 className="text-2xl font-black text-white mb-6 group-hover:text-brand-gold transition-colors uppercase tracking-tight">
                {services[1].title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                {services[1].description}
              </p>
              
              <div className="space-y-4 mb-10">
                {services[1].details.map((detail, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-[11px] text-white/50 font-mono">
                    <span className="text-brand-gold">{'>'}</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <button className="mt-auto flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-brand-gold transition-colors py-4 border-t border-white/5">
                <span>Configure Protocol</span>
                <div className="w-4 h-px bg-brand-gold"></div>
              </button>
            </div>
          </div>

          {/* Digital Marketing & Growth */}
          <div className="col-span-12 lg:col-span-6 group relative bg-white border border-brand-navy/10 p-1 hover:border-brand-gold/50 transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden min-h-[400px]">
            <div className="h-full bg-white p-8 lg:p-12 relative flex flex-col">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-12 flex items-center justify-center text-3xl bg-slate-50 border border-brand-navy/5">
                        {services[2].icon}
                    </div>
                    <span className="font-mono text-[9px] text-brand-navy/30 tracking-widest uppercase py-1 border-b border-brand-gold/30">ID_REF: 03</span>
                </div>
                <h3 className="text-3xl font-black text-brand-navy mb-6 uppercase tracking-tight leading-none group-hover:text-brand-gold transition-colors">
                    {services[2].title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-md">
                    {services[2].description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    {services[2].details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-[10px] text-brand-navy/60 font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-brand-gold/40"></span>
                            <span>{detail}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Custom Websites & Tools */}
          <div className="col-span-12 lg:col-span-6 group relative bg-white border border-brand-navy/10 p-1 hover:border-brand-gold/50 transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden min-h-[400px]">
            <div className="h-full bg-white p-8 lg:p-12 relative flex flex-col">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-12 flex items-center justify-center text-3xl bg-slate-50 border border-brand-navy/5">
                        {services[3].icon}
                    </div>
                    <span className="font-mono text-[9px] text-brand-navy/30 tracking-widest uppercase py-1 border-b border-brand-gold/30">ID_REF: 04</span>
                </div>
                <h3 className="text-3xl font-black text-brand-navy mb-6 uppercase tracking-tight leading-none group-hover:text-brand-gold transition-colors">
                    {services[3].title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-md">
                    {services[3].description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    {services[3].details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-[10px] text-brand-navy/60 font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-brand-gold/40"></span>
                            <span>{detail}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesList;
