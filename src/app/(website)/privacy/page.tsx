import React from 'react';
import LegalPage from '@/components/shared/LegalPage';

export default function PrivacyPolicy() {
  const content = [
    {
      title: "Data Collection Protocols",
      text: "Bold Ideas Innovations Ltd collects minimal necessary data to provide our AI implementation and digital transformation services. This includes contact information provided during consultations and technical metadata required for system optimization."
    },
    {
      title: "AI Interaction & Security",
      text: [
        "All AI interactions and organizational data processed through our custom deployments are handled with high-level security protocols.",
        "We do not use client-specific data or internal organizational inputs to train global or public AI models without explicit authorized consent.",
        "Data encryption and secure API architectures are implemented as standard in all our digital infrastructure projects."
      ]
    },
    {
      title: "Utilization of Information",
      text: "Information gathered is used exclusively to: (1) Deliver hands-on AI productivity training, (2) Optimize custom automation workflows, (3) Improve digital marketing performance, and (4) Provide technical support for deployed internal tools."
    },
    {
      title: "Safe & Ethical AI Standards",
      text: "Our agency adheres to strict ethical AI standards. We ensure that every 'Intelligent Growth Protocol' we deploy respects user privacy, data integrity, and organizational transparency as outlined in our core operational principles."
    },
    {
      title: "Third-Party Units",
      text: "We leverage a validated stack of industry-leading partners (including OpenAI, Zapier, and HubSpot). While we manage the implementation, data processed through these platforms is also subject to their respective security and privacy protocols."
    },
    {
      title: "Contact Directives",
      text: "For queries regarding data handling or privacy architecture, contact our Comms Unit at info@getboldideas.com."
    }
  ];

  return (
    <LegalPage 
      title="Privacy Policy" 
      subtitle="Data Privacy Architecture" 
      lastUpdated="February 2025" 
      content={content} 
    />
  );
}
