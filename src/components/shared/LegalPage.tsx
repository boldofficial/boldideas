import React from 'react';

interface LegalPageProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  content: {
    title: string;
    text: string | string[];
  }[];
}

const LegalPage: React.FC<LegalPageProps> = ({ title, subtitle, lastUpdated, content }) => {
  return (
    <div className="pt-32 pb-24 bg-brand-light relative overflow-hidden min-h-screen">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="mb-20">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-10 h-px bg-brand-gold"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">{subtitle}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-brand-navy uppercase tracking-tighter leading-none mb-6">
            {title}
          </h1>
          <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">
            Last Protocols Updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-16">
          {content.map((section, idx) => (
            <div key={idx} className="group">
              <div className="flex items-start space-x-6">
                <span className="text-brand-gold font-mono text-xs pt-1">0{idx + 1} //</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-brand-navy uppercase tracking-tight mb-6 group-hover:text-brand-gold transition-colors">
                    {section.title}
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    {Array.isArray(section.text) ? (
                      <ul className="space-y-4">
                        {section.text.map((t, i) => (
                          <li key={i} className="text-slate-600 leading-relaxed flex items-start space-x-3">
                            <span className="text-brand-gold mt-1.5">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {section.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
