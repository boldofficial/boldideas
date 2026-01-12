import React from 'react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      id: '01',
      title: 'AI Strategy & Consulting',
      description: 'We help you navigate the AI landscape to select the right tools and strategies.',
      details: [
        'AI Readiness Audits',
        'Custom Roadmap Design',
        'Tool Selection & Integration',
        'ROI & Feasibility Analysis'
      ],
      icon: '⚙️',
      status: 'ONLINE'
    },
    {
      id: '02',
      title: 'Workflow Automation',
      description: 'We eliminate manual data entry and repetitive tasks by connecting your apps.',
      details: [
        'Zapier & Make.com Architectures',
        'CRM Automations (HubSpot/Salesforce)',
        'Automated Invoicing & Reporting',
        'Cross-Platform Data Sync'
      ],
      icon: '⚡',
      status: 'ACTIVE'
    },
    {
      id: '03',
      title: 'Programmatic SEO',
      description: 'We build scalable content engines that generate thousands of targeted landing pages.',
      details: [
        'High-Volume Page Generation',
        'Keyword Cluster Targeting',
        'Automated Content Updates',
        'Search Intent Optimization'
      ],
      icon: '🔍',
      status: 'SCALING'
    },
    {
      id: '04',
      title: 'Paid Media Automation',
      description: 'We optimize ad spend using AI algorithms to target the right audience at the right time.',
      details: [
        'Predictive Bidding Strategies',
        'Automated Creative Testing',
        'Audience Segmentation Logic',
        'Real-time Budget Optimization'
      ],
      icon: '📈',
      status: 'OPTIMIZED'
    },
    {
      id: '05',
      title: 'AI Chatbots & Agents',
      description: 'We deploy intelligent customer service agents that work 24/7 to qualify leads.',
      details: [
        '24/7 Customer Support',
        'Lead Qualification & Scoring',
        'Multilingual Capabilities',
        'Knowledge Base Integration'
      ],
      icon: '🤖',
      status: 'DEPLOYED'
    },
    {
      id: '06',
      title: 'Data Analytics & Insights',
      description: 'We turn raw data into actionable dashboards so you can make decisions based on facts.',
      details: [
        'Unified Data Dashboards',
        'Predictive Analytics Models',
        'Automated Performance Reporting',
        'Customer Journey Tracking'
      ],
      icon: '📊',
      status: 'TRACKING'
    },
    {
      id: '07',
      title: 'AI Productivity Training',
      description: 'We empower your team with hands-on training to master AI tools for daily workflows.',
      details: [
        'Prompt Engineering Workshops',
        'Tool-Specific Training (ChatGPT, Midjourney)',
        'Workflow Optimization Coaching',
        'Team Certification Programs'
      ],
      icon: '🧠',
      status: 'TRAINING'
    }
  ];

  return (
    <div className="pt-24 pb-20 overflow-hidden bg-brand-light relative">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <section className="relative px-4 pt-20 pb-32">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-3 mb-12 border border-brand-navy/10 bg-white/50 px-4 py-2 rounded-sm backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-brand-gold animate-pulse"></div>
            <span className="text-[10px] font-mono font-black text-brand-navy uppercase tracking-[0.3em]">System_Modules: Active</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-brand-navy leading-none tracking-tighter mb-12">
            Intelligent <br />
            <span className="text-brand-gold italic">Protocols.</span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            We don't just sell services; we deploy growth protocols. Inspect our core modules designed to automate, scale, and optimize your business operations.
          </p>
        </div>
      </section>

      <section className="px-4 pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group relative bg-white border border-brand-navy/10 p-1 hover:border-brand-gold/50 transition-colors duration-500">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-brand-navy/20 group-hover:border-brand-gold transition-colors"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-brand-navy/20 group-hover:border-brand-gold transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-brand-navy/20 group-hover:border-brand-gold transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-brand-navy/20 group-hover:border-brand-gold transition-colors"></div>

              <div className="h-full bg-slate-50 p-8 relative overflow-hidden group-hover:bg-white transition-colors duration-500">
                  {/* Metadata Header */}
                  <div className="flex justify-between items-center mb-8 border-b border-brand-navy/5 pb-4">
                      <span className="font-mono text-[9px] text-brand-navy/40 tracking-widest">MOD_ID: {service.id}</span>
                      <span className="font-mono text-[9px] text-brand-gold tracking-widest bg-brand-navy/5 px-2 py-1 rounded-sm">{service.status}</span>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-black text-brand-navy mb-4 group-hover:text-brand-gold transition-colors uppercase tracking-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 mb-4 flex items-center">
                        <span className="w-2 h-px bg-brand-navy/30 mr-2"></span>
                        Capabilities
                    </div>
                    {service.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-xs text-slate-600 font-mono">
                        <span className="text-brand-gold text-[10px]">{'>'}</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Partner With Us Section - The "Console" Look */}
      <section className="py-24 px-4 relative overflow-hidden bg-brand-navy border-t-2 border-brand-gold">
         {/* Internal Grid Texture */}
         <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
         </div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
               <div className="inline-block border border-brand-gold/30 px-4 py-1 mb-6 bg-brand-navy">
                   <p className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.4em]">SYS_OVERVIEW: ADVANTAGE</p>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Why Partner <span className="text-brand-gold italic">With Us?</span></h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 {
                   title: "Real-World Expertise",
                   desc: "Strategies built on proven, real-world experience. Measured outcome protocols.",
                   icon: "🏗️",
                   id: "EXP_01"
                 },
                 {
                   title: "Tailored AI Solutions",
                   desc: "Custom architectural design for your specific industry constrains and goals.",
                   icon: "📐",
                   id: "SOL_02"
                 },
                 {
                   title: "Proven ROI",
                   desc: "Metrics-first approach. Revenue growth, cost savings, and verifiable productivity.",
                   icon: "📊",
                   id: "ROI_03"
                 }
               ].map((item, i) => (
                 <div key={i} className="bg-brand-navy border border-white/10 p-8 relative group hover:border-brand-gold/50 transition-colors">
                    <div className="absolute top-2 right-2 font-mono text-[9px] text-white/20 group-hover:text-brand-gold transition-colors">{item.id}</div>
                    
                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-2xl mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all rounded-sm border border-white/5">
                       {item.icon}
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wide">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-mono">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default ServicesPage;

