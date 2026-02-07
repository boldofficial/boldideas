import React from 'react';
import ServicesHero from './services/ServicesHero';
import ServicesList from './services/ServicesList';
import ServicesAdvantage from './services/ServicesAdvantage';

const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 overflow-hidden bg-brand-light relative">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <ServicesHero />
      <ServicesList />
      <ServicesAdvantage />
    </div>
  );
};

export default ServicesPage;

