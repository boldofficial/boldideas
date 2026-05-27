import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, MonitorSmartphone, Workflow, MessageSquare, Target } from "lucide-react";
import { locations } from "@/data/locations";

const baseUrl = "https://getboldideas.com";

export const metadata: Metadata = {
  title: "Service Areas | Bold Ideas — Illinois & Wisconsin",
  description:
    "Bold Ideas serves small businesses across Illinois and Wisconsin, including Rockford, Madison, Janesville, and surrounding communities. Professional websites, intake automation, and connected systems.",
  alternates: { canonical: "/locations" },
  openGraph: {
    title: "Service Areas — Bold Ideas",
    description: "Small business website design and automation services across Illinois and Wisconsin.",
    url: `${baseUrl}/locations`,
    siteName: "Bold Ideas",
    type: "website",
    locale: "en_US",
    images: [{ url: `${baseUrl}/images/boldideas_logo.png`, width: 1536, height: 1024, alt: "Bold Ideas — Service areas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Service Areas | Bold Ideas",
    description: "Website design and automation for Illinois and Wisconsin small businesses.",
    images: [`${baseUrl}/images/boldideas_logo.png`],
  },
  keywords: [
    "website design Rockford IL",
    "website design Madison WI",
    "website design Janesville WI",
    "small business automation Illinois",
    "small business automation Wisconsin",
    "lead capture Rockford",
    "digital agency Midwest",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Bold Ideas",
    url: baseUrl,
    logo: `${baseUrl}/boldideas_logo.png`,
    description: "Websites, intake automation, and connected systems for small businesses in Illinois and Wisconsin.",
    areaServed: [
      { "@type": "State", name: "Illinois" },
      { "@type": "State", name: "Wisconsin" },
    ],
    email: "admin@getboldideas.com",
    contactPoint: { "@type": "ContactPoint", email: "admin@getboldideas.com", contactType: "sales" },
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/locations#collection`,
    url: `${baseUrl}/locations`,
    name: "Service Areas — Bold Ideas",
    isPartOf: { "@id": `${baseUrl}/#organization` },
    breadcrumb: { "@id": `${baseUrl}/locations#breadcrumb` },
    mainEntity: locations.map((loc) => ({
      "@type": "Service",
      name: `Web design and automation services in ${loc.label}`,
      areaServed: { "@type": "City", name: loc.name, containedInPlace: { "@type": "State", name: loc.state } },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/locations#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: `${baseUrl}/locations` },
    ],
  },
];

export default function LocationsHubPage() {
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
            <span className="text-brand-gold" aria-current="page">Service Areas</span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <MapPin className="h-4 w-4" />
                Illinois & Wisconsin
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              Service Areas
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Bold Ideas serves small businesses across northern Illinois, southern Wisconsin, and the surrounding Midwest. Professional websites, intake automation, and connected systems — built for local businesses that value clarity and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CITY CARDS SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Where we serve</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Local expertise for your <span className="text-brand-gold">specific market</span>.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Each market has its own business culture, buyer behavior, and competitive landscape. We build digital systems that reflect the way your local customers actually decide.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {locations.map((city) => (
              <Link
                key={city.slug}
                href={`/locations/${city.slug}`}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-gold via-cyan-500 to-brand-navy opacity-0 transition group-hover:opacity-100" />

                <div className="mb-6 inline-flex rounded-lg bg-brand-navy p-4 text-brand-gold shadow-lg transition group-hover:bg-brand-gold group-hover:text-brand-navy">
                  <MapPin className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-bold">{city.label}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {city.description.slice(0, 160)}&hellip;
                </p>

                {/* Industries */}
                <div className="mt-6 grid gap-2">
                  {city.industries.slice(0, 3).map((industry) => (
                    <div key={industry} className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                      {industry}
                    </div>
                  ))}
                </div>

                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition group-hover:gap-3">
                  Learn more about {city.name}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHAT WE BUILD (CROSS-SELL)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">What we build</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              The same services, tailored to your local market.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Whether you are in Rockford, Madison, Janesville, or any nearby community — we bring the same professional approach to every engagement.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                <MonitorSmartphone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Professional Websites</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Conversion-focused design, clear service pages, local trust signals, and lead capture built into every path.</p>
              <Link href="/services/websites" className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all hover:gap-2">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Intake & Automation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Smart forms, lead qualification, routing rules, and follow-up prompts that capture every detail before your team gets involved.</p>
              <Link href="/services/ai-agents" className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all hover:gap-2">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                <Workflow className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Connected Workflows</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">CRM connections, email sequences, booking paths, and reporting that keep your team focused on customers instead of data entry.</p>
              <Link href="/services/workflow-automation" className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all hover:gap-2">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-14">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-gold/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-brand-navy/5 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Start here</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
                  Not sure which service fits your business?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Tell us what you sell, where leads get stuck, and what your team repeats every week. We will map the right approach from there.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link href="/book" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-xl transition hover:bg-brand-gold hover:text-brand-navy">
                  Book a strategy call
                  <ArrowRight className="h-4 w-4" />
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

// ─── Inline icons ───────────────────────────────────────────────────────────

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
