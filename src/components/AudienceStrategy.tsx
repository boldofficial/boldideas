'use client';

import React from 'react';

const AudienceStrategy: React.FC = () => {
	const audiences = [
		{
			title: 'Solopreneurs & consultants',
			desc: 'Use AI to reclaim hours every week and build simple, scalable digital systems to manage your expertise.'
		},
		{
			title: 'Small business owners',
			desc: 'Systems that save time, reduce stress, and increase revenue through lean digital backbones.'
		},
		{
			title: 'Online businesses & creators',
			desc: 'Improve marketing consistency and reach while staying competitive—without a large team.'
		},
		{
			title: 'Local service providers',
			desc: 'Attract and convert customers consistently using AI-enhanced marketing and follow-up systems.'
		},
		{
			title: 'Growing teams and startups',
			desc: 'Adopt AI in ways that deliver real results—without complexity, hype, or wasted tools.'
		},
		{
			title: 'Medium-Sized Organizations',
			desc: 'Structured AI productivity training and automation looking to responsibly upskill your teams.'
		}
	];

	const whyUs = [
		'Small-business-first approach',
		'Clear, hands-on training',
		'Practical AI—not buzzwords',
		'Scalable systems for growth',
		'Long-term partnership mindset'
	];

	return (
		<>
			{/* MURAL 02: WHO WE SERVE (Strategic Deep Grid Elevation) */}
			<div className="py-12 bg-slate-50 relative overflow-hidden">
				{/* Technical Backdrop */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute inset-0 opacity-[0.05]"
						style={{
							backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)',
							backgroundSize: '100px 100px',
						}}></div>
					<div className="absolute top-0 left-1/2 w-[1px] h-full bg-brand-gold/10 -translate-x-1/2"></div>
				</div>

				<div className="max-w-[1440px] mx-auto relative z-10">
					
					{/* Section Header */}
					<div className="mb-8">
						<div className="flex items-center space-x-4 mb-4">
							<span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
								Built for Founders & Growing Businesses
							</span>
							<div className="w-12 h-[1px] bg-brand-gold/30"></div>
						</div>
						<h2 className="text-5xl md:text-7xl font-black text-brand-navy uppercase tracking-tighter leading-none mb-4">
							Who We <br />
							<span className="text-brand-gold italic">Serve.</span>
						</h2>
						<p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
							We primarily work with those building the future of their communities—from one-person startups to growing organizations.
						</p>
					</div>

					{/* 2-Column Strategic Dossier Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{audiences.map((audience, idx) => (
							<div key={idx} className="group relative">
								{/* Glassmorphic Dossier Card */}
								<div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-10 md:p-12 h-full relative transition-all duration-700 hover:shadow-2xl hover:shadow-brand-gold/5 group-hover:-translate-y-1">
									
									{/* Architectural Corner Marks */}
									<div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-200 group-hover:border-brand-gold/40 transition-colors"></div>
									<div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-200 group-hover:border-brand-gold/40 transition-colors"></div>

									<h3 className="text-xl md:text-2xl font-black text-brand-navy uppercase tracking-tighter mb-6 group-hover:text-brand-gold transition-colors duration-500 min-h-[3.5rem] flex items-center">
										{audience.title}
									</h3>
									
									{/* Gold Hairline Accent */}
									<div className="w-12 h-[1px] bg-slate-200 mb-8 group-hover:w-24 group-hover:bg-brand-gold transition-all duration-700"></div>

									<p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
										{audience.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* MURAL 03: WHY BOLD IDEAS (The Strategic Advantage) */}
			<div className="bg-brand-navy py-16 px-6  relative overflow-hidden">
				{/* Luminous Glow Orbs */}
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
				
				<div className="max-w-[1440px] mx-auto relative z-10">
					<div className="grid lg:grid-cols-12 gap-16 items-start">
						{/* Left: Strategic Hook */}
						<div className="lg:col-span-4 sticky top-12">
							<span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.6em] mb-10 block">
								Our Bold Philosophy
							</span>
							<h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-12">
								Why <br />
								<span className="text-brand-gold italic">Bold Ideas?</span>
							</h2>
							<div className="w-20 h-1 bg-brand-gold mb-12"></div>
							<p className="text-white/30 text-xl font-medium leading-relaxed italic">
								"We don’t overwhelm you with tools. We help you build a smarter way of working."
							</p>
						</div>

						{/* Right: Advantage Grid */}
						<div className="lg:col-span-8 grid md:grid-cols-2 gap-4">
							{whyUs.map((reason, idx) => (
								<div key={idx} className="bg-white/[0.03] border border-white/5 p-10 group hover:border-brand-gold/30 hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden">
									{/* Background Index */}
									<div className="absolute -top-4 -right-4 text-7xl font-black text-white/[0.02] italic select-none group-hover:text-brand-gold/5 transition-colors">
										0{idx + 1}
									</div>

									<div className="flex items-center space-x-6 mb-8">
										<div className="w-10 h-10 rounded-sm border border-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold transition-all duration-500">
											<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-brand-gold group-hover:text-brand-navy" stroke="currentColor" strokeWidth="4">
												<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
										<span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
											Value—{idx + 1}
										</span>
									</div>
									<h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand-gold transition-colors">
										{reason}
									</h3>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AudienceStrategy;
