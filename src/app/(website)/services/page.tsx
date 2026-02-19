import React from 'react';
import { services } from '@/data/services';
import ServicesHero from '@/components/services/ServicesHero';
import ServiceSection from '@/components/services/ServiceSection';
import CTA from '@/components/CTA';

const ServicesPage: React.FC = () => {
    return (
        <div className="bg-[#F1F3F9] min-h-screen">
            <ServicesHero />
            
            <div className="flex flex-col">
                {services.map((service, index) => (
                    <ServiceSection 
                        key={service.id} 
                        service={service} 
                        isEven={index % 2 === 0} 
                    />
                ))}
            </div>

            <CTA />
        </div>
    );
};

export default ServicesPage;
