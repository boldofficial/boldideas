import React from 'react';
import Link from 'next/link';
import { Cpu, Workflow, TrendingUp, MonitorSmartphone } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'AI Productivity Training',
    description: 'Hands-on AI training designed for solopreneurs and small teams to automate daily tasks, improve workflows, and boost productivity immediately.',
    icon: <Cpu className="w-10 h-10 text-brand-gold" />
  },
  {
    id: '02',
    title: 'AI Workflow Automation',
    description: 'We design simple AI-powered workflows that reduce repetitive tasks, improve efficiency, and free up your time for growth.',
    icon: <Workflow className="w-10 h-10 text-brand-gold" />
  },
  {
    id: '03',
    title: 'AI-Powered Marketing Systems',
    description: 'From SEO to automated follow-ups, we build marketing systems that help you generate leads and grow sustainably.',
    icon: <TrendingUp className="w-10 h-10 text-brand-gold" />
  },
  {
    id: '04',
    title: 'Websites & Custom Tools',
    description: 'Conversion-focused websites, dashboards, and tailored digital tools designed around your business needs.',
    icon: <MonitorSmartphone className="w-10 h-10 text-brand-gold" />
  }
];

const ServicesList: React.FC = () => {
  return (
    <section id="services-list" className="py-24 bg-[#F1F3F9] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full relative z-10 px-6 md:px-16 lg:px-24">
        
        {/* Section Header - Exact Mirror of Homepage */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-8 h-[1px] bg-brand-gold"></div>
                <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-brand-navy/60">
                    Our Services
                </span>
                <div className="w-8 h-[1px] bg-brand-gold"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy uppercase tracking-tighter mb-6">
                How We <span className="text-brand-gold italic">Help You Grow</span> with AI
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Simple, practical solutions designed to help small businesses and solopreneurs work smarter and scale faster.
            </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="h-full bg-white rounded-[40px] p-10 flex flex-col items-center text-center shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <div className="mb-8">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight mb-4">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-10 text-sm">
                {service.description}
              </p>
              <Link 
                href="/contact" 
                className="mt-auto inline-flex items-center px-10 py-3 bg-brand-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-navy transition-all duration-300 shadow-[0_4px_15px_rgba(249,186,81,0.3)]"
              >
                READ MORE
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;

