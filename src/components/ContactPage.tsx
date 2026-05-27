import React from 'react';
import Link from 'next/link';
import { ContactForm } from './CRMForms';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* ═══════════════════════════════════════════════════════════════
          PAGE HEADER — Blog Archive Style
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy pt-24 pb-12 md:pb-16">
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
              Contact
            </span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                Let&apos;s talk
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                Illinois &amp; Wisconsin
              </span>
            </div>

            <h1
              className={`max-w-3xl text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}
            >
              Let&apos;s build something{" "}
              <span className="text-brand-gold">bold</span> together.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Tell us about your business, where leads get stuck, and what your
              team repeats every week. We will map the right website and AI plan
              from there.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTACT FORM
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-[#F1F3F9]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Left Column: Context */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-black text-brand-navy leading-[0.95] tracking-tighter mb-6">
                Smarter <span className="text-brand-gold italic">Work.</span>
                <br />
                Faster <span className="text-brand-gold">Growth.</span>
                <br />
                <span className="text-brand-navy">Bold Ideas.</span>
              </h2>

              <p className="text-base md:text-lg text-slate-500 mb-12 max-w-md leading-relaxed font-medium">
                We don&apos;t just talk about AI&mdash;we{" "}
                <span className="text-brand-navy font-bold">
                  deploy it into real workflows
                </span>
                . Request a strategy session to audit your digital backbone and
                unlock measurable efficiency.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="group">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4 flex items-center">
                    <span className="mr-3 text-sm">📍</span> HQ_BASE
                  </h3>
                  <p className="text-slate-400 font-mono text-xs leading-relaxed uppercase tracking-wider">
                    Illinois & Wisconsin
                    <br />
                    Remote Operations
                  </p>
                </div>

                <div className="group">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4 flex items-center">
                    <span className="mr-3 text-sm">📧</span> COMM_CHANNEL
                  </h3>
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                    admin@getboldideas.com
                  </p>
                  <div className="w-0 group-hover:w-full h-px bg-brand-gold/30 transition-all duration-500 mt-2"></div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-navy blur-3xl opacity-[0.03] group-hover:opacity-[0.05] transition-opacity rounded-3xl"></div>

                <div className="relative bg-white border border-slate-200 p-1 rounded-sm shadow-[0_32px_64px_-16px_rgba(0,45,91,0.08)] overflow-hidden">
                  <div className="p-8">
                    <ContactForm theme="light" className="shadow-none border-none p-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
