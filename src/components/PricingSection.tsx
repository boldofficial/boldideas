'use client';

import { useState, useCallback } from 'react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Mail,
  User,
  ShoppingCart,
  Star,
  Globe,
  ShieldCheck,
  Smartphone,
  Search,
  Unlock,
  HelpCircle,
  MessageSquare,
  Phone,
  Bot,
  Zap,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { PricingPackage, ServicePricing } from '@/data/pricing';
import Link from 'next/link';

interface PricingSectionProps {
  pricing: ServicePricing;
  aiAddonPackages?: PricingPackage[];
}

// ─── FAQ data ───────────────────────────────────────────────────────────────

const pricingFaq = [
  {
    question: 'How long does it take to launch my website?',
    answer:
      'Basic Websites usually launch in 5-7 days from the time we receive your content and branding materials. Custom Websites are scoped after discovery because the timeline depends on features, integrations, and design complexity.',
  },
  {
    question: 'Do I own my website and domain?',
    answer:
      'Yes. You own everything \u2014 the website files, the domain name, and the hosting account. There are no lock-in contracts. If you ever want to leave, you take everything with you.',
  },
  {
    question: 'What happens after I purchase?',
    answer:
      'You will receive a welcome email within 24 hours with a brief questionnaire about your business, brand, and goals. We will schedule a short kickoff call, then begin building. You will receive progress updates and a preview link before launch.',
  },
  {
    question: 'Can I update the content myself?',
    answer:
      'Yes. The Basic Website includes Sanity CMS so you can edit core content without touching code. Custom Websites can include Sanity CMS or another content workflow based on your needs.',
  },
  {
    question: 'What if I need ongoing changes?',
    answer:
      'All monthly plans include ongoing updates, monitoring, backups, and edits. You can request changes anytime, and we handle them as part of your care plan. No hourly surprises.',
  },
  {
    question: 'Can I upgrade my plan later?',
    answer:
      'Absolutely. You can start with the Basic Website and move into a custom build later when you need premium design, integrations, quote forms, booking, dashboards, or automation.',
  },
];

// ─── Trust items ────────────────────────────────────────────────────────────

const trustItems = [
  { icon: Globe, label: 'You own your website' },
  { icon: ShieldCheck, label: 'You own your domain' },
  { icon: Search, label: 'No hidden fees' },
  { icon: Unlock, label: 'No lock-in contract' },
  { icon: Smartphone, label: 'Mobile optimized' },
  { icon: Zap, label: 'SEO-ready structure' },
];

// ─── Website comparison rows ───────────────────────────────────────────────

interface ComparisonRow {
  label: string;
  note?: string;
  values: string[];
  highlight?: boolean;
}

const websiteComparisonRows: ComparisonRow[] = [
  { label: 'Starting Price', values: ['$795', 'Custom quote'], highlight: true },
  { label: 'Pages', values: ['Up to 7 pages', 'Scoped to project'] },
  { label: 'CMS', values: ['Sanity CMS', 'Sanity CMS or custom'] },
  { label: 'Design Direction', values: ['Clean professional design', 'Premium custom design'] },
  { label: 'Responsive Layout', values: ['\u2713 Included', '\u2713 Included'] },
  { label: 'Basic SEO Setup', values: ['\u2713 Included', '\u2713 Included'] },
  { label: 'Contact Form', values: ['\u2713 Included', '\u2713 Included'] },
  { label: 'Advanced Quote Forms', values: ['\u2014', '\u2713 Optional'] },
  { label: 'Booking or Payment Flows', values: ['\u2014', '\u2713 Optional'] },
  { label: 'CRM / Automation Integrations', values: ['\u2014', '\u2713 Optional'] },
  { label: 'Dashboard or Client Portal', values: ['\u2014', '\u2713 Optional'] },
  { label: 'AI Chat or Lead Qualification', values: ['\u2014', '\u2713 Optional'] },
  { label: 'Launch Support', values: ['\u2713 Included', '\u2713 Included'] },
];

