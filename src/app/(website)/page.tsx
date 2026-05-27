import { BookingForm } from "@/components/BookingForm";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Gauge,
  Globe2,
  Layers3,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { getPosts } from "@/actions/blog";

const servicePillars = [
  {
    icon: MonitorSmartphone,
    eyebrow: "Websites",
    title: "A sharper front door for your business",
    description:
      "Professional websites with clear messaging, fast pages, local trust signals, and lead capture built into the path.",
    points: ["Service pages", "Landing pages", "Local SEO foundations"],
  },
  {
    icon: MessageSquare,
    eyebrow: "Intake & Automation",
    title: "Smart intake that captures every detail",
    description:
      "Forms, qualification flows, and routing that collect the right information and send it where it needs to go before your team ever touches a lead.",
    points: ["Smart intake forms", "Lead qualification", "Automated routing"],
  },
  {
    icon: Workflow,
    eyebrow: "Operations",
    title: "Connected tools behind the scenes",
    description:
      "Workflows that connect forms, inboxes, calendars, CRMs, documents, and reports so follow-up does not fall through.",
    points: ["CRM automation", "Email follow-up", "Dashboards"],
  },
];

const localSignals = [
  "Illinois and Wisconsin positioning",
  "Small-business buying journeys",
  "Mobile-first local search",
  "Clear calls, forms, and follow-up",
];

const audienceSegments = [
  {
    icon: MapPin,
    title: "Local Service Growth",
    situation: "You rely on calls, quote forms, bookings, or consultations to create revenue.",
    build: "Clear service pages, local trust signals, stronger inquiry paths, and forms that capture the right details.",
    result: "People understand what you do, where you serve, and how to take the next step without friction.",
  },
  {
    icon: MessageSquare,
    title: "Instant Lead Response",
    situation: "Your team is busy, and new inquiries often wait too long for a useful response.",
    build: "Smart intake forms, FAQ handling, lead qualification, routing rules, and follow-up prompts connected to your workflow.",
    result: "More prospects get helped while interest is high, even when your team is serving customers.",
  },
  {
    icon: Layers3,
    title: "Connected Operations",
    situation: "Your website, inbox, calendar, spreadsheets, and CRM are not working as one system.",
    build: "Connected automations for forms, booking, pipeline updates, tasks, documents, and reporting.",
    result: "Your website becomes part of daily operations instead of another disconnected channel.",
  },
  {
    icon: Globe2,
    title: "Premium Web Presence",
    situation: "Your business is good, but the website does not make you look as credible as you are.",
    build: "Premium page structure, stronger messaging, proof sections, service positioning, and polished visual direction.",
    result: "Your online presence feels credible enough for the customers you want to win.",
  },
  {
    icon: Search,
    title: "Local Search Readiness",
    situation: "Customers search nearby before they call, compare, or request a quote.",
    build: "Structured pages for services, locations, FAQs, metadata, and conversion paths built around local intent.",
    result: "Your site is easier to understand, easier to navigate, and better prepared for local discovery.",
  },
  {
    icon: ShieldCheck,
    title: "Trust And Proof",
    situation: "Prospects need confidence before they share details, schedule, or commit.",
    build: "Review placement, process clarity, project proof, offer framing, and trust-building homepage sections.",
    result: "Visitors get the reassurance they need before they reach out.",
  },
];

const process = [
  {
    title: "Map the opportunity",
    description:
      "We look at your current site, lead flow, customer questions, and repeated admin work.",
  },
  {
    title: "Build the system",
    description:
      "We design the website, set up intake and automation, and connect the workflows that support sales and service.",
  },
  {
    title: "Launch and refine",
    description:
      "We test, deploy, train your team, and improve based on how real prospects and customers use it.",
  },
];

const proofCards = [
  {
    icon: Gauge,
    title: "Faster first impressions",
    text: "A clear homepage and service pages help prospects understand what you do without digging.",
  },
  {
    icon: MessageSquare,
    title: "More complete inquiries",
    text: "Well-designed intake captures the context your team needs before a call or quote.",
  },
  {
    icon: ShieldCheck,
    title: "Systems you can own",
    text: "Clean handoff, documented workflows, and practical tools your team can actually use.",
  },
];

export const metadata = {
  title: "Bold Ideas | Websites + Smart Systems",
  description:
    "Websites and smart systems for small businesses in Illinois and Wisconsin.",
};

