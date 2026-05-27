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
        name: 'Starter Website',
        slug: 'starter-website',
        oneTimePrice: 795,
        monthlyPrice: 0,
        subtitle: 'Get online with a clean, professional presence',
        timeline: '3\u20135 Days',
        bestFor: [
          'Small businesses & startups',
          'Churches & community orgs',
          'Personal brands & freelancers',
          'Anyone who needs a basic online presence',
        ],
        whatYouReceive: [
          'Mobile-friendly website',
          'Fast-loading pages',
          'SEO-ready structure',
          'Contact form',
          'Google indexing setup',
          'Google Business Profile cleanup',
        ],
        features: [
          'Enough pages for services, about, gallery & contact',
          'Let visitors contact you directly from your site',
          'Help customers find your business on Google',
          'Collect reviews with an embedded Google widget',
          'Deployed to your own hosting account',
        ],
      },
      {
        name: 'Business Growth Website',
        slug: 'business-growth-website',
        oneTimePrice: 1195,
        monthlyPrice: 49,
        highlighted: true,
        subtitle: 'For growing businesses that need leads',
        timeline: '5\u20137 Days',
        bestFor: [
          'Businesses that need more leads',
          'Companies building credibility',
          'Growing brands ready to stand out',
          'Service-area businesses',
        ],
        whatYouReceive: [
          'Everything in Starter, plus\u2026',
          'Custom domain & branded email',
          'Full branding & professional styling',
          'Service-area pages for local reach',
          'Photo gallery to showcase your work',
          'Schema markup for rich search results',
        ],
        features: [
          'Your own domain name with professional branding',
          'Custom design that reflects your business',
          'Target customers in the cities you serve',
          'Let prospects discover you with rich Google results',
          'Ongoing updates, monitoring & backups included',
          'Customer support when you need it',
        ],
      },
      {
        name: 'Automated Sales Website',
        slug: 'automated-sales-website',
        oneTimePrice: 2795,
        monthlyPrice: 99,
        subtitle: 'For businesses ready to automate growth',
        timeline: '7\u201314 Days',
        bestFor: [
          'Businesses ready to scale',
          'Automated booking & scheduling',
          'Lead generation & customer acquisition',
          'Content-driven growth',
        ],
        whatYouReceive: [
          'Everything in Business Growth, plus\u2026',
          'Self-edit with a simple content editor',
          'Online booking & scheduling',
          'Blog & lead magnet to capture visitors',
          'Monthly SEO report & content updates',
          'AI-powered lead qualification chatbot',
        ],
        features: [
          'Edit your own content anytime \u2014 no coding needed',
          'Accept bookings directly from your website',
          'Capture and convert visitors into customers',
          'Publish articles that bring in search traffic',
          'See exactly how your site performs each month',
          'Qualify and route leads automatically 24/7',
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
