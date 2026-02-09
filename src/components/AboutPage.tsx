import React from 'react';
import AboutHero from './about/AboutHero';
import AboutProblemSolution from './about/AboutProblemSolution';
import AboutServices from './about/AboutServices';
import AboutTargetAudience from './about/AboutTargetAudience';
import AboutApproach from './about/AboutApproach';
import AboutWhyBold from './about/AboutWhyBold';

const AboutPage: React.FC = () => {
	return (
		<div className="pt-12 overflow-hidden bg-brand-light relative">
			{/* Background Schematic Grid & Ghost Imagery */}
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,45,91,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,45,91,1) 1px, transparent 1px)',
					backgroundSize: '60px 60px',
				}}></div>
			<div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none mix-blend-multiply overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000"
					alt=""
					className="w-full h-full object-cover grayscale scale-110"
				/>
			</div>

			<AboutHero />
			<AboutProblemSolution />
			<AboutServices />
			<AboutTargetAudience />
			<AboutApproach />
			<AboutWhyBold />
		</div>
	);
};

export default AboutPage;
