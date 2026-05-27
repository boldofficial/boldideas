import type { Metadata } from "next";
import Link from "next/link";
import { Bot, MapPin, MonitorSmartphone, Sparkles, Workflow } from "lucide-react";
import { servicePillars } from "@/data/services";

const baseUrl = "https://getboldideas.com";

// ─── Icon map ───────────────────────────────────────────────────────────────

function getServiceIcon(iconName: string) {
  switch (iconName) {
    case "monitor-smartphone": return MonitorSmartphone;
    case "bot": return Bot;
    case "workflow": return Workflow;
    default: return MonitorSmartphone;
  }
}

// ─── SEO Metadata ───────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Services | Bold Ideas — Websites, AI Agents & Automation",
  description:
    "We build professional websites, practical AI agents, and connected follow-up systems for small businesses in Illinois and Wisconsin. Explore our three core services.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Websites, AI Agents & Workflow Automation for Small Business",
    description: "Professional websites, AI agents, and connected follow-up systems for Illinois and Wisconsin small businesses.",
    url: `${baseUrl}/services`,
    siteName: "Bold Ideas",
    type: "website",
    locale: "en_US",
    images: [{ url: `${baseUrl}/images/boldideas_logo.png`, width: 1536, height: 1024, alt: "Bold Ideas — Services overview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Bold Ideas",
    description: "Websites, AI agents, and follow-up systems for Illinois and Wisconsin small businesses.",
    images: [`${baseUrl}/images/boldideas_logo.png`],
  },
  keywords: [
    "small business website design Illinois",
    "AI agents for small business",
    "workflow automation Wisconsin",
    "AI productivity training",
    "lead generation Illinois Wisconsin",
    "custom CRM dashboards",
    "business automation services",
    "professional websites Midwest",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

// ─── JSON-LD ────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Bold Ideas",
    url: baseUrl,
    logo: `${baseUrl}/boldideas_logo.png`,
    description: "Websites, AI agents, and connected follow-up systems for small businesses in Illinois and Wisconsin.",
    serviceType: ["Website Development", "AI Agents", "Workflow Automation", "Local SEO", "CRM Integration"],
    areaServed: [{ "@type": "State", name: "Illinois" }, { "@type": "State", name: "Wisconsin" }],
    email: "admin@getboldideas.com",
    address: { "@type": "PostalAddress", addressRegion: "Illinois", addressCountry: "US" },
    contactPoint: { "@type": "ContactPoint", email: "admin@getboldideas.com", contactType: "sales", availableLanguage: ["English"] },
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/services#collectionpage`,
    url: `${baseUrl}/services`,
    name: "Services — Bold Ideas",
    description: "Professional websites, AI agents, workflow automation for small businesses.",
    isPartOf: { "@id": `${baseUrl}/#organization` },
    breadcrumb: { "@id": `${baseUrl}/services#breadcrumb` },
    mainEntity: servicePillars.map((s) => ({ "@id": `${baseUrl}/services/${s.slug}#service` })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/services#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${baseUrl}/services` },
    ],
  },
];

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ServicesOverviewPage() {
  return (
    <main className="bg-white text-brand-navy">
      {/* JSON-LD */}
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE HEADER — Blog Archive Style
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy pt-24 pb-12 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <nav className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-brand-gold">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-gold" aria-current="page">Services</span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <Sparkles className="h-4 w-4" />
                Three Core Pillars
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                <MapPin className="h-4 w-4" />
                Illinois & Wisconsin
              </span>
            </div>

            <h1 className={`text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}>
              Websites, AI agents, and automation <span className="text-brand-gold">built for local businesses</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Practical technology designed to help Illinois and Wisconsin small businesses look more established, capture better leads, and respond faster — without the complexity.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SERVICE CARDS
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">What we do</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              One connected system for your <span className="text-brand-gold">website, leads,</span> and <span className="text-brand-gold">follow-up</span>.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Your website, AI agent, forms, calendar, CRM, inbox, and reporting should work together. We design each piece around one practical goal: helping good customers find you and take the next step.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {servicePillars.map((service) => {
              const Icon = getServiceIcon(service.iconName);
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-gold via-cyan-500 to-brand-navy opacity-0 transition group-hover:opacity-100" />
                  <div className="mb-6 inline-flex rounded-lg bg-brand-navy p-4 text-brand-gold shadow-lg transition group-hover:bg-brand-gold group-hover:text-brand-navy">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className={`text-xl font-bold text-brand-navy`}>{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{service.intro}</p>

                  {/* Features preview */}
                  <ul className="mt-6 grid gap-2">
                    {service.coreFeatures.slice(0, 3).map((feature) => (
                      <li key={feature.title} className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                        {feature.title}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition group-hover:gap-3">
                    Explore {service.shortTitle.toLowerCase()}
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT FITS TOGETHER
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">How it fits together</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Three services. One connected system.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Each service works independently, but together they create a complete digital infrastructure for your business.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                <MonitorSmartphone className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold text-brand-navy`}>1. Website</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Your digital front door. Clear pages, local trust signals, and conversion paths that make your business look established.</p>
              <Link href="/services/websites" className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-brand-gold hover:gap-2 transition-all">
                Learn more <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold text-brand-navy`}>2. AI Agent</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Your 24/7 team member. Answers questions, qualifies leads, collects details, and routes requests — before your team touches them.</p>
              <Link href="/services/ai-agents" className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-brand-gold hover:gap-2 transition-all">
                Learn more <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                <Workflow className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold text-brand-navy`}>3. Automation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Your behind-the-scenes engine. Connects forms, CRM, email, calendar, and reports so nothing falls through the cracks.</p>
              <Link href="/services/workflow-automation" className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-brand-gold hover:gap-2 transition-all">
                Learn more <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-10 pt-10 md:px-12 md:pb-14 md:pt-14 lg:px-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-14">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-gold/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-brand-navy/5 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Start here</p>
                <h2 className={`mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl`}>
                  Not sure where to start?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Tell us what you sell, where leads get stuck, and what your team repeats every week. We will map the right website, AI agent, and automation plan from there.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link href="/book" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-xl transition hover:bg-brand-gold hover:text-brand-navy">
                  Book a strategy call
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold">
                  Send a message
                  <MessageSquareIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Inline icons (avoid importing all of lucide) ───────────────────────────

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