export default async function Home() {
  const { data: allPosts } = await getPosts();
  const publishedPosts = allPosts?.filter(p => p.status === "published") || [];
  const latestPosts = publishedPosts.slice(0, 3);

  return (
    <main className="bg-white text-brand-navy">
      <section className="relative overflow-hidden bg-[#061b35] pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.20),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.20),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

        <div className="relative mx-auto grid max-w-[1380px] grid-cols-1 items-start gap-12 px-6 pb-20 pt-10 md:px-12 lg:grid-cols-[1fr_1fr] lg:px-20 lg:pt-6">
          {/* ── Left: Copy ─────────────────────────────── */}
          <div className="max-w-[640px]">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                <MapPin className="h-4 w-4" />
                Illinois and Wisconsin
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-normal sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
              Stop losing leads to
              <span className="block text-brand-gold">slow websites</span>
              <span className="block text-white/90">and missed follow-ups.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/74 md:text-lg">
              Bold Ideas helps Illinois and Wisconsin small businesses look more established, capture better leads, and respond faster with polished websites and connected systems that work from the first click.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-brand-navy shadow-xl shadow-brand-gold/15 transition hover:bg-white"
              >
                Book a strategy call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/8 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-brand-gold hover:text-brand-gold"
              >
                See what we build
                <Search className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Better leads", "Clear paths from visitor to inquiry"],
                ["Less admin", "Smart intake that captures what your team needs"],
                ["Local-ready", "Built around Midwest buyers"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-white/12 bg-white/[0.07] p-4 shadow-lg shadow-black/5 backdrop-blur">
                  <p className="text-sm font-bold text-brand-gold">{title}</p>
                  <p className="mt-2 text-sm leading-5 text-white/64">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Booking Form ────────────────────── */}
          <div className="lg:pl-6 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-8 shadow-2xl shadow-black/30 backdrop-blur-sm">
              {/* Form header */}
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-red-400" />
                <span className="flex h-3 w-3 rounded-full bg-brand-gold" />
                <span className="flex h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-auto text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                  Free consultation
                </span>
              </div>
              <BookingForm dark />
              <p className="mt-4 text-[10px] leading-relaxed text-white/40 text-center">
                We'll respond within 1 business day. No obligation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-6 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1180px] gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xl md:grid-cols-4">
          {localSignals.map((item) => (
            <div key={item} className="rounded-lg bg-slate-50 p-5">
              <CheckCircle2 className="mb-3 h-5 w-5 text-brand-gold" />
              <p className="text-sm font-black leading-6 text-brand-navy">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden pb-10 pt-14 md:pb-12 md:pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
          <div className="relative">
            <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Core services</p>
                <h2 className={`mt-3 max-w-2xl text-2xl font-bold leading-tight tracking-normal text-brand-navy sm:text-3xl lg:text-[2.65rem]`}>
                  One connected system for your website, leads, and follow-up.
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-end">
                <p className="max-w-2xl text-base leading-8 text-slate-600 lg:ml-auto">
                  Your website, forms, calendar, CRM, inbox, and reporting should all work together. We design each piece around one practical goal: helping good customers find you and take the next step.
                </p>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Designed for</p>
                  <div className="mt-4 space-y-3">
                    {["More trust", "Better inquiries", "Faster response"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-black text-brand-navy">
                        <span className="h-2 w-2 rounded-full bg-brand-gold" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {servicePillars.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-2xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-gold via-cyan-500 to-brand-navy opacity-0 transition group-hover:opacity-100" />
                    <div className="mb-7 flex items-center justify-between">
                      <div className="inline-flex rounded-lg bg-brand-navy p-4 text-brand-gold shadow-lg">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        {service.eyebrow}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold leading-tight text-brand-navy`}>{service.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
                    <ul className="mt-7 grid gap-3">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-center gap-3 text-sm font-bold text-brand-navy">
                          <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy pb-16 pt-14 text-white md:pb-20 md:pt-16">
        <div className="mx-auto max-w-[1180px] px-6 md:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">Who we serve</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-4xl`}>
              How We Help Local Businesses Grow
            </h2>
            <p className="mt-4 text-base leading-8 text-brand-gold">
              Websites, smart intake systems, and connected follow-up for Illinois and Wisconsin businesses that need clearer trust, faster response, and better leads.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {audienceSegments.map((segment) => {
              const Icon = segment.icon;
              return (
                <article
                  key={segment.title}
                  className="group flex min-h-[260px] flex-col items-center rounded-xl border border-white/16 bg-white/[0.06] p-7 text-center shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-white/[0.09]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition group-hover:border-brand-gold group-hover:text-brand-gold">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className={`mt-6 text-lg font-bold leading-tight`}>
                    {segment.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/78">{segment.situation}</p>
                  <div className="mt-auto pt-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">
                      {segment.result}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:bg-white"
            >
              Talk through your business
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_55%,#f8fafc_55%,#f8fafc_100%)]" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-gold">How it works</p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal md:text-5xl">
                A simple path from idea to launched system.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                We keep the process clear so you always know what is being built, why it matters, and how it supports your business.
              </p>
            </div>

            <div className="grid gap-5">
              {process.map((step, index) => (
                <div key={step.title} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[88px_1fr]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gold text-xl font-black text-brand-navy">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-16 text-white md:py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-gold">Why it works</p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal md:text-5xl">
                More polished online. More responsive behind the scenes.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {proofCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/8 p-6 shadow-xl shadow-black/10">
                    <Icon className="h-8 w-8 text-brand-gold" />
                    <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/68">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-5 rounded-xl border border-white/10 bg-white/8 p-6 md:grid-cols-3">
            {[
              ["Website", "Messaging, pages, forms, tracking, and speed."],
              ["Intake", "Smart forms that qualify, capture, and route every inquiry."],
              ["Automation", "CRM, inbox, calendar, docs, reports, and follow-up."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4">
                <Layers3 className="mt-1 h-6 w-6 shrink-0 text-brand-gold" />
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/64">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BLOG SECTION
         ═══════════════════════════════════════════════════════════════ */}
      {latestPosts.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
          <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                From the blog
              </p>
              <h2
                className={`mt-3 max-w-2xl text-2xl font-bold leading-tight text-brand-navy md:text-3xl lg:text-4xl`}
              >
                Practical insights for local business growth
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Articles on websites, smart systems, workflow automation, and digital marketing.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Sparkles className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-brand-gold" />
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`mt-3 text-lg font-bold leading-tight text-brand-navy transition-colors group-hover:text-brand-gold`}
                    >
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-7 text-slate-600">
                        {post.excerpt}
                      </p>
                    )}

                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all group-hover:gap-3">
                      Read article
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
              >
                View all articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1120px] px-6 text-center md:px-12">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-gold">Start here</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-brand-navy md:text-5xl">
            Let us turn your website into a smarter business system.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Tell us what you sell, where leads get stuck, and what your team repeats every week. We will map the website and system plan from there.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-brand-gold hover:text-brand-navy"
            >
              Schedule consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
            >
              Send a message
              <MessageSquare className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
