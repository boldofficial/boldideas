import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  Clock,
  MapPin,
  MonitorSmartphone,
  Quote,
  Search,
  Target,
  Workflow,
} from "lucide-react";

const baseUrl = "https://getboldideas.com";

// ─── SEO Metadata ───────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About Bold Ideas | Websites, AI Agents & Automation",
  description:
    "Bold Ideas builds professional websites, AI agents, and connected follow-up systems for small businesses in Illinois and Wisconsin. Learn how we help local businesses look more established, capture better leads, and respond faster.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Bold Ideas | Websites, AI Agents & Automation for Small Business",
    description:
      "Websites, AI agents, and connected follow-up systems for Illinois and Wisconsin small businesses. Practical technology that makes your business easier to choose and easier to run.",
    url: `${baseUrl}/about`,
    siteName: "Bold Ideas",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/images/boldideas_logo.png`,
        width: 1536,
        height: 1024,
        alt: "Bold Ideas — Website and AI automation workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Bold Ideas",
    description: "Websites, AI agents, and follow-up systems for Illinois and Wisconsin small businesses.",
    images: [`${baseUrl}/images/boldideas_logo.png`],
  },
  keywords: [
    "Bold Ideas",
    "website design Illinois",
    "AI agents small business",
    "workflow automation Wisconsin",
    "small business websites",
    "AI for local businesses",
    "lead capture systems",
    "CRM integration Midwest",
    "business automation Illinois",
    "professional websites Wisconsin",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── Static Content Data ────────────────────────────────────────────────────

const principles = [
  {
    icon: Target,
    title: "A website should create clarity",
    text: "Visitors should understand what you do, where you serve, why they should trust you, and how to take the next step without hunting.",
  },
  {
    icon: Bot,
    title: "AI should support real work",
    text: "We use AI agents for practical jobs: answering common questions, collecting intake details, routing requests, and helping teams respond faster.",
  },
  {
    icon: Workflow,
    title: "Follow-up should be built in",
    text: "A good inquiry is only useful when it reaches the right person with enough context and a clear next action.",
  },
];

const services = [
  {
    icon: MonitorSmartphone,
    title: "Professional websites",
    text: "Conversion-focused homepages, service pages, landing pages, local trust sections, and clear contact paths that make your business look established.",
    href: "/services",
  },
  {
    icon: Bot,
    title: "AI agents",
    text: "Website assistants that answer FAQs, qualify leads, collect details, and guide prospects to the right action without your team lifting a finger.",
    href: "/services",
  },
  {
    icon: Workflow,
    title: "Connected workflows",
    text: "Forms, CRM, inbox, booking, task handoff, email follow-up, and reporting connected around your sales process so nothing falls through.",
    href: "/services",
  },
];

const fitSignals = [
  "You serve customers in Illinois, Wisconsin, or nearby Midwest markets.",
  "Your website does not reflect the quality of your actual business.",
  "You need better quote requests, bookings, consultations, or service inquiries.",
  "Your team repeats the same intake, FAQ, scheduling, or follow-up tasks.",
  "You want technology that feels practical, not complicated or over-engineered.",
];

const process = [
  {
    step: "01",
    title: "Map the business reality",
    text: "We review your current website, lead sources, customer questions, service areas, and where follow-up slows down. This gives us a clear picture of what needs to change.",
  },
  {
    step: "02",
    title: "Design the customer path",
    text: "We structure the pages, offers, calls to action, AI agent behavior, and CRM flow around how your buyers actually decide and take the next step.",
  },
  {
    step: "03",
    title: "Build the system",
    text: "We create the website, configure the agent, connect forms and workflow tools, and prepare everything for a smooth launch with your team.",
  },
  {
    step: "04",
    title: "Improve after launch",
    text: "We look at real inquiries, adjust messaging, refine automations, and keep the system aligned with how your business grows and changes.",
  },
];

const stats = [
  { value: "40+", label: "Websites & systems built", icon: MonitorSmartphone },
  { value: "95%", label: "Client satisfaction rate", icon: BadgeCheck },
  { value: "3+ yrs", label: "Serving Midwest businesses", icon: Clock },
  { value: "IL + WI", label: "Primary service region", icon: MapPin },
];

const testimonials = [
  {
    quote: "Bold Ideas transformed our online presence. Our website now clearly communicates who we are, and the AI chatbot handles after-hours inquiries we were missing before.",
    author: "Michael T.",
    role: "Home Services Owner, Illinois",
  },
  {
    quote: "The follow-up automation alone saved us hours per week. Leads get qualified before they even reach us, and we close more because we respond faster.",
    author: "Sarah K.",
    role: "Medical Practice Manager, Wisconsin",
  },
];

const faq = [
  {
    question: "What does Bold Ideas do?",
    answer:
      "Bold Ideas builds professional websites, practical AI agents, and connected follow-up systems for small businesses. We specialize in helping companies serving Illinois and Wisconsin markets look more established, capture better leads, and respond faster without making technology feel complicated.",
  },
  {
    question: "Who is Bold Ideas best suited for?",
    answer:
      "We are best suited for service businesses, local providers, professional firms, and growing teams that need a stronger online presence and a more reliable way to capture and follow up with leads. Home services, medical and wellness providers, professional firms, retail and local commerce, education teams, and real estate businesses are common fits.",
  },
  {
    question: "Do you only build websites?",
    answer:
      "No. Websites are often the front door, but we also build AI assistants, intake flows, CRM connections, booking paths, and automations that support sales and service. Every engagement is shaped around the same question: how can the website, AI agent, and follow-up process work together to create better opportunities?",
  },
  {
    question: "Do you work with businesses outside Illinois and Wisconsin?",
    answer:
      "Yes, but our primary market focus is on Illinois and Wisconsin small businesses because that is where we deliver the most value. Our systems are designed around local market dynamics, and our messaging, case studies, and workflows reflect that regional expertise.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects take 2-4 weeks from kickoff to launch, depending on scope. A simple website with an AI agent can be live in 2 weeks. More complex builds with CRM integration, custom workflows, and training typically take 3-4 weeks. We work in focused sprints to keep momentum high.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We provide post-launch support, monitoring, and refinement. We look at real inquiries, adjust messaging, improve automations, and ensure your team is confident using the system. Ongoing support plans are available to keep everything running smoothly as your business grows.",
  },
];

// ─── JSON-LD Structured Data ───────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Bold Ideas",
    url: baseUrl,
    logo: `${baseUrl}/boldideas_logo.png`,
    description:
      "Websites, AI agents, and connected follow-up systems for small businesses in Illinois and Wisconsin.",
    foundingDate: "2023",
    email: "admin@getboldideas.com",
    areaServed: [
      { "@type": "State", name: "Illinois" },
      { "@type": "State", name: "Wisconsin" },
    ],
    serviceType: [
      "Website Design",
      "AI Agent Development",
      "Workflow Automation",
      "Lead Capture Systems",
      "CRM Integration",
      "Local SEO",
    ],
    sameAs: [
      "https://www.linkedin.com/company/boldideasinnovations",
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Illinois",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "admin@getboldideas.com",
      contactType: "sales",
      availableLanguage: ["English"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${baseUrl}/about#aboutpage`,
    url: `${baseUrl}/about`,
    name: "About Bold Ideas",
    isPartOf: { "@id": `${baseUrl}/#organization` },
    about: { "@id": `${baseUrl}/#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/boldideas_logo.png`,
    },
    breadcrumb: { "@id": `${baseUrl}/about#breadcrumb` },
    mainEntity: { "@id": `${baseUrl}/about#faq` },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/about#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${baseUrl}/about` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/about#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

