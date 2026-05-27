'use client';

import React, {useState} from 'react';

const CommunityBlueprint: React.FC = () => {
	const philosophy = [
		{
			title: 'Save Time',
			detail: 'AI should save time, not create confusion. We build systems that automate the repetitive so you can focus on the creative.',
			accent: '01'
		},
		{
			title: 'Support People',
			detail: 'AI is a partner, not a replacement. Our goal is to empower your team, not replace their intuition and talent.',
			accent: '02'
		},
		{
			title: 'Be Practical',
			detail: 'No hype. No wasted tools. We implement ethical, easy-to-adopt AI that delivers measurable results.',
			accent: '03'
		}
	];

	const audiences = [
		'Solopreneurs & consultants',
		'Small business owners',
		'Online businesses & creators',
		'Local service providers',
		'Growing teams and startups'
	];

	const whyUs = [
		'Small-business-first approach',
		'Clear, hands-on training',
		'Practical AI—not buzzwords',
		'Scalable systems for growth',
		'Long-term partnership mindset'
	];

	return (
		<section id="process" className="relative bg-white overflow-hidden">
			
			{/* MURAL 01: THE PHILOSOPHY (Dark Backdrop) */}
			<div className="bg-brand-navy py-16 px-6 lg:px-24 relative overflow-hidden">
				{/* Massive Background Text Decoration */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none uppercase tracking-tighter">
					Philosophy
				</div>

				<div className="max-w-[1440px] mx-auto relative z-10">
					<div className="flex items-center space-x-6 mb-16">
						<div className="w-16 h-[2px] bg-brand-gold"></div>
						<span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-brand-gold">
							Our Foundational Protocol
						</span>
					</div>

					<div className="grid lg:grid-cols-3 gap-16 md:gap-32">
						{philosophy.map((item, idx) => (
							<div key={idx} className="relative">
								<span className="text-brand-gold/20 text-7xl md:text-9xl font-black italic absolute -top-16 -left-8 md:-left-12 pointer-events-none">
									{item.accent}
								</span>
								<h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 relative z-10">
									{item.title}
								</h3>
								<p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-sm">
									{item.detail}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
			</section>
	);


};

export default CommunityBlueprint;
