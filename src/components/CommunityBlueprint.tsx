'use client';

import React, {useState} from 'react';

const CommunityBlueprint: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'audit' | 'build' | 'iter'>(
		'audit'
	);

	const stats = {
		audit: {
			value: 'Deep',
			label: 'Audit',
			detail:
				'We audit your current workflows, data, and marketing to find high-impact AI opportunities.',
			id: 'PHASE_01',
		},
		build: {
			value: 'Launch',
			label: 'Tech Stack',
			detail:
				'We implement the tech stack, set up automations, and launch AI-driven campaigns.',
			id: 'PHASE_02',
		},
		iter: {
			value: '10x',
			label: 'Iteration',
			detail:
				'We track impact, learn from the data, and keep improving your growth engine.',
			id: 'PHASE_03',
		},
	};

	const steps = [
		{
			id: '01',
			title: 'Discover',
			description:
				'We audit your current workflow, apps, and marketing to find high-impact opportunities.',
			status: 'AUDIT',
			icon: '🔍',
		},
		{
			id: '02',
			title: 'Design',
			description:
				'We propose custom automation systems and AI strategies tailored to your specific goals.',
			status: 'PLAN',
			icon: '📐',
			highlight: true,
		},
		{
			id: '03',
			title: 'Build',
			description:
				'We implement the tech stack, set up automations, and launch AI-ad campaigns.',
			status: 'BUILD',
			icon: '🏗️',
		},
		{
			id: '04',
			title: 'Train',
			description:
				'We empower your team with the knowledge they need to run tools effectively.',
			status: 'TRAIN',
			icon: '🧠',
		},
	];

	return (
		<section
			id="process"
			className="py-24 px-4 lg:px-24 bg-white relative overflow-hidden border-t border-brand-navy/5">
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage:
						'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}></div>

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="grid lg:grid-cols-5 gap-12 mb-20 items-center">
					<div className="lg:col-span-3 animate-fade-in relative">
						<div className="absolute -left-6 top-0 bottom-0 w-1 bg-brand-gold/50 hidden lg:block"></div>

						<p className="text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.4em] text-brand-gold mb-6 pl-2">
							Operational_Protocol
						</p>
						<h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-brand-navy leading-none tracking-tighter mb-8 bg-clip-text">
							We deliver <br />
							<span className="text-brand-gold italic">Data-Driven</span>
							<br />
							Automation & Growth.
						</h2>
						<p className="text-slate-500 mb-8 max-w-sm text-lg font-light font-mono">
							&gt; Simple systems, clear playbooks, and campaigns that compound
							over time.
						</p>
					</div>

					<div className="lg:col-span-2 bg-white border border-brand-navy/10 p-6 shadow-2xl relative rounded-sm">
						{/* Technical Header */}
						<div className="absolute top-0 right-0 p-2">
							<div className="flex space-x-1">
								<div className="w-1 h-1 bg-brand-navy rounded-full"></div>
								<div className="w-1 h-1 bg-brand-navy rounded-full"></div>
							</div>
						</div>

						<div className="flex space-x-6 mb-8 border-b border-brand-navy/5 pb-4 overflow-x-auto no-scrollbar">
							{(['audit', 'build', 'iter'] as const).map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`text-[9px] md:text-[10px] font-mono font-black uppercase tracking-widest whitespace-nowrap transition-all pb-2 relative ${
										activeTab === tab
											? 'text-brand-navy border-b-2 border-brand-gold'
											: 'text-slate-400 hover:text-brand-navy border-b-2 border-transparent'
									}`}>
									{tab === 'audit'
										? 'Step 01'
										: tab === 'build'
										? 'Step 03'
										: 'Step 05'}
								</button>
							))}
						</div>
						<div className="min-h-[100px] animate-fade-in flex flex-col justify-center">
							<div className="text-5xl font-black text-brand-navy mb-2 tracking-tighter">
								{stats[activeTab].value}
							</div>
							<p className="text-brand-gold text-xs md:text-sm font-mono font-bold uppercase tracking-widest mb-2">
								{stats[activeTab].label}
							</p>
							<p className="text-slate-400 text-[10px] md:text-xs leading-relaxed font-mono">
								{stats[activeTab].id}: {stats[activeTab].detail}
							</p>
						</div>
					</div>
				</div>

				<div className="relative">
					{/* Central Line */}
					<div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-navy/10 -translate-x-1/2 hidden lg:block"></div>

					<div className="grid md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-y-24">
						{steps.map((node, index) => (
							<div
								key={node.id}
								className={`relative group ${
									index % 2 !== 0 ? 'md:mt-20' : ''
								}`}>
								{/* Connection Dot */}
								<div
									className={`absolute top-8 ${
										index % 2 === 0
											? 'right-0 translate-x-[calc(50%+24px)]'
											: 'left-0 -translate-x-[calc(50%+24px)]'
									} w-4 h-4 rounded-full border-2 border-brand-navy bg-white hidden lg:block z-20`}>
									<div className="absolute inset-1 bg-brand-navy rounded-full"></div>
								</div>

								{/* Connector Line to Center */}
								<div
									className={`absolute top-10 ${
										index % 2 === 0
											? 'right-0 -mr-6 w-[calc(50%+24px)]'
											: 'left-0 -ml-6 w-[calc(50%+24px)]'
									} h-px bg-brand-navy/10 hidden lg:block`}></div>

								<div
									className={`p-8 border transition-all duration-300 relative ${
										node.highlight
											? 'bg-brand-navy border-brand-navy text-white shadow-2xl'
											: 'bg-white border-brand-navy/10 hover:border-brand-gold'
									} rounded-sm`}>
									{/* Tech Corners */}
									<div
										className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${
											node.highlight
												? 'border-brand-gold'
												: 'border-brand-navy/20'
										}`}></div>
									<div
										className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${
											node.highlight
												? 'border-brand-gold'
												: 'border-brand-navy/20'
										}`}></div>

									<div className="flex justify-between items-start mb-6">
										<span
											className={`text-[10px] md:text-xs font-black font-mono tracking-widest ${
												node.highlight
													? 'text-brand-gold'
													: 'text-brand-navy/30'
											}`}>
											ID_{node.id}
										</span>
										<span
											className={`px-2 py-0.5 rounded-sm text-[8px] md:text-[10px] font-black border tracking-widest ${
												node.highlight
													? 'bg-white/10 text-brand-gold border-white/10'
													: 'bg-slate-50 text-slate-400 border-slate-100'
											}`}>
											{node.status}
										</span>
									</div>
									<div className="flex items-center space-x-5 mb-4">
										<div
											className={`w-14 h-14 flex items-center justify-center text-2xl border ${
												node.highlight
													? 'bg-white/10 border-white/10 text-white'
													: 'bg-brand-light border-brand-navy/5 text-brand-navy'
											} rounded-sm`}>
											{node.icon}
										</div>
										<h3
											className={`text-xl font-black tracking-tight ${
												node.highlight ? 'text-white' : 'text-brand-navy'
											}`}>
											{node.title}
										</h3>
									</div>
									<p
										className={`text-sm font-light leading-relaxed font-mono ${
											node.highlight ? 'text-white/70' : 'text-slate-500'
										}`}>
										{node.description}
									</p>
								</div>
							</div>
						))}
					</div>

					<div className="mt-20 p-8 bg-brand-gold rounded-sm max-w-lg mx-auto text-center border border-brand-navy/20 shadow-2xl relative z-10 group overflow-hidden">
						<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>

						<span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-navy/60 mb-2 block relative z-10">
							The Result
						</span>
						<h4 className="text-3xl font-black text-brand-navy relative z-10">
							05 Measure
						</h4>
						<p className="text-brand-navy/80 text-sm md:text-base mt-2 font-mono relative z-10">
							We analyze performance and optimize loops continuously for
							continuous improvement.
						</p>

						{/* Tech Accents */}
						<div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-brand-navy/40"></div>
						<div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-brand-navy/40"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CommunityBlueprint;
