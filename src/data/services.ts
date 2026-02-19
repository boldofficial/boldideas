import { LucideIcon } from 'lucide-react';

export interface ServiceDetail {
    title: string;
    description: string;
}

export interface Service {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    intro: string;
    description: string;
    iconName: 'cpu' | 'workflow' | 'trending-up' | 'monitor-smartphone';
    heroImage: string;
    whoItIsFor: string[];
    coreFeatures: ServiceDetail[];
    benefits: string[];
}

export const services: Service[] = [
    {
        id: '01',
        slug: 'ai-productivity-training',
        title: 'AI Productivity Training',
        subtitle: 'Master the Future of Work',
        intro: 'Hands-on AI training designed for solopreneurs and small teams to automate daily tasks and boost productivity immediately.',
        description: 'Give your workforce the competitive edge with our AI productivity training programs. We provide hands-on, practical sessions that transform how your team works with technology.',
        iconName: 'cpu',
        heroImage: '/services_hero_strategic_v3.png',
        whoItIsFor: [
            'Solopreneurs looking to scale themselves',
            'Small teams overwhelmed by manual admin',
            'Business owners wanting to future-proof their operations'
        ],
        coreFeatures: [
            {
                title: 'Daily Workflow Mastery',
                description: 'Learn to use AI tools for emails, scheduling, and document creation.'
            },
            {
                title: 'Custom Prompt Engineering',
                description: 'We build custom prompts tailored to your specific business niche.'
            },
            {
                title: 'Tool Selection Strategy',
                description: 'Identifying the exact tools that provide the highest ROI for your needs.'
            }
        ],
        benefits: [
            'Master AI tools for daily workflows',
            'Reduce repetitive tasks and save hours weekly',
            'Equip your team with skills for the future of work'
        ]
    },
    {
        id: '02',
        slug: 'ai-workflow-automation',
        title: 'AI Workflow Automation',
        subtitle: 'Efficiency at Scale',
        intro: 'We design simple AI-powered workflows that reduce repetitive tasks and free up your time for growth.',
        description: 'Manual processes are costly and error-prone. With our AI-powered workflow automation services, we analyze your operations and build autonomous systems that handle the heavy lifting.',
        iconName: 'workflow',
        heroImage: '/services_hero_strategic_v3.png',
        whoItIsFor: [
            'Businesses with repetitive data entry tasks',
            'Operations teams looking to reduce errors',
            'Fast-growing startups needing scalable systems'
        ],
        coreFeatures: [
            {
                title: 'End-to-End Automation',
                description: 'Connecting your apps (CRM, Email, Sheets) into a single flow.'
            },
            {
                title: 'AI Decision Logic',
                description: 'Implementing AI to categorize, filter, and respond to triggers.'
            },
            {
                title: 'Continuous Monitoring',
                description: 'Real-time tracking of automated flows to ensure zero downtime.'
            }
        ],
        benefits: [
            'Eliminate repetitive, manual tasks',
            'Improve efficiency and reduce operational costs',
            'Scale your business without scaling overhead'
        ]
    },
    {
        id: '03',
        slug: 'ai-marketing-systems',
        title: 'AI-Powered Marketing',
        subtitle: 'Smart Growth Engine',
        intro: 'From SEO to automated follow-ups, we build marketing systems that help you generate leads sustainably.',
        description: 'Fuel your marketing with a growth engine driven by AI. We use machine learning to supercharge your campaigns, ensuring you reach the right audience at the right time.',
        iconName: 'trending-up',
        heroImage: '/services_hero_strategic_v3.png',
        whoItIsFor: [
            'Direct-to-consumer businesses',
            'Service providers needing consistent lead gen',
            'Niche brands looking to dominate search'
        ],
        coreFeatures: [
            {
                title: 'Programmatic SEO',
                description: 'Generating thousands of high-ranking landing pages automatically.'
            },
            {
                title: 'Predictive Targeting',
                description: 'Reaching your most valuable customers before they search for you.'
            },
            {
                title: 'Automated Nurture Flows',
                description: 'AI-driven follow-ups that convert leads while you sleep.'
            }
        ],
        benefits: [
            'Increased organic traffic and visibility',
            'Higher quality leads through smart targeting',
            'Lower ad costs with significantly higher returns'
        ]
    },
    {
        id: '04',
        slug: 'websites-custom-tools',
        title: 'Websites & Custom Tools',
        subtitle: 'Conversion-First Solutions',
        intro: 'Conversion-focused websites and tailored digital tools designed around your business needs.',
        description: 'Your digital presence should be your hardest working employee. We build websites and custom dashboards that aren\'t just beautiful, but are engineered for performance.',
        iconName: 'monitor-smartphone',
        heroImage: '/services_hero_strategic_v3.png',
        whoItIsFor: [
            'Brands needing a high-converting digital home',
            'Businesses requiring custom internal dashboards',
            'Innovators needing bespoke digital tools'
        ],
        coreFeatures: [
            {
                title: 'Conversion Optimization',
                description: 'Every pixel designed to guide users toward your primary goal.'
            },
            {
                title: 'Custom Admin Dashboards',
                description: 'See the data that matters most in a clean, intuitive interface.'
            },
            {
                title: 'High-Performance Tech Stack',
                description: 'Blazing fast load times and impeccable mobile responsiveness.'
            }
        ],
        benefits: [
            'Professional, high-impact brand presence',
            'Clear performance insights at your fingertips',
            'Seamless user experience across all devices'
        ]
    }
];
