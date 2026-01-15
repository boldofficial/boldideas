
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, CheckCircle, AlertTriangle, Zap } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[] | null;
  imageUrl: string | null;
}

interface Props {
    projects: Project[];
}

const ProjectsPage: React.FC<Props> = ({ projects }) => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20 px-4 relative overflow-hidden mb-16">
         <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(#FFB81C 1px, transparent 1px), linear-gradient(90deg, #FFB81C 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-block bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-gold/30">
               Case Studies
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
               Operational <span className="text-brand-gold">Successes</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-mono">
               Review successful deployment protocols and outcome analysis.
            </p>
         </div>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12">
            {projects.map((project, idx) => (
                <div key={project.id} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col md:flex-row">
                    
                    {/* Visual Side */}
                    <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-brand-navy">
                        {project.imageUrl ? (
                           <Image 
                              src={project.imageUrl} 
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                           />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Cpu className="text-brand-gold w-20 h-20 opacity-20" />
                           </div>
                        )}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                             {project.tags?.map(tag => (
                                 <span key={tag} className="bg-brand-navy/90 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-brand-gold/20">
                                     {tag}
                                 </span>
                             ))}
                        </div>
                    </div>

                    {/* Content Side (The Schematic) */}
                    <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative">
                        {/* Watermark */}
                        <div className="absolute top-4 right-4 text-[6rem] font-black text-slate-100 opacity-50 select-none pointer-events-none -rotate-12">
                           {String(idx + 1).padStart(2, '0')}
                        </div>

                        <h3 className="text-2xl font-black text-brand-navy mb-8 uppercase tracking-tight relative z-10 w-fit">
                            {project.title}
                            <div className="h-1 w-full bg-brand-gold mt-2"></div>
                        </h3>

                        <div className="space-y-6 relative z-10">
                            {/* The Problem */}
                            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Target Anomaly (Problem)</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{project.problem}</p>
                                </div>
                            </div>

                            {/* The Solution */}
                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Process Deployed (Solution)</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{project.solution}</p>
                                </div>
                            </div>

                            {/* The Result */}
                            <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Operational Outcome (Result)</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed font-bold">{project.result}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                                Status: <span className="text-emerald-500">COMPLETE</span>
                            </span>
                            
                            <Link href="/contact" className="group/link flex items-center text-brand-navy font-black text-xs uppercase tracking-widest hover:text-brand-gold transition-colors">
                                Get Similar Project <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
