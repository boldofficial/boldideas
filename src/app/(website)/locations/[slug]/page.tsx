import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { locations, getLocationBySlug, type LocationCity } from "@/data/locations";

const baseUrl = "https://getboldideas.com";

// ─── Generate static params ─────────────────────────────────────────────────

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

// ─── Dynamic metadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = getLocationBySlug(slug);
  if (!city) return { title: "Service Area Not Found" };

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `/locations/${city.slug}` },
    openGraph: {
      title: city.heroTitle,
      description: city.metaDescription,
      url: `${baseUrl}/locations/${city.slug}`,
      siteName: "Bold Ideas",
      type: "website",
      locale: "en_US",
      images: [{ url: `${baseUrl}/images/boldideas_logo.png`, width: 1536, height: 1024, alt: `Bold Ideas — ${city.label}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Web Design & Automation | ${city.label}`,
      description: city.metaDescription,
      images: [`${baseUrl}/images/boldideas_logo.png`],
    },
    keywords: [
      `website design ${city.label}`,
      `small business automation ${city.label}`,
      `web development ${city.label}`,
      `lead capture ${city.name}`,
      `${city.name} business website`,
      `AI automation ${city.label}`,
      `CRM integration ${city.name}`,
      `digital agency ${city.label}`,
    ],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

// ─── JSON-LD Factory ────────────────────────────────────────────────────────

function buildJsonLd(city: LocationCity) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Bold Ideas",
      url: baseUrl,
      logo: `${baseUrl}/boldideas_logo.png`,
      description: "Websites, intake automation, and connected systems for small businesses.",
      areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: city.state } },
      email: "admin@getboldideas.com",
      contactPoint: { "@type": "ContactPoint", email: "admin@getboldideas.com", contactType: "sales" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Web design and automation services in ${city.label}`,
      description: city.metaDescription,
      provider: { "@id": `${baseUrl}/#organization` },
      areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: city.state } },
      serviceType: ["Website Design", "Automation", "Lead Capture", "CRM Integration"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Service Areas", item: `${baseUrl}/locations` },
        { "@type": "ListItem", position: 3, name: city.label, item: `${baseUrl}/locations/${city.slug}` },
      ],
    },
  ];
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getLocationBySlug(slug);
  if (!city) notFound();

  const jsonLd = buildJsonLd(city);

  return (
    <main className="bg-white text-brand-navy">
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE HEADER
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy pt-32 pb-16 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <nav className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-brand-gold">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/locations" className="transition hover:text-brand-gold">Service Areas</Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-gold" aria-current="page">{city.label}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                  <MapPin className="h-4 w-4" />
                  {city.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                  <Users className="h-4 w-4" />
                  Small Business Focus
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
                {city.heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                {city.heroSubtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy shadow-xl transition hover:bg-white"
              >
                Book a strategy call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
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
          ABOUT THIS MARKET
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Local expertise</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Digital systems built for the way <span className="text-brand-gold">{city.name}</span> does business.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
              {city.description}
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Service area</p>
              <p className="mt-2 text-lg font-bold">{city.label}</p>
              <p className="mt-1 text-sm text-slate-500">Primary market focus</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Nearby communities</p>
              <p className="mt-2 text-lg font-bold">{city.nearbyAreas.length}</p>
              <p className="mt-1 text-sm text-slate-500">Surrounding areas served</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Delivery</p>
              <p className="mt-2 text-lg font-bold">2&ndash;3 Weeks</p>
              <p className="mt-1 text-sm text-slate-500">From kickoff to launch</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LOCAL CONTEXT + INDUSTRIES
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">
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
            {/* Left: Local Context */}
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <Target className="h-4 w-4" /> Local context
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                What makes {city.name} different
              </h2>
              <ul className="mt-8 grid gap-4">
                {city.localContext.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-7 text-brand-navy">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Industries */}
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <MonitorSmartphone className="h-4 w-4" /> Industries we serve
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Local businesses we help
              </h2>
              <div className="mt-6 grid gap-4">
                {city.industries.map((industry) => (
                  <div
                    key={industry}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-gold/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 text-lg font-bold text-brand-navy">
                      <span className="h-2 w-2 rounded-full bg-brand-gold" />
                      {industry}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NEARBY AREAS
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Nearby communities</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Also serving surrounding areas
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              We help businesses throughout the {city.name} region, including these nearby communities.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {city.nearbyAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-gold/40 hover:shadow-md"
              >
                <MapPin className="h-5 w-5 shrink-0 text-brand-gold" />
                <span className="text-sm font-bold text-brand-navy">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHAT WE CAN BUILD (SERVICES)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#061b35_0%,#082849_50%,#0b355f_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">What we build</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              One connected system for your {city.name} business
            </h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Your website, forms, CRM, inbox, and follow-up should work together. We design each piece around one practical goal: helping good customers find you and take the next step.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="group rounded-xl border border-white/12 bg-white/8 p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-white/[0.12]">
              <div className="mb-6 inline-flex rounded-lg bg-brand-gold p-4 text-brand-navy shadow-lg">
                <MonitorSmartphone className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Professional Website</h3>
              <p className="mt-4 text-sm leading-7 text-white/68">
                Clear service pages, local trust signals, mobile-first design, and lead capture paths built for how buyers in {city.name} decide.
              </p>
              <Link href="/services/websites" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all hover:gap-3">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="group rounded-xl border border-white/12 bg-white/8 p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-white/[0.12]">
              <div className="mb-6 inline-flex rounded-lg bg-brand-gold p-4 text-brand-navy shadow-lg">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Intake & Automation</h3>
              <p className="mt-4 text-sm leading-7 text-white/68">
                Smart forms, lead qualification, routing, and follow-up prompts that capture details before your team touches a lead.
              </p>
              <Link href="/services/ai-agents" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all hover:gap-3">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="group rounded-xl border border-white/12 bg-white/8 p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-white/[0.12]">
              <div className="mb-6 inline-flex rounded-lg bg-brand-gold p-4 text-brand-navy shadow-lg">
                <Workflow className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Connected Workflows</h3>
              <p className="mt-4 text-sm leading-7 text-white/68">
                CRM connections, email sequences, booking paths, and reporting that keep your team focused on customers, not data entry.
              </p>
              <Link href="/services/workflow-automation" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all hover:gap-3">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BENEFITS
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Key benefits</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Why {city.name} businesses choose us
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              `A website that reflects your local reputation and builds trust with ${city.name} buyers`,
              "Capture more qualified leads from every visitor, not just the ones who call",
              "Respond faster to inquiries with automated intake and routing",
              "Connected tools that eliminate manual data entry between forms, email, and CRM",
              "A system your team can actually use — clear handoff, documentation, and training",
              "Post-launch refinement based on real inquiries, not guesswork",
            ].map((benefit) => (
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
          CTA
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#061b35_0%,#082849_50%,#0b355f_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Ready to get started?</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Let us build your system for {city.name}
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
                href="/contact"
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
          OTHER SERVICE AREAS
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">More service areas</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Also serving these communities
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {locations
              .filter((l) => l.slug !== city.slug)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/locations/${other.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-brand-navy shadow-sm transition hover:border-brand-gold hover:text-brand-gold hover:shadow-md"
                >
                  <MapPin className="h-4 w-4 text-brand-gold" />
                  {other.label}
                </Link>
              ))}
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-brand-navy shadow-sm transition hover:border-brand-gold hover:text-brand-gold hover:shadow-md"
            >
              View all areas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
