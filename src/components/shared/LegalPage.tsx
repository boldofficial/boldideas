import React from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* ═══════════════════════════════════════════════════════════════
          PAGE HEADER — Blog Archive Style
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy pt-32 pb-16 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <nav
            className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-brand-gold">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-gold" aria-current="page">
              {title}
            </span>
          </nav>

          <div className="max-w-4xl">
            <h1
              className={`max-w-3xl text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}
            >
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              {subtitle} &mdash; Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTENT
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-[#F1F3F9]">
        <div className="mx-auto max-w-[1180px] px-6 md:px-12 lg:px-20 py-16 md:py-20">
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
    </div>
  );
};

export default LegalPage;
