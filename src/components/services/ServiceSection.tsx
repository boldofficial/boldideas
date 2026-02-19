import React from 'react';
import { 
    Cpu, 
    Workflow, 
    TrendingUp, 
    MonitorSmartphone,
    CheckCircle2,
    ArrowRight 
} from 'lucide-react';
import { Service } from '@/data/services';
import Link from 'next/link';

interface ServiceSectionProps {
    service: Service;
    isEven: boolean;
}

const getIcon = (name: string) => {
    switch (name) {
        case 'cpu': return <Cpu className="w-12 h-12 text-brand-gold" />;
        case 'workflow': return <Workflow className="w-12 h-12 text-brand-gold" />;
        case 'trending-up': return <TrendingUp className="w-12 h-12 text-brand-gold" />;
        case 'monitor-smartphone': return <MonitorSmartphone className="w-12 h-12 text-brand-gold" />;
        default: return <Cpu className="w-12 h-12 text-brand-gold" />;
    }
};

const ServiceSection: React.FC<ServiceSectionProps> = ({ service, isEven }) => {
    return (
        <section className={`py-24 overflow-hidden ${isEven ? 'bg-white' : 'bg-[#F1F3F9]'}`}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24">
                <div className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                    
                    {/* Visual Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl">
                            <img 
                                src={service.heroImage} 
                                alt={service.title} 
                                className="w-full h-[400px] md:h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-brand-navy/20"></div>
                        </div>
                        {/* Decorative background element */}
                        <div className={`absolute -inset-4 z-0 rounded-[40px] opacity-10 border-2 border-brand-gold ${isEven ? 'translate-x-4 translate-y-4' : '-translate-x-4 translate-y-4'}`}></div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex items-center space-x-4 mb-6">
                            {getIcon(service.iconName)}
                            <div className="h-[1px] w-12 bg-brand-gold"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-navy/40">
                                {service.subtitle}
                            </span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-brand-navy uppercase tracking-tighter mb-8 leading-tight">
                            {service.title}
                        </h2>
                        
                        <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                            {service.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {service.coreFeatures.map((feature, idx) => (
                                <div key={idx} className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                    <h4 className="text-sm font-black text-brand-navy uppercase mb-2 tracking-tight">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-12">
                            <h4 className="text-xs font-black text-brand-navy/60 uppercase tracking-widest mb-4">Strategic Benefits:</h4>
                            {service.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-slate-500">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <Link 
                            href="/contact"
                            className="inline-flex items-center px-10 py-4 bg-brand-navy text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 shadow-xl group"
                        >
                            GET STARTED 
                            <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;
