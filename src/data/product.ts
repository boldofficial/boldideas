export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  heroImage: string;
  mainImage: string;
  whoItIsFor: string[];
  coreFeatures: ProductFeature[];
  customizationOptions: string[];
  deploymentOptions: string[];
  ctaText: string;
  ctaLink: string;
  articleLink?: { title: string; href: string };
}

export const products: Product[] = [
  {
    id: 'ezer',
    slug: 'ezer-home-care-management',
    title: 'Ezer',
    subtitle: 'Home Care Management System',
    intro: 'The administrative backbone for top-tier care agencies. Ezer eliminates paperwork and automates staff coordination to maximize your operational profitability.',
    heroImage: '/services_hero_strategic_v3.png',
    mainImage: '/services_hero_strategic_v3.png',
    whoItIsFor: [
      'Home-care agencies',
      'Assisted living facilities',
      'Private care providers',
      'Healthcare groups'
    ],
    coreFeatures: [
      {
        title: 'Automated Caregiver Scheduling',
        description: 'Real-time synchronization that eliminates conflicts and tracks field performance instantly.'
      },
      {
        title: 'Unified Care Intelligence',
        description: 'Structured digital logs ensuring 100% regulatory compliance and zero record-keeping overhead.'
      },
      {
        title: 'Operational ROI Hub',
        description: 'Centralized dashboards that turn operational data into clear, actionable cost-saving insights.'
      },
      {
        title: 'High-Precision Comms',
        description: 'Integrated internal messaging that keeps supervisors and field staff perfectly aligned 24/7.'
      }
    ],
    customizationOptions: [
      'Regional compliance protocols',
      'Custom therapeutic models',
      'Bespoke reporting structures'
    ],
    deploymentOptions: [
      'Private Enterprise Cloud',
      'White-Label Instance'
    ],
    ctaText: 'Claim Your Free Capacity Audit',
    ctaLink: '/contact',
    articleLink: {
      title: 'How Elite Care Agencies Scale Beyond Manual Tracking',
      href: '/blog/promote-professional-services'
    }
  },
  {
    id: 'school-management',
    slug: 'school-management-system',
    title: 'School Management System',
    subtitle: 'Elite Administration for Competitive Schools',
    intro: 'Stop wasting 30% of your staff hours on manual tracking. Our system automates the complexities of modern school management, from enrollment to graduation.',
    heroImage: '/services_hero_strategic_v3.png',
    mainImage: '/services_hero_strategic_v3.png',
    whoItIsFor: [
      'Private K-12 Academies',
      'International Schools',
      'Multi-Campus Education Groups'
    ],
    coreFeatures: [
      {
        title: 'Instant Result Processing',
        description: 'Automated grading and report generation that removes manual friction and delivers results term-on-term.'
      },
      {
        title: 'Revenue Guard Finance',
        description: 'Simplified fee collection with automated reminders and transparent financial reporting for parents.'
      },
      {
        title: 'Campus Flow Manager',
        description: 'End-to-end enrollment and faculty management that keeps your institution running like clockwork.'
      },
      {
        title: 'Parent Assurance Portal',
        description: 'A dedicated hub for parents to monitor student progress, grades, and school updates securely.'
      }
    ],
    customizationOptions: [
      'Multi-campus infrastructure',
      'Custom grading algorithms',
      'School-specific branding'
    ],
    deploymentOptions: [
      'Licensed Offline Deployment',
      'Managed SaaS Cloud'
    ],
    ctaText: 'Modernize Your School Workflow',
    ctaLink: '/contact'
  },
  {
    id: 'classifieds',
    slug: 'classified-ads-directory-platform',
    title: 'Classified Ads & Directory',
    subtitle: 'Monetize Your Community Ecosystem',
    intro: 'A scalable, premium directory engine designed for regional leaders and industry pioneers. Launch your own marketplace and own the commerce in your niche.',
    heroImage: '/services_hero_strategic_v3.png',
    mainImage: '/services_hero_strategic_v3.png',
    whoItIsFor: [
      'Regional Entrepreneurs',
      'Business Associations',
      'Industrial Niche Market Leaders'
    ],
    coreFeatures: [
      {
        title: 'High-Conversion Ad Engine',
        description: 'Optimized classifieds designed to convert casual traffic into active marketplace participants.'
      },
      {
        title: 'Premium Verified Directory',
        description: 'Build a directory of trusted professionals that serves as a consistent recurring revenue stream.'
      },
      {
        title: 'Multi-Layer Monetization',
        description: 'Ready-to-use revenue tools including featured listings, banner slots, and subscription tiers.'
      },
      {
        title: 'Admin Command Center',
        description: 'Intelligent listing moderation and user-growth analytics to keep your marketplace safe and growing.'
      }
    ],
    customizationOptions: [
      'Niche-specific categories',
      'Custom Payment Gateways',
      'Dynamic membership models'
    ],
    deploymentOptions: [
      'Enterprise Source License',
      'Managed Marketplace Hosting'
    ],
    ctaText: 'Launch Your Regional Marketplace',
    ctaLink: '/contact'
  }
];
