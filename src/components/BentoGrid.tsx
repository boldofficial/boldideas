'use client';

import React, {useState} from 'react';
import Link from 'next/link';

const BentoGrid: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'strategy' | 'automation' | 'seo'>(
		'strategy'
	);

	const stats = {
		strategy: {
			value: 'Roadmap',
			label: 'AI Strategy',
			detail:
				'A tailored roadmap that prioritizes high-impact AI use cases for your business.',
			id: 'STRAT_01',
		},
		automation: {
			value: 'Seamless',
			label: 'Workflow',
			detail:
				'We identify repetitive tasks and build automations to eliminate manual errors and scale.',
			id: 'AUTO_02',
		},
		seo: {
			value: '1000s',
			label: 'Content Pages',
			detail:
				'Scalable content engines that generate thousands of targeted, AI-optimized landing pages.',
			id: 'SEO_03',
		},
	};

	const services = [
		{
			id: '01',
			title: 'AI Strategy & Consulting',
			description:
				'We help you navigate the AI landscape to select the right tools and strategies.',
			icon: '⚙️',
			status: 'ADVISE',
			position: 'left',
		},
		{
			id: '02',
			title: 'Workflow Automation',
			description:
				'We eliminate manual data entry and repetitive tasks by connecting your apps (e.g. OpenAI, Zapier, Make).',
			icon: '⚡',
			status: 'ACTIVE',
			position: 'right',
			highlight: true,
		},
		{
			id: '03',
			title: 'Programmatic SEO',
			description:
				'We build scalable content engines that generate thousands of targeted landing pages.',
			icon: '🔍',
			status: 'SCALE',
			position: 'left',
		},
		{
			id: '04',
			title: 'Paid Media Automation',
			description:
				'We optimize your ad spend using AI algorithms to target the right audience at the right time.',
			icon: '📈',
			status: 'ADS',
			position: 'right',
		},
		{
			id: '05',
			title: 'AI Chatbots & Agents',
			description:
				'We deploy intelligent customer service agents that work 24/7 to qualify leads and support users.',
			icon: '🤖',
			status: 'AGENT',
			position: 'left',
		},
		{
			id: '06',
			title: 'Data Analytics & Insights',
			description:
				'We turn raw data into actionable dashboards so you can make decisions based on facts, not guesses.',
			icon: '📊',
			status: 'DATA',
			position: 'right',
		},
	];

	return (
		<section
			id="services"
			className="py-24 px-4 lg:px-24 bg-brand-light relative overflow-hidden">
			{/* Schematic Grid Background */}
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage:
						'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}></div>

			<div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] -translate-x-1/2"></div>

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-end">
					<div className="animate-fade-in relative">
						<div className="absolute -left-6 top-2 bottom-2 w-0.5 bg-brand-gold/30 hidden md:block"></div>

						<p className="text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.3em] text-brand-gold mb-6 pl-2">
							System_Capabilities
						</p>
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy leading-none tracking-tighter mb-8 bg-clip-text">
							Intelligent Services
							<br />
							<span className="text-brand-gold italic">for Modern</span>
							<br />
							Business Growth.
						</h2>
						<Link href="/services">
							<button className="bg-brand-navy text-white px-10 py-4 rounded-sm font-black hover:bg-brand-gold hover:text-brand-navy transition-all hover:shadow-xl active:scale-95 shadow-md uppercase tracking-widest text-xs md:text-sm border border-transparent hover:border-brand-navy flex items-center group">
								EXPLORE SERVICES
								<span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
									_&gt;
								</span>
							</button>
						</Link>
					</div>

					<div className="bg-white/50 backdrop-blur-sm border border-brand-navy/10 p-1 rounded-sm shadow-2xl relative">
						{/* Console Header */}
						<div className="bg-brand-navy/5 p-2 flex justify-between items-center border-b border-brand-navy/5 mb-6">
							<div className="flex space-x-2">
								<div className="w-2 h-2 rounded-full bg-brand-navy/20"></div>
								<div className="w-2 h-2 rounded-full bg-brand-navy/20"></div>
							</div>
							<span className="font-mono text-[8px] text-brand-navy/40 uppercase tracking-widest">
								SYS_MONITOR_V2.0
							</span>
						</div>

						<div className="px-6 pb-6">
							<div className="flex space-x-1 mb-8 border-b border-brand-navy/10">
								{(['strategy', 'automation', 'seo'] as const).map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
										className={`text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest px-6 py-2 transition-all relative top-[1px] border-t border-l border-r ${
											activeTab === tab
												? 'bg-white text-brand-navy border-brand-navy/10 border-b-white z-10'
												: 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
										}`}>
										{tab === 'strategy'
											? 'STRATEGY_MOD'
											: tab === 'automation'
											? 'AUTO_MOD'
											: 'SEO_MOD'}
									</button>
								))}
							</div>

							<div className="min-h-[120px] animate-fade-in flex flex-col justify-center relative">
								<div className="absolute top-0 right-0 font-mono text-[9px] text-brand-gold/60">
									{stats[activeTab].id}
								</div>

								<div className="text-5xl font-black text-brand-navy mb-2 tracking-tighter">
									{stats[activeTab].value}
								</div>
								<p className="text-slate-500 text-sm font-light leading-relaxed font-mono">
									&gt; {stats[activeTab].detail}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="relative pt-12 pb-24">
					<div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-navy/10 -translate-x-1/2 hidden lg:block dashed-line"></div>

					<div className="flex flex-col space-y-24 lg:space-y-32 relative z-10">
						{services.map((node) => (
							<div
								key={node.id}
								className={`flex flex-col lg:flex-row items-center w-full group ${
									node.position === 'right'
										? 'lg:flex-row'
										: 'lg:flex-row-reverse'
								}`}>
								{/* Content Side */}
								<div
									className={`w-full lg:w-[45%] ${
										node.position === 'right' ? 'text-left' : 'text-right'
									}`}>
									<div
										className={`inline-flex items-center space-x-3 mb-4 ${
											node.position === 'right'
												? 'flex-row'
												: 'flex-row-reverse'
										}`}>
										<span className="text-xs font-black text-brand-navy/20 font-mono">
											CODE_{node.id}
										</span>
										<span
											className={`px-2 py-0.5 rounded-sm text-[8px] md:text-[10px] font-mono font-black border tracking-widest ${
												node.highlight
													? 'bg-brand-navy text-brand-gold border-brand-navy'
													: 'bg-white text-slate-400 border-slate-200'
											}`}>
											STATUS: {node.status}
										</span>
									</div>
									<h3 className="text-2xl md:text-3xl font-black text-brand-navy mb-3 group-hover:text-brand-gold transition-colors">
										{node.title}
									</h3>
									<p
										className={`text-sm text-slate-500 font-light max-w-sm font-mono leading-relaxed ${
											node.position === 'right' ? '' : 'ml-auto'
										}`}>
										{node.description}
									</p>
								</div>

								{/* Circuit Connector */}
								<div className="relative w-full lg:w-[10%] flex justify-center py-8 lg:py-0">
									<div
										className={`absolute ${
											node.position === 'right'
												? 'right-1/2 w-[500px]'
												: 'left-1/2 w-[500px]'
										} top-1/2 -translate-y-1/2 h-[1px] bg-brand-navy/10 hidden lg:block`}></div>

									{/* Node Connector Point */}
									<div
										className={`relative w-16 h-16 border border-brand-navy/10 flex items-center justify-center transition-all duration-500 shadow-xl z-20 ${
											node.highlight
												? 'bg-brand-navy scale-110'
												: 'bg-white hover:scale-110'
										} ${
											node.highlight
												? 'rounded-sm'
												: 'rounded-sm rotate-45 group-hover:rotate-0'
										}`}>
										<div
											className={
												node.highlight
													? ''
													: '-rotate-45 group-hover:rotate-0 transition-transform duration-500'
											}>
											<span className="text-2xl">{node.icon}</span>
										</div>

										{/* Technical Markers */}
										<div
											className={`absolute -top-1 -right-1 w-2 h-2 border-t border-r ${
												node.highlight
													? 'border-brand-gold'
													: 'border-brand-navy/20'
											}`}></div>
										<div
											className={`absolute -bottom-1 -left-1 w-2 h-2 border-b border-l ${
												node.highlight
													? 'border-brand-gold'
													: 'border-brand-navy/20'
											}`}></div>
									</div>
								</div>

								<div className="hidden lg:block w-[45%]"></div>
							</div>
						))}
					</div>
				</div>
			</div>

			<style>{`
        .dashed-line {
            background-image: linear-gradient(to bottom, #002D5B 50%, transparent 50%);
            background-size: 1px 10px;
            background-repeat: repeat-y;
        }
      `}</style>
		</section>
	);
};

export default BentoGrid;
