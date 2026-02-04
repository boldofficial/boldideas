import React from 'react';

const AboutPage: React.FC = () => {
	return (
		<div className="pt-24 pb-20 overflow-hidden bg-brand-light relative">
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

			{/* Hero: Corporate Strategic Identity */}
			<section className="relative min-h-[75vh] flex items-center px-6 lg:px-24 py-24 overflow-hidden bg-brand-navy">
				{/* Background Image: Strategic AI Masterclass */}
				<div className="absolute inset-0 z-0">
					<img 
						src="/images/corporate_hero.png" 
						alt="Strategic AI Masterclass" 
						className="w-full h-full object-cover opacity-50 contrast-125 transition-transform duration-[15s] hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/70 to-brand-navy/30"></div>
				</div>

				<div className="max-w-[1440px] mx-auto relative z-10 w-full">
					<div className="max-w-3xl">
						{/* Subtitle / Strategic Tag */}
						<div className="flex items-center space-x-3 mb-8">
							<div className="w-6 h-[2px] bg-brand-gold"></div>
							<span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
								About Bold Ideas
							</span>
						</div>
						
						{/* Corporate Flagship Heading */}
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight uppercase mb-10">
							<span className="tracking-[0.3em]">Your AI Partner</span> <br />
							<span className="tracking-[0.3em]">For Smarter Work,</span> <br />
							<span className="text-brand-gold italic tracking-[0.3em]">Faster Growth.</span>
						</h1>

						{/* Unified Narrative Block */}
						<div className="relative pl-6 md:pl-10 border-l border-brand-gold/20">
							<p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-medium leading-relaxed mb-8 max-w-xl text-justify">
								We help businesses, institutions, and organizations implement AI, automation, and digital systems that actually work.
							</p>

							<div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 pt-8 border-t border-white/5">
								<div className="max-w-sm">
									<p className="text-white/40 text-[11px] md:text-xs font-medium leading-relaxed italic mb-3">
										Deploying intelligence into real workflows.
									</p>
									<p className="text-white/20 text-[9px] md:text-[10px] leading-relaxed">
										We don’t just talk about AI—we train your teams to use it confidently and unlock measurable productivity.
									</p>
								</div>
								
								{/* Metadata Tag (Condensed) */}
								<div className="pt-2">
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* The Split-System Console: Friction vs Solution */}
			<section className="relative border-y border-brand-navy/5 overflow-hidden">
				<div className="flex flex-col lg:flex-row min-h-[600px]">
					{/* Left: The Friction (The Problem) - Redesigned as System Diagnostic (Slate/Silver Theme) */}
					<div className="flex-1 bg-brand-navy p-10 lg:p-24 relative overflow-hidden group">
						{/* Animated Grid Texture */}
						<div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
							 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
						</div>
						
						{/* Scanning Bar Animation */}
						<div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent h-40 w-full animate-[scan_6s_linear_infinite] pointer-events-none"></div>

						<div className="relative z-10">

							<h2 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tighter leading-none">
								Modern Organizations <br />
								Do Not Fail Because <br />
								<span className="text-white/20 italic underline decoration-white/10">Of Ideas.</span>
							</h2>

							<div className="grid gap-6">
								{[
									{code: 'SYS_01', title: 'DISCONNECTED SILOS', desc: 'Communication flows break between teams and tools.', badge: 'border border-white/20 text-white/60'},
									{code: 'MEM_X1', title: 'MANUAL DEBT', desc: 'Teams spend 60% of their time on repetitive tasks.', badge: 'bg-white/10 text-white font-black'},
									{code: 'SYS_03', title: 'LATENCY LOG', desc: 'Slow decision-making due to fragmented data.', badge: 'border border-white/20 text-white/60'},
								].map((item, i) => (
									<div key={i} className="group/card relative">
										<div className="absolute -inset-2 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity rounded-sm"></div>
										<div className="relative flex items-center space-x-6">
											<div className="flex flex-col items-center">
												<div className="w-1.5 h-1.5 rounded-full bg-white/40 mb-2"></div>
												<div className="w-px h-12 bg-white/10"></div>
											</div>
											<div>
												<div className="flex items-center space-x-3 mb-1">
													{/* <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm tracking-tighter ${item.badge}`}>
														{item.code}
													</span> */}
													<h4 className="font-black text-white text-sm tracking-widest uppercase">
														{item.title}
													</h4>
												</div>
												<p className="text-white/30 text-sm md:text-base font-medium leading-relaxed max-w-sm">
													{item.desc}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right: The Solution (Bold Ideas) */}
					<div className="flex-1 bg-white p-10 lg:p-20 relative overflow-hidden group">
						<div
							className="absolute inset-0 opacity-[0.03]"
							style={{
								backgroundImage: 'radial-gradient(circle, #002D5B 1px, transparent 1px)',
								backgroundSize: '32px 32px',
							}}></div>
						
						<div className="relative z-10">
							<div className="flex items-center space-x-3 mb-8">
								<div className="w-8 h-px bg-brand-gold"></div>
								<span className="text-[10px] sm:text-xs font-mono text-brand-navy/40 tracking-[0.3em] uppercase">
									Output // Bold_Ideas
								</span>
							</div>

							<h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-10 tracking-tight leading-tight">
								We Exist to <br />
								<span className="text-brand-gold italic decoration-brand-gold/30">Connect & Automate.</span>
							</h2>

							<div className="space-y-8 max-w-lg">
								{[
									{tag: 'AUTOMATION', msg: 'Reduce manual work with AI.'},
									{tag: 'INFRASTRUCTURE', msg: 'Build practical growth systems.'},
									{tag: 'CAPACITY', msg: 'Train teams for AI adoption.'},
								].map((item, i) => (
									<div key={i} className="flex items-start space-x-5 group/item border-l border-brand-navy/10 pl-6 py-2">
										<span className="bg-brand-navy/5 text-brand-navy font-black text-[8px] md:text-[9px] px-2 py-0.5 rounded tracking-widest mt-1">
											{item.tag}
										</span>
										<p className="text-slate-500 text-base md:text-lg font-medium group-hover/item:text-brand-navy transition-colors leading-snug">
											{item.msg}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Engineering Schematic: What We Do - Refined Services Console */}
			<section className="py-24 px-6 lg:px-24 relative overflow-hidden bg-white">
				<div className="max-w-5xl mx-auto relative z-10">
					<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-12">
						<div className="max-w-xl mx-auto">
							<h2 className="text-5xl lg:text-6xl font-black text-brand-navy tracking-tighter leading-none mb-6">
								<span className="text-brand-navy tracking-[0.3em]">What We</span> { ' '}
								<span className="text-brand-gold italic">Do.</span>
							</h2>
						</div>
					</div>

					<div className="space-y-6">
						{/* Flagship Module (Full Width) */}
						{[
							{
								id: '01',
								title: 'AI Training',
								desc: 'Hands-on training designed specifically for corporate teams, government agencies, and NGOs. We turn AI-confused staff into AI-confident experts through specialized workflows.',
								highlights: ['On-site Workshops', 'Virtual Live Sessions', 'Executive Briefings'],
								theme: 'navy'
							}
						].map((mod, i) => (
							<div
								key={i}
								className="group relative border border-brand-navy bg-brand-navy text-white transition-all duration-500 overflow-hidden p-8 lg:p-10 shadow-xl rounded-sm">
								
								{/* Corner Marks */}
								<div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold/40 transition-all"></div>
								<div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold/40 transition-all"></div>

								<div className="relative z-10">
									<div className="flex items-center justify-between gap-6 mb-8">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 flex items-center justify-center font-black text-xs border bg-brand-gold text-brand-navy border-brand-gold">
												{mod.id}
											</div>
											<h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight leading-none text-white">
												{mod.title}
											</h3>
										</div>
										<div className="hidden lg:block h-px flex-1 mx-8 bg-white/10"></div>
									</div>

									<div className="grid lg:grid-cols-2 gap-8">
										<div className="space-y-4">
											<p className="text-base font-medium leading-relaxed text-white/70">
												{mod.desc}
											</p>
											<div className="flex flex-wrap gap-2">
												{mod.highlights.map((h, idx) => (
													<span key={idx} className="px-2 py-0.5 text-[8px] font-black tracking-widest uppercase border bg-white/5 border-white/10 text-white/40 group-hover:border-brand-gold transition-colors">
														{h}
													</span>
												))}
											</div>
										</div>

										<div className="flex items-end lg:justify-end">
											<button className="inline-flex items-center space-x-4 py-3 px-6 border bg-brand-gold text-brand-navy border-brand-gold hover:bg-white hover:border-white transition-all">
												<span className="text-[10px] font-black uppercase tracking-[0.3em]">
													Request_Module
												</span>
												<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						))}

						{/* Secondary Modules (3-Column Grid) */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{
									id: '02',
									title: 'Consulting',
									desc: 'Custom workflows designed for your organization. We build AI agents and automated reporting.',
									highlights: ['AI Agents', 'Doc Gen', 'Automation'],
									theme: 'light'
								},
								{
									id: '03',
									title: 'Growth Systems',
									desc: 'Combining AI with marketing strategy to build growth infrastructure that scales sustainably.',
									highlights: ['AI SEO', 'Lead Funnels', 'CRM'],
									theme: 'light'
								},
								{
									id: '04',
									title: 'Internal Tools',
									desc: 'Conversion-focused business websites and custom admin dashboards built for real usage.',
									highlights: ['Architecture', 'Dashboards', 'Portals'],
									theme: 'light'
								}
							].map((mod, i) => (
								<div
									key={i}
									className="group relative border bg-white border-slate-100 hover:border-brand-gold/30 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden p-6 lg:p-8 flex flex-col justify-between">
									
									{/* Corner Marks */}
									<div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-gold/40 transition-all"></div>
									<div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-gold/40 transition-all"></div>

									<div className="relative z-10">
										<div className="flex items-center space-x-4 mb-6">
											<div className="w-8 h-8 flex items-center justify-center font-black text-[10px] border bg-brand-light text-brand-navy border-slate-100 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
												{mod.id}
											</div>
											<h4 className="text-lg lg:text-xl font-black uppercase tracking-tight leading-none text-brand-navy">
												{mod.title}
											</h4>
										</div>

										<div className="space-y-4">
											<p className="text-sm font-medium leading-relaxed text-slate-500">
												{mod.desc}
											</p>
											<div className="flex flex-wrap gap-1.5">
												{mod.highlights.map((h, idx) => (
													<span key={idx} className="px-1.5 py-0.5 text-[7px] font-black tracking-widest uppercase border bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
														{h}
													</span>
												))}
											</div>
										</div>

										<div className="pt-6 flex justify-start">
											<button className="inline-flex items-center space-x-3 py-2 px-4 border bg-brand-navy text-brand-gold border-brand-navy hover:bg-transparent hover:text-brand-navy transition-all">
												<span className="text-[9px] font-black uppercase tracking-[0.2em]">
													Inquire
												</span>
												<svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Who We Serve: The Partner Ecosystem Diagnostic */}
			<section className="py-32 px-6 lg:px-24 bg-brand-light border-y border-brand-navy/5">
				<div className="max-w-5xl mx-auto">
					<div className="bg-white rounded-sm p-10 lg:p-16 shadow-xl border border-brand-navy/5 relative overflow-hidden group">
						<div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-[5s]"></div>

						<div className="grid lg:grid-cols-5 gap-12 relative z-10">
							<div className="lg:col-span-2">
								<div className="inline-flex items-center space-x-2 bg-brand-navy/5 px-2 py-1 mb-6 border-l-2 border-brand-gold">
									<p className="text-[10px] font-mono text-brand-navy/40 uppercase tracking-[0.3em]">
										Partner_Ecosystem_v2
									</p>
								</div>
								<h2 className="text-4xl lg:text-5xl font-black text-brand-navy tracking-tight mb-8 leading-[1.1]">
									Who We <br />
									<span className="text-brand-gold italic">Serve</span>
								</h2>
								<p className="text-slate-500 font-medium leading-relaxed max-w-xs">
									We provide capacity building and AI infrastructure for high-impact organizations.
								</p>
							</div>

							<div className="lg:col-span-3 space-y-3">
								{[
									{ name: 'Small and medium-sized businesses', id: '01', focus: 'EFFICIENCY' },
									{ name: 'Corporate organizations & enterprises', id: '02', focus: 'SCALABILITY' },
									{ name: 'Schools, universities & training institutions', id: '03', focus: 'CAPACITY' },
									{ name: 'NGOs, churches & community organizations', id: '04', focus: 'MISSION' },
									{ name: 'Local commerce ecosystems', id: '05', focus: 'INFRASTRUCTURE' },
								].map((item, i) => (
									<div
										key={i}
										className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-sm bg-brand-light/40 border border-brand-navy/[0.03] hover:border-brand-gold/20 hover:bg-white transition-all duration-300">
										<div className="flex items-center space-x-4 mb-3 md:mb-0">
											<span className="font-mono text-[9px] text-brand-gold tracking-widest uppercase">
												NODE_{item.id} // ACTIVE
											</span>
											<h4 className="text-lg lg:text-xl font-bold text-brand-navy">
												{item.name}
											</h4>
										</div>
										<div className="flex items-center">
											<span className="px-2 py-1 bg-brand-navy/5 text-brand-navy text-[8px] font-black tracking-widest uppercase border border-brand-navy/5">
												{item.focus}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Our Approach: The Workflow Pipeline */}
			<section className="py-32 px-6 lg:px-24 bg-white relative overflow-hidden">
				<div className="max-w-5xl mx-auto relative z-10">
					<div className="mb-20 text-center">
						<div className="inline-flex items-center space-x-2 bg-brand-navy/5 px-2 py-1 mb-4 border-l-2 border-brand-gold">
							<p className="text-[10px] font-mono text-brand-navy/40 uppercase tracking-[0.3em]">
								System_Deployment_Cycle
							</p>
						</div>
						<h2 className="text-4xl lg:text-5xl font-black text-brand-navy tracking-tight leading-none">
							Our <br />
							<span className="text-brand-gold italic">Approach.</span>
						</h2>
					</div>

					<div className="relative">
						{/* Connecting Line */}
						<div className="hidden lg:block absolute left-0 top-[40px] w-full h-[1px] bg-slate-100 z-0"></div>

						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
							{[
								{ step: '01', title: 'Discover', desc: 'We understand your goals, workflows, and pain points.' },
								{ step: '02', title: 'Design', desc: 'We map AI, automation, and digital systems tailored to your needs.' },
								{ step: '03', title: 'Deploy', desc: 'We build, integrate, and test the solutions.' },
								{ step: '04', title: 'Train', desc: 'We train your team—especially through AI productivity training—to ensure adoption.' },
								{ step: '05', title: 'Support & Scale', desc: 'We refine, optimize, and scale as your organization grows.' },
							].map((item, i) => (
								<div key={i} className="relative z-10 group">
									<div className="mb-6 lg:mb-10 flex justify-center">
										<div className="w-20 h-20 bg-white border border-slate-100 flex items-center justify-center font-black text-brand-navy group-hover:bg-brand-navy group-hover:text-brand-gold group-hover:border-brand-navy transition-all duration-500 shadow-sm relative">
											<span className="absolute -top-2 -left-2 text-[8px] font-mono text-brand-gold bg-white px-1 border border-slate-100 uppercase">
												Stage_{item.step}
											</span>
											{item.step}
										</div>
									</div>
									<div className="text-center px-2">
										<h4 className="text-lg font-black uppercase tracking-tight text-brand-navy mb-3">
											{item.title}
										</h4>
										<p className="text-sm text-slate-500 font-medium leading-relaxed">
											{item.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Why Bold Ideas: System Validation Matrix */}
			<section className="py-32 px-6 lg:px-24 bg-brand-navy relative overflow-hidden">
				{/* Background Tech Decal */}
				<div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
					<div className="text-[200px] font-black leading-none text-white select-none">
						BOLD
					</div>
				</div>

				<div className="max-w-5xl mx-auto relative z-10">
					<div className="grid lg:grid-cols-2 gap-20 items-center">
						<div>
							<div className="inline-flex items-center space-x-2 bg-white/5 px-2 py-1 mb-6 border-l-2 border-brand-gold">
								<p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
									Unique_Value_Proposition
								</p>
							</div>
							<h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
								Why <br />
								<span className="text-brand-gold italic text-4xl lg:text-6xl">Bold Ideas?</span>
							</h2>
							<p className="text-white/60 text-lg font-medium leading-relaxed max-w-md italic mb-12">
								"We don’t just deliver tools. We build capacity, systems, and results."
							</p>
						</div>

						<div className="space-y-4">
							{[
								{ label: 'Practical AI', val: 'Implementation-focused solutions that deliver real results.' },
								{ label: 'Local Context', val: 'Global standards adapted for local organizational needs.' },
								{ label: 'Custom Build', val: 'No generic SaaS. Everything is tailored to your workflow.' },
								{ label: 'High Adoption', val: 'Deep focus on training to ensure your staff actually uses the tools.' },
								{ label: 'Long-term Optik', val: 'We act as your growth partner, not just a vendor.' }
							].map((spec, i) => (
								<div
									key={i}
									className="flex items-center space-x-6 p-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-gold/30 transition-all group">
									<div className="w-10 h-10 flex items-center justify-center border border-brand-gold text-brand-gold font-mono text-xs">
										✔
									</div>
									<div>
										<p className="text-[9px] font-black text-brand-gold uppercase tracking-widest font-mono mb-1">
											V_PROP_{i + 1} // {spec.label}
										</p>
										<p className="text-white font-medium text-sm leading-snug">{spec.val}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600px); }
        }
      `}</style>
		</div>
	);
};

export default AboutPage;