// ─── Page Component ─────────────────────────────────────────────────────────

export default function About() {
  return (
    <main className="bg-white text-brand-navy">
      {/* JSON-LD Structured Data */}
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE HEADER — Blog Archive Style
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy pt-24 pb-12 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <nav className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-brand-gold">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-gold" aria-current="page">About</span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <Target className="h-4 w-4" />
                Our Story
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                <MapPin className="h-4 w-4" />
                Illinois & Wisconsin
              </span>
            </div>

            <h1 className={`max-w-3xl text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}>
              About Bold Ideas
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Websites, AI agents, and connected follow-up systems for small businesses in Illinois and Wisconsin.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STORY / MISSION SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Our story</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Technology should make a small business <span className="text-brand-gold">easier to choose</span> and{" "}
              <span className="text-brand-gold">easier to run</span>.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Bold Ideas was founded on a simple observation: most small businesses in the Midwest
              have great services but websites and follow-up systems that do not reflect their quality. We bridge
              that gap with practical technology built for real businesses, not tech demos.
            </p>
          </div>

          {/* Principles Grid */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article
                  key={principle.title}
                  className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
                >
                  <div className="mb-6 inline-flex rounded-lg bg-brand-navy p-4 text-brand-gold shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className={`text-xl font-bold`}>{principle.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{principle.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT WE BUILD SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy py-14 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_80%,rgba(249,186,81,0.10),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(75,143,191,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">What we build</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              A connected digital front office for modern small businesses.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Every engagement is shaped around the same question: how can the website, AI agent, and follow-up
              process work together to create better opportunities?
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group rounded-xl border border-white/12 bg-white/8 p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-white/[0.12] hover:shadow-2xl"
                >
                  <div className="mb-6 inline-flex rounded-lg bg-brand-gold p-4 text-brand-navy shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className={`text-xl font-bold text-white`}>{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">{service.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHO WE SERVE SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            {/* Left: Main message */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Who we serve</p>
              <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
                Built for small businesses where{" "}
                <span className="text-brand-gold">every inquiry matters</span>.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                We are a strong fit for home services, medical and wellness providers, professional firms,
                retail and local commerce, education teams, real estate businesses, and service companies
                that need a more polished digital system.
              </p>

              {/* Stats Grid */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <Icon className="mb-3 h-5 w-5 text-brand-gold" />
                      <p className={`text-2xl font-extrabold text-brand-navy`}>{stat.value}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Fit signals */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-5 w-5 text-brand-gold" />
                <p className={`text-lg font-bold`}>You are in the right place if&hellip;</p>
              </div>
              <div className="grid gap-4">
                {fitSignals.map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                    <p className="text-sm leading-7 text-brand-navy">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-navy px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand-gold hover:text-brand-navy"
              >
                Talk through your fit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PROCESS SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy py-14 text-white md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#061b35_0%,#082849_50%,#0b355f_100%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">How we work</p>
              <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
                Clear process. Practical builds. Better handoff.
              </h2>
              <p className="mt-5 text-base leading-8 text-white/70">
                We keep the work understandable so owners and teams know what is being built, why it matters,
                and how to use it after launch. No black boxes, no surprises.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {process.map((item) => (
                <article
                  key={item.step}
                  className="group rounded-xl border border-white/12 bg-white/8 p-6 transition duration-300 hover:border-brand-gold/40 hover:bg-white/[0.10]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-gold text-sm font-black text-brand-navy">
                    {item.step}
                  </div>
                  <h3 className={`text-lg font-bold text-white`}>{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS / SOCIAL PROOF SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Trusted by local businesses</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Real results from{" "}
              <span className="text-brand-gold">real Midwest businesses</span>.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure
                key={item.author}
                className="relative rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Quote className="mb-4 h-8 w-8 text-brand-gold/40" />
                <blockquote className="text-base leading-8 text-slate-700">{item.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-black text-brand-gold">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-navy">{item.author}</p>
                    <p className="text-xs font-medium text-slate-500">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ SECTION (with JSON-LD schema)
         ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-14 md:py-20" id="faq">
        <div className="mx-auto max-w-[1120px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Common questions</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              About working with Bold Ideas
            </h2>
          </div>

          <div
            className="mt-10 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            {faq.map((item) => (
              <details key={item.question} className="group p-6 [&>summary::-webkit-details-marker]:hidden [&>summary::marker]:hidden" itemScope itemType="https://schema.org/Question">
                <summary
                  className={`flex cursor-pointer items-center justify-between text-lg font-bold text-brand-navy transition hover:text-brand-gold`}
                >
                  <span itemProp="name">{item.question}</span>
                  <span className="ml-4 text-2xl leading-none text-brand-gold transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <div itemScope itemType="https://schema.org/Answer" className="mt-4">
                  <p className="text-sm leading-7 text-slate-600" itemProp="text">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-14 pt-14 md:px-12 md:pb-20 md:pt-20 lg:px-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-14">
            {/* Background accents */}
            <div className="absolute right-0 top-0 h-32 w-32 bg-brand-gold/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 h-24 w-24 bg-brand-navy/5 blur-3xl rounded-full" />

            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Start here</p>
                <h2 className={`mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl`}>
                  Ready to make your website and follow-up system work harder?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Visit our services page to explore the build options, or contact us to map the right website
                  and AI agent plan for your business. No pressure, just practical conversation.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-xl transition hover:bg-brand-gold hover:text-brand-navy"
                >
                  View services
                  <Search className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
