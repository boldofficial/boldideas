import React from 'react';

const AboutServices: React.FC = () => {
    return (
        <section className="py-24 px-6 lg:px-24 relative overflow-hidden bg-white">
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-5xl lg:text-6xl font-black text-brand-navy tracking-tighter leading-none mb-6">
                            <span className="text-brand-navy tracking-[0.3em]">What We</span> { ' '}
                            <span className="text-brand-gold italic">Do</span>
                        </h2>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Flagship Module (Full Width) */}
                    {[
                        {
                            id: '01',
                            title: 'AI Productivity Training for Corporate Organizations',
                            desc: 'Our flagship service: We deliver hands-on AI productivity training designed specifically for corporate teams, government agencies, educational institutions, and NGOs.',
                            context: 'This is not theory or hype.',
                            points: [
                                'Use AI tools to work faster and smarter',
                                'Automate repetitive tasks (emails, reports, documentation)',
                                'Improve collaboration and decision-making',
                                'Apply AI safely, ethically, and efficiently in daily work'
                            ],
                            formats: [
                                'On-site workshops',
                                'Virtual live sessions',
                                'Executive AI briefings',
                                'Department-specific AI workflows'
                            ],
                            outcome: 'Outcome: Teams save time, reduce errors, and become AI-confident—not AI-confused.',
                            theme: 'navy'
                        }
                    ].map((mod, i) => (
                        <div
                            key={i}
                            className="group relative border border-brand-navy bg-brand-navy text-white transition-all duration-500 overflow-hidden p-8 shadow-xl rounded-sm">
                            
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold/40 transition-all"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold/40 transition-all"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 flex items-center justify-center font-black text-xs border bg-brand-gold text-brand-navy border-brand-gold">
                                            {mod.id}
                                        </div>
                                        <h3 className="text-xl lg:text-3xl font-black uppercase tracking-tight leading-none text-white whitespace-pre-wrap max-w-lg">
                                            {mod.title}
                                        </h3>
                                    </div>
                                    <div className="hidden lg:block h-px flex-1 mx-8 bg-white/10"></div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <p className="text-base font-bold text-brand-gold">
                                            {mod.desc}
                                        </p>
                                        
                                        <p className="text-sm font-medium text-white/50 italic">{mod.context}</p>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">We train your staff to:</p>
                                            <ul className="space-y-2">
                                                {mod.points.map((p, idx) => (
                                                    <li key={idx} className="flex items-start space-x-3 text-sm text-white/70">
                                                        <span className="text-brand-gold">🔹</span>
                                                        <span>{p}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black tracking-widest text-brand-gold uppercase">Training formats include:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {mod.formats.map((f, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <p className="text-sm font-black italic text-brand-gold mb-8">
                                                {mod.outcome}
                                            </p>
                                            
                                            <button className="inline-flex items-center space-x-4 py-3 px-6 border bg-brand-gold text-brand-navy border-brand-gold hover:bg-white hover:border-white transition-all w-full lg:w-auto justify-center">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                                    Request_Training
                                                </span>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Secondary Modules (3-Column Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                id: '02',
                                title: 'AI Consulting & Workflow Automation',
                                desc: 'We analyze your current operations and design custom AI-powered workflows that fit your organization—not generic SaaS tools.',
                                highlights: ['AI Agents', 'Automation', 'Custom Scripts'],
                            },
                            {
                                id: '03',
                                title: 'Digital Marketing & Growth Systems',
                                desc: 'We combine AI + digital marketing strategy to help businesses grow sustainably. This isn’t just marketing—it’s growth infrastructure.',
                                highlights: ['AI SEO', 'Funnels', 'CRM'],
                            },
                            {
                                id: '04',
                                title: 'Custom Websites & Internal Tools',
                                desc: 'We design and build conversion-focused business websites, admin dashboards, and internal tools tailored to your workflow.',
                                highlights: ['Portals', 'Dashboards', 'Secure'],
                            }
                        ].map((mod, i) => (
                            <div
                                key={i}
                                className="group relative border bg-white border-slate-100 hover:border-brand-gold/30 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden p-6 lg:p-8 flex flex-col justify-between">
                                
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-gold/40 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-gold/40 transition-all"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-8 h-8 flex items-center justify-center font-black text-[10px] border bg-brand-light text-brand-navy border-slate-100 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
                                            {mod.id}
                                        </div>
                                        <h4 className="text-sm font-black uppercase tracking-tight leading-tight text-brand-navy">
                                            {mod.title}
                                        </h4>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-medium leading-relaxed text-slate-500">
                                            {mod.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {mod.highlights.map((h, idx) => (
                                                <span key={idx} className="px-1.5 py-0.5 text-[7px] font-black tracking-widest uppercase border bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-start">
                                        <button className="inline-flex items-center space-x-3 py-2 px-4 border bg-brand-navy text-brand-gold border-brand-navy hover:bg-transparent hover:text-brand-navy transition-all">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                                Inquire
                                            </span>
                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutServices;
