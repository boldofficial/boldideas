export interface PricingPackage {
  name: string;
  slug: string;
  oneTimePrice: number;
  monthlyPrice: number;
  features: string[];
  highlighted?: boolean;
  /** Who this package is best for */
  bestFor?: string[];
  /** Key deliverables the client receives */
  whatYouReceive?: string[];
  /** Estimated delivery timeline */
  timeline?: string;
  /** Short outcome-driven subtitle */
  subtitle?: string;
}

export interface ServicePricing {
  serviceSlug: string;
  serviceTitle: string;
  packages: PricingPackage[];
}

export const pricingData: ServicePricing[] = [
  {
    serviceSlug: 'websites',
    serviceTitle: 'Website Development',
    packages: [
      {
        name: 'Basic Website',
        slug: 'basic-website',
        oneTimePrice: 795,
        monthlyPrice: 0,
        subtitle: 'A clean business website with Sanity CMS',
        timeline: '5-7 Days',
        bestFor: [
          'Small businesses that need a polished online presence',
          'Service providers with straightforward content',
          'Brands that want to edit content without calling a developer',
          'Teams that need clear pages, forms, and mobile-friendly design',
        ],
        whatYouReceive: [
          'Up to 7 professionally structured pages',
          'Sanity CMS setup for simple content editing',
          'Mobile-friendly responsive design',
          'Contact form and call-to-action sections',
          'Basic SEO-ready page structure',
          'Launch support on your hosting or deployment account',
        ],
        features: [
          'Up to 7 pages included',
          'Sanity CMS content editing',
          'Responsive design for mobile, tablet, and desktop',
          'Contact form and basic lead capture',
          'Basic on-page SEO setup',
          'Deployment support',
        ],
      },
      {
        name: 'Custom Website',
        slug: 'custom-website',
        oneTimePrice: 0,
        monthlyPrice: 0,
        highlighted: true,
        subtitle: 'Premium design, custom features, and advanced functionality',
        timeline: 'Scoped after discovery',
        bestFor: [
          'Businesses that need a premium brand experience',
          'Teams that need custom features or integrations',
          'Companies with quote forms, bookings, portals, or dashboards',
          'Brands that want a tailored design instead of a fixed package',
        ],
        whatYouReceive: [
          'Discovery-led project scope and quote',
          'Premium custom visual design',
          'Advanced forms, quote builders, or booking flows',
          'Integrations with CRM, payments, email, or automation tools',
          'Optional dashboards, client portals, and AI-powered features',
          'Launch support and handoff documentation',
        ],
        features: [
          'Premium custom design direction',
          'Advanced features selected around your workflow',
          'Custom forms, quote requests, booking, or payments',
          'CRM, email, analytics, and automation integrations',
          'Optional dashboards, portals, or AI add-ons',
          'Custom quote based on selected features and scope',
        ],
      },
    ],
  },
  {
    serviceSlug: 'ai-agents',
    serviceTitle: 'AI Agents',
    packages: [
      {
        name: 'AI Receptionist',
        slug: 'ai-receptionist',
        oneTimePrice: 495,
        monthlyPrice: 199,
        subtitle: 'Never miss a call \u2014 24/7 AI voice receptionist',
        timeline: '2\u20133 Days',
        features: [
          '24/7 AI voice answering on a forwarded number',
          'Books appointments automatically',
          'Takes messages',
          'Qualifies emergencies',
          'Texts owner each call summary',
          'Vapi-powered',
          'Up to 600 min/mo',
        ],
      },
      {
        name: 'AI Suite',
        slug: 'ai-suite',
        oneTimePrice: 795,
        monthlyPrice: 399,
        highlighted: true,
        subtitle: 'Complete AI automation for your business',
        timeline: '3\u20135 Days',
        features: [
          'AI Receptionist (voice)',
          'Lead Qualifier chatbot',
          'Review Response Agent',
          'Monthly tuning',
          'Monthly performance report',
        ],
      },
    ],
  },
  {
    serviceSlug: 'workflow-automation',
    serviceTitle: 'Workflow Automation',
    packages: [
      {
        name: 'Automation Suite',
        slug: 'automation-suite',
        oneTimePrice: 795,
        monthlyPrice: 399,
        highlighted: true,
        subtitle: 'Connect your tools and automate follow-ups',
        timeline: '5\u20137 Days',
        features: [
          'AI-powered workflow automation setup',
          'CRM integration & lead routing',
          'Smart follow-up sequences',
          'Invoice & payment nudges',
          'Real-time dashboard & alerts',
          'Monthly tuning & optimization',
          'Monthly performance report',
        ],
      },
    ],
  },
];

export function getPricingForService(slug: string): ServicePricing | undefined {
  return pricingData.find((p) => p.serviceSlug === slug);
}

export function getPackageBySlug(slug: string): PricingPackage | undefined {
  for (const service of pricingData) {
    const pkg = service.packages.find((p) => p.slug === slug);
    if (pkg) return pkg;
  }
  return undefined;
}

// Annual prepay = 2 months free (12 months - 2 months free = 10 months)
// Used inline in PricingSection: monthlyPrice * 10

export const aiAddonPackages = pricingData.find((p) => p.serviceSlug === 'ai-agents')?.packages || [];
export const websitePackages = pricingData.find((p) => p.serviceSlug === 'websites')?.packages || [];
export const workflowPackages = pricingData.find((p) => p.serviceSlug === 'workflow-automation')?.packages || [];
