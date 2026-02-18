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
    intro: 'Ezer is a complete internal management platform designed for care homes, assisted living facilities, and home-care agencies. It simplifies operations, improves staff coordination, and enhances client management — all from one centralized system.',
    heroImage: '/services_hero_strategic_v3.png',
    mainImage: '/services_hero_strategic_v3.png', // Placeholder, using hero image for now
    whoItIsFor: [
      'Home-care agencies',
      'Assisted living facilities',
      'Private care providers',
      'Community-based care organizations'
    ],
    coreFeatures: [
      {
        title: 'Staff & Caregiver Management',
        description: 'Manage caregivers, assign roles, track schedules, and monitor performance in one secure dashboard.'
      },
      {
        title: 'Client & Patient Tracking',
        description: 'Maintain detailed care records, notes, progress updates, and service logs with structured reporting.'
      },
      {
        title: 'Operational Dashboards',
        description: 'Get real-time visibility into daily operations, staffing levels, and performance metrics.'
      },
      {
        title: 'Internal Communication Tools',
        description: 'Enable structured communication between supervisors, caregivers, and administrators.'
      },
      {
        title: 'Secure Data Management',
        description: 'Built with privacy and data protection in mind.'
      }
    ],
    customizationOptions: [
      'Your care model',
      'Your regulatory requirements',
      'Your reporting structure',
      'Your branding and workflows'
    ],
    deploymentOptions: [
      'Hosted SaaS model',
      'Dedicated deployment for your organization',
      'Full white-label customization'
    ],
    ctaText: 'Book A Free Consultation For Your Firm',
    ctaLink: '/contact',
    articleLink: {
      title: 'Read our article on 5 ways to promote professional services firms in Nigeria',
      href: '/blog/promote-professional-services'
    }
  },
  {
    id: 'school-management',
    slug: 'school-management-system',
    title: 'School Management System',
    subtitle: 'Smart Administration for Modern Schools',
    intro: 'Our School Management System is a comprehensive digital platform built to streamline academic, administrative, and financial operations for schools. It replaces manual processes with efficient, structured digital workflows.',
    heroImage: '/services_hero_strategic_v3.png',
    mainImage: '/services_hero_strategic_v3.png',
    whoItIsFor: [
      'Private primary & secondary schools',
      'Faith-based institutions',
      'Growing education centers',
      'Multi-campus institutions'
    ],
    coreFeatures: [
      {
        title: 'Student Information Management',
        description: 'Centralized student records, enrollment tracking, academic history, and profile management.'
      },
      {
        title: 'Academic & Result Management',
        description: 'Digital report cards, grading systems, subject tracking, and term performance analytics.'
      },
      {
        title: 'Staff & Faculty Management',
        description: 'Role-based access, teacher records, class assignments, and internal coordination tools.'
      },
      {
        title: 'Finance & Fee Tracking',
        description: 'Invoice generation, payment records, outstanding balances, and financial reporting.'
      },
      {
        title: 'Parent & Communication Portal',
        description: 'Secure access for parents to monitor student progress and receive school updates.'
      }
    ],
    customizationOptions: [
      'Multi-tenancy (manage multiple schools under one system)',
      'Custom grading systems',
      'AI-ready integration for future upgrades',
      'Custom branding & domain setup'
    ],
    deploymentOptions: [
      'SaaS subscription model',
      'One-time licensed deployment',
      'Fully customized school-specific installation'
    ],
    ctaText: 'Request a Demo for Your School',
    ctaLink: '/contact'
  },
  {
    id: 'classifieds',
    slug: 'classified-ads-directory-platform',
    title: 'Classified Ads & Directory',
    subtitle: 'Launch Your Own Digital Marketplace',
    intro: 'This solution is a scalable classifieds and business listing platform designed for communities, regions, associations, or niche industries. It allows you to build and monetize your own marketplace ecosystem.',
    heroImage: '/services_hero_strategic_v3.png',
    mainImage: '/services_hero_strategic_v3.png',
    whoItIsFor: [
      'Community leaders',
      'Regional entrepreneurs',
      'Business associations',
      'Industry-specific marketplaces',
      'Event organizers'
    ],
    coreFeatures: [
      {
        title: 'Classified Listings',
        description: 'Buy & sell products and services within a structured, searchable system.'
      },
      {
        title: 'Business Directory',
        description: 'Allow verified businesses to create professional listing profiles.'
      },
      {
        title: 'Event Management',
        description: 'Promote community events with structured event pages and visibility tools.'
      },
      {
        title: 'Monetization Tools',
        description: 'Paid listings, featured promotions, banner placements, and subscription tiers.'
      },
      {
        title: 'Admin Dashboard',
        description: 'Full control over listings, approvals, categories, and content moderation.'
      }
    ],
    customizationOptions: [
      'Localized branding',
      'Custom categories & industries',
      'Payment gateway integration',
      'Custom domain & hosting',
      'Feature expansion (membership tiers, ads, analytics)'
    ],
    deploymentOptions: [
      'Fully customized deployment',
      'SaaS model available',
      'White-label options'
    ],
    ctaText: 'Start Your Marketplace Today',
    ctaLink: '/contact'
  },
  // // Placeholder for existing services until detailed content is provided
  // {
  //   id: 'training',
  //   slug: 'ai-productivity-training',
  //   title: 'AI Productivity Training',
  //   subtitle: 'Master the tools that multiply your output',
  //   intro: 'We teach your team how to leverage AI to work smarter, not harder. Master the tools that multiply your output.',
  //   heroImage: '/services_hero_strategic_v3.png',
  //   mainImage: '/services_hero_strategic_v3.png',
  //   whoItIsFor: ['Solopreneurs', 'Small Teams', 'Corporate Departments'],
  //   coreFeatures: [
  //     { title: 'Hands-on Workshops', description: 'Practical training on real-world AI tools.' },
  //     { title: 'Custom Curriculum', description: 'Tailored to your specific industry and needs.' }
  //   ],
  //   customizationOptions: ['Team size', 'Industry focus'],
  //   deploymentOptions: ['On-site training', 'Remote workshops'],
  //   ctaText: 'Book A Training Session',
  //   ctaLink: '/contact'
  // },
  // {
  //   id: 'automation',
  //   slug: 'ai-workflow-automation',
  //   title: 'AI Workflow Automation',
  //   subtitle: 'Streamline your operations with intelligent automation',
  //   intro: 'We build systems that handle the busy work so you can focus on growth. Streamline your operations with intelligent automation.',
  //   heroImage: '/services_hero_strategic_v3.png',
  //   mainImage: '/services_hero_strategic_v3.png',
  //   whoItIsFor: ['Growing Businesses', 'Tech-forward Startups'],
  //   coreFeatures: [{ title: 'Process Audit', description: 'We identify bottlenecks in your current workflow.' }],
  //   customizationOptions: ['Integration with existing tools'],
  //   deploymentOptions: ['Cloud-based automation', 'Local server integration'],
  //   ctaText: 'Optimize Your Workflow',
  //   ctaLink: '/contact'
  // },
  // {
  //   id: 'marketing',
  //   slug: 'ai-powered-marketing-systems',
  //   title: 'AI-Powered Marketing Systems',
  //   subtitle: 'Revolutionize your marketing with AI',
  //   intro: 'From content creation to lead generation, our systems drive results at scale. Revolutionize your marketing with AI.',
  //   heroImage: '/services_hero_strategic_v3.png',
  //   mainImage: '/services_hero_strategic_v3.png',
  //   whoItIsFor: ['Marketing Agencies', 'Business Owners'],
  //   coreFeatures: [{ title: 'Content Generation', description: 'Automated high-quality content for all channels.' }],
  //   customizationOptions: ['Brand voice alignment'],
  //   deploymentOptions: ['SaaS model', 'Custom marketing stack'],
  //   ctaText: 'Scale Your Marketing',
  //   ctaLink: '/contact'
  // },
  // {
  //   id: 'tools',
  //   slug: 'websites-and-custom-tools',
  //   title: 'Websites & Custom Tools',
  //   subtitle: 'High-performance websites and bespoke digital tools',
  //   intro: 'Get high-performance websites and bespoke digital tools tailored to your business needs and driven by innovation.',
  //   heroImage: '/services_hero_strategic_v3.png',
  //   mainImage: '/services_hero_strategic_v3.png',
  //   whoItIsFor: ['Entrepreneurs', 'Established Businesses'],
  //   coreFeatures: [{ title: 'Responsive Design', description: 'Optimized for all devices and platforms.' }],
  //   customizationOptions: ['Custom features', 'Full design control'],
  //   deploymentOptions: ['Managed hosting', 'Client-owned infrastructure'],
  //   ctaText: 'Build Your Tool',
  //   ctaLink: '/contact'
  // }
];
