import React from 'react';
import LegalPage from '@/components/shared/LegalPage';

export default function TermsOfService() {
  const content = [
    {
      title: "Service Engagement",
      text: "Bold Ideas Innovations Ltd provides professional AI implementation, productivity training, and digital growth services. By engaging with our systems or booking a 'Strategy Session', you agree to comply with our operational protocols."
    },
    {
      title: "Capacity Building & Training",
      text: [
        "Our flagship hands-on AI productivity training is designed to build organizational capacity.",
        "Bold Ideas provides the tools and training, but the successful adoption depends on the client organization's commitment to the training schedule.",
        "Training materials provided are for internal use within the client organization only."
      ]
    },
    {
      title: "System Implementation",
      text: "Custom websites, internal tools, and automation workflows are built to the specifications agreed upon during the 'Design' phase of our approach. We ensure all systems are scalable, secure, and optimized for performance."
    },
    {
      title: "Intellectual Property & Code",
      text: "Unless otherwise specified in a custom service agreement, Bold Ideas Innovations Ltd maintains ownership of the underlying proprietary AI frameworks and deployment logic, while the client retains ownership of their unique organizational data and custom-built front-end assets."
    },
    {
      title: "Limitation of Liability",
      text: "Bold Ideas specializes in practical, implementation-focused AI. While we build for 'Proven ROI' and measurable productivity gains, we are not liable for external fluctuations in AI model performance or third-party digital infrastructure dependencies."
    },
    {
      title: "Governing Law",
      text: "These operational terms are governed by the laws of the Federal Republic of Nigeria, where Bold Ideas Innovations Ltd is registered and headquartered."
    }
  ];

  return (
    <LegalPage 
      title="Terms of Service" 
      subtitle="Operational Protocols" 
      lastUpdated="February 2025" 
      content={content} 
    />
  );
}
