import React from 'react';
import AboutHero from './about/AboutHero';
import AboutProblemSolution from './about/AboutProblemSolution';
import AboutServices from './about/AboutServices';
import AboutTargetAudience from './about/AboutTargetAudience';
import AboutApproach from './about/AboutApproach';
import AboutWhyBold from './about/AboutWhyBold';

const AboutPage: React.FC = () => {
	return (
		<div className="pb-2j0 overflow-hidden bg-brand-light relative">
			{/* Schematic Grid Background */}
			<div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
				style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
			</div>

			<AboutHero />
			<AboutProblemSolution />
			<AboutTargetAudience />
			<AboutApproach />
			<AboutWhyBold />
		</div>
	);
};

export default AboutPage;
