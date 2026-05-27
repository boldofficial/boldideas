import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { servicePillars, type ServicePillar } from "@/data/services";
import { getPricingForService, aiAddonPackages } from "@/data/pricing";
import PricingSection from "@/components/PricingSection";
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

// ─── Generate static params ─────────────────────────────────────────────────

export function generateStaticParams() {
  return servicePillars.map((service) => ({ slug: service.slug }));
}

// ─── Dynamic metadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePillars.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  const titles: Record<string, string> = {
    websites: "Website Development | Bold Ideas",
    "ai-agents": "AI Agents | Bold Ideas",
    "workflow-automation": "Workflow Automation | Bold Ideas",
  };

  const descriptions: Record<string, string> = {
    websites: "Professional website development for small businesses in Illinois and Wisconsin. Conversion-focused design, custom dashboards, client portals, and local SEO.",
    "ai-agents": "Practical AI agents for small business lead capture, qualification, and routing. AI website chat, sales intake, and productivity training for Illinois and Wisconsin.",
    "workflow-automation": "AI workflow automation for Illinois and Wisconsin small businesses. Connect your CRM, email, forms, and calendar into automated lead follow-up sequences.",
  };

  const title = titles[slug] || `${service.title} | Bold Ideas`;
  const description = descriptions[slug] || `Professional ${service.title.toLowerCase()} services for small businesses in Illinois and Wisconsin.`;

  return {
    title,
    description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.title} — ${service.subtitle}`,
      description,
      url: `${baseUrl}/services/${slug}`,
      siteName: "Bold Ideas",
      type: "article",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/images/boldideas_logo.png`,
          width: 1536,
          height: 1024,
          alt: `${service.title} — Bold Ideas`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Bold Ideas`,
      description,
      images: [`${baseUrl}/images/boldideas_logo.png`],
    },
    keywords: [
      `${service.title.toLowerCase()} Illinois`,
      `${service.title.toLowerCase()} Wisconsin`,
      `small business ${service.title.toLowerCase()} services`,
      `professional ${service.title.toLowerCase()} for small businesses`,
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
}

// ─── Service Page Component ─────────────────────────────────────────────────

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicePillars.find((s) => s.slug === slug);
  if (!service) notFound();

  const ServiceIcon = getServiceIcon(service.iconName);

  // Build related services (exclude current)
  const relatedServices = servicePillars.filter((s) => s.slug !== service.slug);

  // ─── JSON-LD ──────────────────────────────────────────────────────────
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Bold Ideas",
      url: baseUrl,
      logo: `${baseUrl}/boldideas_logo.png`,
      description: "Websites, AI agents, and connected follow-up systems for small businesses in Illinois and Wisconsin.",
      serviceType: ["Website Development", "AI Agents", "Workflow Automation", "Local SEO", "CRM Integration"],
      areaServed: [
        { "@type": "State", name: "Illinois" },
        { "@type": "State", name: "Wisconsin" },
      ],
      email: "admin@getboldideas.com",
      address: { "@type": "PostalAddress", addressRegion: "Illinois", addressCountry: "US" },
      contactPoint: {
        "@type": "ContactPoint",
        email: "admin@getboldideas.com",
        contactType: "sales",
        availableLanguage: ["English"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${baseUrl}/services/${service.slug}#service`,
      name: service.title,
      description: service.subtitle,
      provider: { "@id": `${baseUrl}/#organization` },
      areaServed: [
        { "@type": "State", name: "Illinois" },
        { "@type": "State", name: "Wisconsin" },
      ],
      audience: { "@type": "Audience", audienceType: service.whoItIsFor },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/services/${service.slug}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Services", item: `${baseUrl}/services` },
        { "@type": "ListItem", position: 3, name: service.title, item: `${baseUrl}/services/${service.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${baseUrl}/services/${service.slug}#faq`,
      mainEntity: service.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main className="bg-white text-brand-navy">
      {/* JSON-LD */}
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE HEADER — Blog Archive Style
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy pt-24 pb-12 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-brand-gold">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/services" className="transition hover:text-brand-gold">Services</Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-gold" aria-current="page">{service.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                  <ServiceIcon className="h-4 w-4" />
                  {service.shortTitle}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                  <MapPin className="h-4 w-4" />
                  Illinois & Wisconsin
                </span>
              </div>

              <h1 className={`text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}>
                {service.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                {service.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy shadow-xl transition hover:bg-white"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/contact?service=${service.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/80 transition hover:border-brand-gold hover:text-brand-gold"
              >
                Quick inquiry
                <MessageSquare className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRICING / PACKAGES SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        const pricing = getPricingForService(service.slug);
        if (!pricing) return null;
        const aiAddons = service.slug === 'websites' ? aiAddonPackages : undefined;
        return <PricingSection pricing={pricing} aiAddonPackages={aiAddons} />;
      })()}

      {/* ═══════════════════════════════════════════════════════════════════
          INTRO SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Overview</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              {service.intro}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
              {service.description}
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Serving</p>
              <p className={`mt-2 text-lg font-bold`}>Illinois & Wisconsin</p>
              <p className="mt-1 text-sm text-slate-500">Local expertise for Midwest businesses</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Delivery</p>
              <p className={`mt-2 text-lg font-bold`}>2–3 Weeks</p>
              <p className="mt-1 text-sm text-slate-500">From kickoff to live deployment</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Support</p>
              <p className={`mt-2 text-lg font-bold`}>Post-Launch</p>
              <p className="mt-1 text-sm text-slate-500">Training, docs, and ongoing refinement</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHO IT'S FOR + DETAILS
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-12 md:py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Who this is for */}
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <Users className="h-4 w-4" /> Who this is for
              </p>
              <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
                Built for {service.slug === "websites" ? "businesses that need a stronger digital presence" : service.slug === "ai-agents" ? "teams that want to work smarter with AI" : "companies ready to eliminate manual busywork"}
              </h2>
              <ul className="mt-8 grid gap-4">
                {service.whoItIsFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-7 text-brand-navy">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What you get */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-gold">What you get</p>
              <div className="mt-6 grid gap-4">
                {service.coreFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-gold/40 hover:shadow-md"
                  >
                    <h3 className={`text-lg font-bold text-brand-navy`}>{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BENEFITS SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Key benefits</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Why businesses choose our {service.shortTitle.toLowerCase()} services
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {service.benefits.map((benefit) => (
              <div
                key={benefit}
                className="group flex items-start gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold transition group-hover:bg-brand-gold group-hover:text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-bold leading-6 text-brand-navy">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy py-12 text-white md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#061b35_0%,#082849_50%,#0b355f_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Ready to get started?</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Let us build your {service.shortTitle.toLowerCase()} system
            </h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Tell us about your business, and we will map the right approach. No pressure — just practical conversation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy shadow-xl shadow-brand-gold/15 transition hover:bg-white"
              >
                Book a strategy call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/contact?service=${service.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/80 transition hover:border-brand-gold hover:text-brand-gold"
              >
                Send a message
                <MessageSquare className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          RELATED SERVICES
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Explore more</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Other services that work alongside {service.shortTitle.toLowerCase()}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Most businesses benefit from a combination of services. See how each piece fits together.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {relatedServices.map((related) => {
              const RelatedIcon = getServiceIcon(related.iconName);
              return (
                <Link
                  key={related.slug}
                  href={`/services/${related.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
                >
                  <div className="mb-6 inline-flex rounded-lg bg-brand-navy p-4 text-brand-gold shadow-lg transition group-hover:bg-brand-gold group-hover:text-brand-navy">
                    <RelatedIcon className="h-7 w-7" />
                  </div>
                  <h3 className={`text-xl font-bold text-brand-navy`}>{related.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{related.intro}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition group-hover:gap-3">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy transition hover:text-brand-gold"
            >
              <ArrowRight className="h-4 w-4" />
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-12 md:py-16" id="faq" itemScope itemType="https://schema.org/FAQPage">
        <div className="mx-auto max-w-[1120px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Common questions</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              Frequently asked about {service.shortTitle.toLowerCase()}
            </h2>
          </div>

          <div className="mt-10 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {service.faq.map((item) => (
              <details
                key={item.question}
                className="group p-6 [&>summary::-webkit-details-marker]:hidden [&>summary::marker]:hidden"
                itemScope
                itemType="https://schema.org/Question"
              >
                <summary className={`flex cursor-pointer items-center justify-between text-lg font-bold text-brand-navy transition hover:text-brand-gold`}>
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
                  Not sure if {service.shortTitle.toLowerCase()} is right for your business?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Tell us what you sell, where leads get stuck, and what your team repeats every week. We will map the right approach — no pressure, just practical conversation.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-xl transition hover:bg-brand-gold hover:text-brand-navy"
                >
                  Book a strategy call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/contact?service=${service.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
                >
                  Send a message
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="relative mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-slate-100 pt-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Explore:</span>
              {servicePillars.map((s) => {
                const SvgIcon = getServiceIcon(s.iconName);
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy transition hover:text-brand-gold"
                  >
                    <SvgIcon className="h-3.5 w-3.5 text-brand-gold" />
                    {s.title}
                  </Link>
                );
              })}
              <Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy transition hover:text-brand-gold">
                <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                About us
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy transition hover:text-brand-gold">
                <MessageSquare className="h-3.5 w-3.5 text-brand-gold" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