const quoteFeatureOptions = [
  'Premium custom design',
  'More than 7 pages',
  'Advanced quote request form',
  'Booking or appointment scheduling',
  'Online payment or checkout',
  'Blog or resource library',
  'CRM integration',
  'Email marketing integration',
  'Client portal',
  'Admin dashboard',
  'AI chat or lead qualification',
  'Multi-location SEO pages',
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function PricingSection({ pricing, aiAddonPackages }: PricingSectionProps) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<PricingPackage | null>(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedQuoteFeatures, setSelectedQuoteFeatures] = useState<string[]>([]);

  const isWebsites = pricing.serviceSlug === 'websites';

  const toggleQuoteFeature = (feature: string) => {
    setSelectedQuoteFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature]
    );
  };

  const quoteHref = `/contact?service=websites&type=custom-quote&features=${encodeURIComponent(
    selectedQuoteFeatures.join(', ')
  )}`;

  const openCheckout = useCallback((pkg: PricingPackage) => {
    setSelectedPkg(pkg);
    setCheckoutName('');
    setCheckoutEmail('');
    setError(null);
    setModalOpen(true);
  }, []);

  async function handlePurchase() {
    const pkg = selectedPkg;
    if (!pkg) return;

    const name = checkoutName.trim();
    const email = checkoutEmail.trim();

    if (!name || !email) {
      setError('Please enter your name and email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoadingSlug(pkg.slug);
    setError(null);

    try {
      const amount = pkg.oneTimePrice;

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: pricing.serviceSlug,
          packageName: pkg.name,
          packageSlug: pkg.slug,
          amount,
          monthlyPrice: pkg.monthlyPrice,
          customerName: name,
          customerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('[PricingSection] Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoadingSlug(null);
    }
  }

  const getCtaLabel = (pkg: PricingPackage) => {
    switch (pkg.slug) {
      case 'basic-website':
        return 'Start Basic Website';
      case 'custom-website':
        return 'Request a Call Back';
      case 'ai-receptionist':
        return 'Add AI Receptionist';
      case 'ai-suite':
        return 'Add AI Suite';
      case 'automation-suite':
        return 'Start Automation';
      default:
        return 'Get This Package';
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-14 md:py-20" id="pricing">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)",
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-brand-navy md:text-4xl">
            Choose the right plan for your business
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-500">
            No hidden fees. No lock-in contracts. You own everything we build.
          </p>
        </div>

        {/* ── Compact pricing cards ────────────────────────────────────── */}
        <div className={cn('mt-12 grid gap-8 md:grid-cols-2', isWebsites ? 'lg:grid-cols-2' : 'lg:grid-cols-3')}>
          {pricing.packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300',
                pkg.highlighted
                  ? 'border-brand-gold/40 ring-1 ring-brand-gold/20 scale-[1.02] shadow-xl shadow-brand-gold/5 hover:shadow-2xl hover:shadow-brand-gold/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
              )}
            >
              {/* Most Popular badge */}
              {pkg.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-gold to-amber-400 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-brand-navy shadow-lg">
                  <Star className="h-3 w-3 fill-brand-navy" />
                  Most Popular
                </div>
              )}

              <div className="flex flex-1 flex-col p-8">
                {/* Package name + subtitle */}
                <h3 className="text-xl font-bold text-brand-navy">{pkg.name}</h3>
                {pkg.subtitle && (
                  <p className="mt-1.5 text-sm leading-5 text-slate-500">{pkg.subtitle}</p>
                )}

                {/* Pricing (shown only for websites) */}
                {isWebsites && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="flex items-baseline gap-3">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                          Setup Fee
                        </p>
                        {pkg.oneTimePrice > 0 ? (
                          <>
                            <p className="mt-0.5 text-3xl font-extrabold text-brand-navy">
                              ${pkg.oneTimePrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">one-time</p>
                          </>
                        ) : (
                          <>
                            <p className="mt-0.5 text-3xl font-extrabold text-brand-navy">
                              Custom
                            </p>
                            <p className="text-xs text-slate-400">priced after scope</p>
                          </>
                        )}
                      </div>
                      {pkg.monthlyPrice > 0 && (
                        <>
                          <div className="text-slate-300 text-lg font-light">+</div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                              Monthly Care
                            </p>
                            <p className="mt-0.5 text-3xl font-extrabold text-brand-navy">
                              ${pkg.monthlyPrice}
                            </p>
                            <p className="text-xs text-slate-400">/month</p>
                          </div>
                        </>
                      )}
                    </div>

                    {pkg.monthlyPrice > 0 && (
                      <p className="mt-3 text-xs leading-5 text-slate-400">
                        Includes hosting, monitoring, backups, security updates &amp; maintenance
                      </p>
                    )}
                  </div>
                )}

                {/* Features (shown inside cards for non-websites services) */}
                {!isWebsites && pkg.features.length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                      What&rsquo;s Included
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {pkg.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm leading-5 text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA — websites: purchase, other services: get a quote */}
                {isWebsites && pkg.slug === 'custom-website' ? (
                  <Link
                    href="/book?service=websites&topic=custom-website-callback"
                    className={cn(
                      'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-lg transition-all duration-200',
                      'bg-brand-gold text-brand-navy shadow-brand-gold/25 hover:bg-brand-navy hover:text-white hover:shadow-xl hover:-translate-y-0.5'
                    )}
                  >
                    {getCtaLabel(pkg)}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : isWebsites ? (
                  <button
                    onClick={() => openCheckout(pkg)}
                    disabled={loadingSlug === pkg.slug}
                    className={cn(
                      'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-lg transition-all duration-200',
                      pkg.highlighted
                        ? 'bg-brand-gold text-brand-navy shadow-brand-gold/25 hover:bg-brand-navy hover:text-white hover:shadow-xl hover:-translate-y-0.5'
                        : 'border border-slate-300 bg-white text-brand-navy hover:border-brand-gold hover:text-brand-gold hover:shadow-md hover:-translate-y-0.5'
                    )}
                  >
                    {loadingSlug === pkg.slug ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {getCtaLabel(pkg)}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={`/contact?service=${pricing.serviceSlug}&package=${pkg.slug}`}
                    className={cn(
                      'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-lg transition-all duration-200',
                      pkg.highlighted
                        ? 'bg-brand-gold text-brand-navy shadow-brand-gold/25 hover:bg-brand-navy hover:text-white hover:shadow-xl hover:-translate-y-0.5'
                        : 'border border-slate-300 bg-white text-brand-navy hover:border-brand-gold hover:text-brand-gold hover:shadow-md hover:-translate-y-0.5'
                    )}
                  >
                    Get a Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Feature comparison table ─────────────────────────────────── */}
        {isWebsites && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                Compare Plans
              </p>
              <h3 className="mt-3 text-2xl font-bold text-brand-navy md:text-3xl">
                Everything included, side by side
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                {/* Table header */}
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="sticky left-0 bg-white px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 min-w-[220px]">
                      Feature
                    </th>
                    {pricing.packages.map((pkg) => (
                      <th
                        key={pkg.slug}
                        className={cn(
                          'px-6 py-5 text-center text-sm font-bold',
                          pkg.highlighted ? 'text-brand-gold' : 'text-brand-navy'
                        )}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {pkg.highlighted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-brand-gold">
                              <Star className="h-2.5 w-2.5 fill-brand-gold" />
                              Popular
                            </span>
                          )}
                          {pkg.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table body */}
                <tbody>
                  {websiteComparisonRows.map((row, idx) => (
                    <tr
                      key={row.label}
                      className={cn(
                        'border-b border-slate-50 transition hover:bg-slate-50/50',
                        row.highlight && 'bg-brand-gold/[0.02]'
                      )}
                    >
                      <td className="sticky left-0 bg-white px-6 py-4 text-sm font-semibold text-brand-navy min-w-[220px] group-hover:bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <span>{row.label}</span>
                          {row.note && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              {row.note}
                            </span>
                          )}
                        </div>
                      </td>
                      {row.values.map((val, vi) => (
                        <td
                          key={vi}
                          className={cn(
                            'px-6 py-4 text-center text-sm',
                            val.startsWith('\u2713')
                              ? 'text-emerald-600 font-medium'
                              : val === '\u2014'
                              ? 'text-slate-300'
                              : val.startsWith('$')
                              ? 'text-brand-navy font-bold'
                              : 'text-slate-600'
                          )}
                        >
                          {val.startsWith('\u2713') ? (
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {val.replace('\u2713 ', '')}
                            </span>
                          ) : val === '\u2014' ? (
                            <Minus className="mx-auto h-4 w-4" />
                          ) : (
                            val
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sticky scroll hint on mobile */}
            <p className="mt-3 text-center text-xs text-slate-400 md:hidden">
              Scroll horizontally to see all plans &rarr;
            </p>
          </div>
        )}

        {isWebsites && (
          <div className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                Need Help Choosing?
              </p>
              <h3 className="mt-3 text-2xl font-bold text-brand-navy">
                Request a call back
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                If you are not sure whether the Basic Website is enough or a custom build makes more sense, request a quick call and we will help you choose the right path.
              </p>
              <Link
                href="/book?service=websites&topic=pricing-callback"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-brand-gold hover:text-brand-navy"
              >
                <Phone className="h-4 w-4" />
                Request a Call Back
              </Link>
            </div>

            <div className="rounded-xl border border-brand-gold/30 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                Build a Custom Quote
              </p>
              <h3 className="mt-3 text-2xl font-bold text-brand-navy">
                Select the features and functions you need
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quoteFeatureOptions.map((feature) => {
                  const selected = selectedQuoteFeatures.includes(feature);
                  return (
                    <label
                      key={feature}
                      className={cn(
                        'flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-semibold transition',
                        selected
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-navy'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-brand-gold/60 hover:text-brand-navy'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleQuoteFeature(feature)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                          selected
                            ? 'border-brand-gold bg-brand-gold text-brand-navy'
                            : 'border-slate-300 text-transparent'
                        )}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      {feature}
                    </label>
                  );
                })}
              </div>
              <Link
                href={quoteHref}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-brand-navy shadow-lg transition hover:bg-brand-navy hover:text-white"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Trust section ────────────────────────────────────────────── */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-8 py-8 shadow-sm">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              What You Can Expect
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-brand-navy">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── "Not Sure Where to Start?" (websites only) ──────────────── */}
        {isWebsites && (
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
              Not Sure Where to Start?
            </p>
            <h3 className="mt-3 text-2xl font-bold text-brand-navy md:text-3xl">
              Find the right fit for your business
            </h3>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pricing.packages.map((pkg) => (
              <div
                key={pkg.slug}
                className={cn(
                  'rounded-xl border p-6 transition-all duration-200',
                  pkg.highlighted
                    ? 'border-brand-gold/30 bg-brand-gold/5 shadow-sm'
                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                )}
              >
                <h4 className="text-base font-bold text-brand-navy">{pkg.name}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {pkg.slug === 'basic-website'
                    ? 'You need a clean, professional website with up to 7 pages and Sanity CMS.'
                    : 'You need premium design, higher features, integrations, or custom functionality.'}
                </p>
                {pkg.slug === 'custom-website' ? (
                  <Link
                    href="/book?service=websites&topic=custom-website-callback"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-brand-gold transition hover:text-brand-navy"
                  >
                    Request a Call Back
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <button
                    onClick={() => openCheckout(pkg)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-brand-navy transition hover:text-brand-gold"
                  >
                    Choose {pkg.name}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* ── AI Add-ons section ───────────────────────────────────────── */}
        {aiAddonPackages && aiAddonPackages.length > 0 && (
          <div className="mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-brand-navy/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy/60">
                <Sparkles className="h-3 w-3" />
                Optional Add-ons
              </p>
              <h3 className="mt-5 text-2xl font-bold text-brand-navy md:text-3xl">
                AI Automation Add-ons
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Supercharge your website with AI-powered tools that capture, qualify, and convert leads
                \u2014 even while you sleep.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {aiAddonPackages.map((pkg) => (
                <div
                  key={pkg.slug}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-navy/20 hover:shadow-lg"
                >
                  <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-brand-gold/5 blur-2xl transition group-hover:bg-brand-gold/10" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy to-brand-navy/80 text-brand-gold shadow-md">
                      {pkg.slug === 'ai-receptionist' ? (
                        <Phone className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-brand-navy">{pkg.name}</h4>
                      {pkg.subtitle && (
                        <p className="mt-1 text-sm leading-5 text-slate-500">{pkg.subtitle}</p>
                      )}

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-brand-navy">
                          ${pkg.oneTimePrice}
                        </span>
                        <span className="text-xs text-slate-400">setup</span>
                        {pkg.monthlyPrice > 0 && (
                          <>
                            <span className="text-slate-300">+</span>
                            <span className="text-2xl font-extrabold text-brand-navy">
                              ${pkg.monthlyPrice}
                            </span>
                            <span className="text-xs text-slate-400">/mo</span>
                          </>
                        )}
                      </div>

                      <ul className="mt-4 space-y-2">
                        {pkg.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm leading-5 text-slate-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => openCheckout(pkg)}
                        disabled={loadingSlug === pkg.slug}
                        className={cn(
                          'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-brand-navy/20 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-brand-navy transition hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy',
                          loadingSlug === pkg.slug ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                      >
                        {loadingSlug === pkg.slug ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Add to My Plan
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              AI add-ons work with any website plan. You can add them at any time.
            </p>
          </div>
        )}

        {/* ── FAQ Accordion ────────────────────────────────────────────── */}
        <div className="mt-20 mx-auto max-w-3xl">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </p>
            <h3 className="mt-3 text-2xl font-bold text-brand-navy md:text-3xl">
              Everything you need to know
            </h3>
          </div>

          <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {pricingFaq.map((item, idx) => (
              <div key={idx} className="group">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-50"
                >
                  <span className="text-sm font-bold text-brand-navy transition group-hover:text-brand-gold">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      'ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-sm transition-all duration-200',
                      openFaq === idx
                        ? 'border-brand-gold bg-brand-gold text-white rotate-45'
                        : 'text-slate-400'
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-7 text-slate-500">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Consultation CTA ─────────────────────────────────────────── */}
        <div className="mt-16 mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-brand-navy">Still have questions?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Not sure which plan fits your business? Book a free 15-minute strategy call \u2014
              we will help you decide with zero pressure.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-gold hover:text-brand-navy"
              >
                Book a Free Strategy Call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-3.5 text-sm font-bold text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
              >
                <MessageSquare className="h-4 w-4" />
                Send a Message
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs leading-6 text-slate-400">
          Secure payment processed by Stripe. Your payment information is encrypted and never stored
          on our servers. All AI add-ons can be purchased standalone or added to any website plan.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CHECKOUT MODAL
         ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-brand-navy">
              Complete Purchase
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {selectedPkg && (
                <>
                  Purchasing <strong className="text-brand-navy">{selectedPkg.name}</strong>
                  {' \u2014 '}${selectedPkg.oneTimePrice.toLocaleString()} setup
                  {selectedPkg.monthlyPrice > 0 &&
                    ` + $${selectedPkg.monthlyPrice}/mo`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                <User className="mr-1 inline-block h-3 w-3" />
                Your Name
              </label>
              <input
                type="text"
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                placeholder="John Smith"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-300 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                <Mail className="mr-1 inline-block h-3 w-3" />
                Email Address
              </label>
              <input
                type="email"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-300 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Your receipt and project updates will be sent here.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={loadingSlug !== null}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy shadow-lg transition hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingSlug !== null ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </button>

            <p className="text-center text-[10px] leading-relaxed text-slate-400">
              Secure checkout powered by Stripe. Your payment info is encrypted.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
