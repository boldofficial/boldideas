export interface ServiceDetail {
    title: string;
    description: string;
}

export interface ServicePillar {
    slug: string;
    title: string;
    shortTitle: string;
    subtitle: string;
    intro: string;
    description: string;
    iconName: 'monitor-smartphone' | 'bot' | 'workflow';
    heroImage: string;
    whoItIsFor: string[];
    coreFeatures: ServiceDetail[];
    benefits: string[];
    faq: { question: string; answer: string }[];
}

export const servicePillars: ServicePillar[] = [
  {
    slug: 'websites',
    title: 'Website Development',
    shortTitle: 'Websites',
    subtitle: 'A sharper front door for your business',
    intro: 'Professional websites with clear messaging, fast pages, local trust signals, and lead capture built into every path.',
    description: 'Your website is your most visible business asset. We build conversion-focused websites with clear service pages, local SEO foundations, and custom admin dashboards that help Illinois and Wisconsin small businesses look established and capture better leads.',
    iconName: 'monitor-smartphone',
    heroImage: '/images/bold-ideas-innovations-hero.png',
    whoItIsFor: [
      'Brands that need a high-converting digital presence that reflects their quality',
      'Businesses requiring custom dashboards, client portals, or internal admin panels',
      'Innovators who need bespoke digital tools that off-the-shelf software does not offer',
    ],
    coreFeatures: [
      { title: 'Conversion-Focused Design', description: 'Clear messaging, strategic CTAs, trust signals, and mobile-first layouts engineered to guide visitors toward booking, calling, or inquiring.' },
      { title: 'Custom Admin Dashboards', description: 'Bespoke backend interfaces that consolidate CRM, project tracking, reporting, and team management into one clean command center.' },
      { title: 'Client Portals', description: 'Secure, branded portals where clients can view project status, share files, review invoices, and communicate — reducing email back-and-forth.' },
      { title: 'Local SEO Foundations', description: 'Optimized page structures, location signals, and metadata that help your business show up in local search and AI overviews.' },
    ],
    benefits: [
      'A professional, high-impact brand presence that converts more visitors into customers',
      'Clear performance insights and operational control through custom dashboards',
      'Seamless user experience across every device, every browser, every time',
      'Custom tools that eliminate the need for 3–5 disconnected software subscriptions',
    ],
    faq: [
      { question: 'How long does it take to build a website?', answer: 'A standard website takes 2–3 weeks from kickoff to launch. More complex projects with custom dashboards or client portals may take 4–6 weeks. We scope each engagement clearly before starting.' },
      { question: 'Can you redesign my existing website?', answer: 'Yes. We can work with your current domain, hosting, and tools — redesigning the visual direction, improving the information architecture, and adding conversion elements without rebuilding from scratch.' },
      { question: 'Do you build e-commerce websites?', answer: 'Yes. We build e-commerce sites on high-performance platforms with product catalogs, checkout flows, inventory management, and payment processing integrated.' },
      { question: 'Will my website work on mobile devices?', answer: 'Every site we build is mobile-first. We design and test across phones, tablets, and desktops to ensure a consistent experience regardless of how your customers browse.' },
    ],
  },
  {
    slug: 'ai-agents',
    title: 'AI Agents',
    shortTitle: 'AI Agents',
    subtitle: 'Helpful automation customers can feel',
    intro: 'AI assistants that answer common questions, qualify leads, collect details, and route requests before your team touches them.',
    description: 'Stop losing leads after hours. Our AI agents handle website chat, sales intake, and support triage — answering FAQs, qualifying prospects, and routing hot leads straight to your team. Combined with AI productivity training, your team learns to work faster with the latest AI tools.',
    iconName: 'bot',
    heroImage: '/images/bold-ideas-innovations-hero.png',
    whoItIsFor: [
      'Service providers who depend on consistent lead flow from their website',
      'Small teams overwhelmed by repetitive questions and manual follow-up',
      'Business owners who want practical AI skills, not theory or hype',
    ],
    coreFeatures: [
      { title: 'AI Website Chat & Intake', description: 'Website assistants that answer FAQs, qualify leads, collect contact details, and route requests — so your team only touches qualified opportunities.' },
      { title: 'Lead Qualification & Scoring', description: 'AI that asks qualifying questions, scores leads by intent, and routes hot prospects to your calendar — all before your team gets involved.' },
      { title: 'AI Productivity Training', description: 'Hands-on sessions for email triage, calendar management, document drafting, and research using the latest AI tools. Your team saves 10+ hours per week.' },
      { title: 'Custom Prompt Libraries', description: 'We build and test custom prompts tailored to your industry, voice, and recurring tasks so your AI output is useful, not generic.' },
    ],
    benefits: [
      'Capture and qualify leads 24/7 — even when your team is busy serving customers',
      'Reduce response time from hours to seconds, improving conversion rates',
      'Equip your team with durable AI skills that compound over time',
      'Reduce repetitive administrative tasks and reclaim hours every week',
    ],
    faq: [
      { question: 'How is an AI agent different from a chatbot?', answer: 'A basic chatbot follows scripted rules. Our AI agents use large language models to understand context, answer nuanced questions, qualify leads, and route conversations intelligently — they learn and improve over time.' },
      { question: 'Can the AI agent book meetings directly?', answer: 'Yes. The agent can check availability, schedule appointments, send calendar invites, and confirm bookings — all without your team touching the process.' },
      { question: 'Do I need technical skills to manage the AI agent?', answer: 'No. We set up, train, and monitor the agent for you. You review lead summaries and transcripts in a simple dashboard. We handle the technical side.' },
      { question: 'Can the AI agent integrate with my existing CRM?', answer: 'Yes. The agent connects with your CRM, email, and calendar tools to create leads, log conversations, and trigger follow-up sequences automatically.' },
    ],
  },
  {
    slug: 'workflow-automation',
    title: 'Workflow Automation',
    shortTitle: 'Automation',
    subtitle: 'Connected tools behind the scenes',
    intro: 'Workflows that connect forms, inboxes, calendars, CRMs, documents, and reports so follow-up does not fall through.',
    description: 'Your website, CRM, inbox, and calendar should work as one system. We build connected automations for form submissions, lead routing, booking updates, pipeline stages, task creation, document generation, and performance reporting — so your team focuses on customers, not data entry.',
    iconName: 'workflow',
    heroImage: '/images/bold-ideas-innovations-hero.png',
    whoItIsFor: [
      'Businesses where staff manually copy data from forms into spreadsheets or CRMs',
      'Operations teams that want to reduce human error in order intake, invoicing, and routing',
      'Growing companies that need scalable systems before headcount catches up',
    ],
    coreFeatures: [
      { title: 'CRM & Lead Routing', description: 'New leads are automatically created in your CRM, tagged by source and intent, and assigned to the right team member or pipeline stage.' },
      { title: 'Smart Follow-Up Sequences', description: 'AI-triggered email and SMS sequences that respond based on lead behavior — booking a call, downloading a guide, or going quiet after a quote.' },
      { title: 'Invoice & Payment Nudges', description: 'Automated reminders for upcoming and overdue invoices, with payment confirmation and receipt delivery — no awkward manual follow-up.' },
      { title: 'Real-Time Dashboard & Alerts', description: 'Dashboard that tracks every automated flow, alerts you to failures, and provides weekly summaries of time saved and leads processed.' },
    ],
    benefits: [
      'Eliminate repetitive manual tasks that drain team productivity',
      'Reduce speed-to-lead from hours to seconds, improving conversion rates',
      'Scale your operations without proportionally scaling overhead or headcount',
      'Improve data accuracy by removing manual entry errors from your systems',
    ],
    faq: [
      { question: 'What tools can you connect?', answer: 'We connect CRMs (HubSpot, Salesforce, Pipedrive), email (Gmail, Outlook), calendars (Google, Office 365), payment processors (Stripe, Square), form builders, and more. If it has an API, we can connect it.' },
      { question: 'How long does automation setup take?', answer: 'Simple automations take a few days. Full CRM integrations with multi-step workflows typically take 1–2 weeks, including testing and team training.' },
      { question: 'What if I already use a CRM or automation tool?', answer: 'We work with your existing stack — enhancing automations within your current tools or connecting them to fill gaps. We do not force you to replace tools that are working.' },
      { question: 'Can you automate invoice and payment processes?', answer: 'Yes. We set up automated invoice generation, payment reminders, receipt delivery, and reconciliation tracking — reducing admin time and improving cash flow.' },
    ],
  },
];
