import Link from 'next/link';
import PricingSection from '@/components/PricingSection';
import { aiAddonPackages, getPricingForService } from '@/data/pricing';

export const metadata = {
  title: 'Website Pricing | Bold Ideas',
  description:
    'Website development pricing for Bold Ideas, including Basic Website and custom website quote options.',
};

export default function PricingPage() {
  const pricing = getPricingForService('websites');

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy pt-32 pb-14 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.16),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.16),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

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
              Pricing
            </span>
          </nav>

          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
              Website Pricing
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              Choose a simple website package or build a custom quote.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Start with a Basic Website at $795, or select the features you need for a premium custom build.
            </p>
          </div>
        </div>
      </section>

      {pricing && <PricingSection pricing={pricing} aiAddonPackages={aiAddonPackages} />}
    </main>
  );
}
