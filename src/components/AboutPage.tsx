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

							<div className="pt-8 border-t border-white/5">
								<p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
									At Bold Ideas, we don’t just talk about artificial intelligence—we <span className="text-brand-gold font-bold">deploy it into real workflows</span>, train your teams to use it confidently, and help you unlock measurable productivity, efficiency, and growth.
								</p>
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
								don't fail because they <br />
								<span className="text-white/20 italic underline decoration-white/10">lack ideas.</span>
							</h2>

							<div className="grid gap-8">
								<div className="relative flex items-start space-x-6">
									<div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2"></div>
									<p className="text-white/80 text-lg font-medium leading-relaxed">
										They struggle because systems are slow, teams are overwhelmed, and tools don’t talk to each other.
									</p>
								</div>
								<div className="relative flex items-start space-x-6">
									<div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2"></div>
									<p className="text-white font-black text-xl tracking-tight">
										Bold Ideas exists to fix that.
									</p>
								</div>
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
								Trusted AI & Digital <br />
								<span className="text-brand-gold italic decoration-brand-gold/30">Transformation Partner.</span>
							</h2>

							<p className="text-slate-500 font-bold mb-8">We work as your AI implementation and digital growth partner, helping you:</p>

							<div className="space-y-6 max-w-lg">
								{[
									'Reduce manual work with AI automation',
									'Improve team productivity using practical AI tools',
									'Build custom internal systems tailored to your operations',
									'Strengthen marketing, operations, and decision-making with data-driven AI',
								].map((msg, i) => (
									<div key={i} className="flex items-start space-x-5 group/item border-l-2 border-brand-navy/10 pl-6 py-1">
										<span className="text-brand-gold font-black mt-1">
											✔
										</span>
										<p className="text-slate-500 text-sm md:text-base font-medium group-hover/item:text-brand-navy transition-colors leading-snug">
											{msg}
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
								<span className="text-brand-gold italic">Do</span>
							</h2>
						</div>
					</div>

					<div className="space-y-6">
						{/* Flagship Module (Full Width) */}
						{[
							{
								id: '01',
								title: 'AI Productivity Training for Corporate Organizations',
								desc: 'Our flagship service: We deliver hands-on AI productivity training designed specifically for corporate teams, government agencies, educational institutions, and NGOs.',
								context: 'This is not theory or hype.',
								points: [
									'Use AI tools to work faster and smarter',
									'Automate repetitive tasks (emails, reports, documentation)',
									'Improve collaboration and decision-making',
									'Apply AI safely, ethically, and efficiently in daily work'
								],
								formats: [
									'On-site workshops',
									'Virtual live sessions',
									'Executive AI briefings',
									'Department-specific AI workflows'
								],
								outcome: 'Outcome: Teams save time, reduce errors, and become AI-confident—not AI-confused.',
								theme: 'navy'
							}
						].map((mod, i) => (
							<div
								key={i}
								className="group relative border border-brand-navy bg-brand-navy text-white transition-all duration-500 overflow-hidden p-8 lg:p-10 shadow-xl rounded-sm">
								
								<div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold/40 transition-all"></div>
								<div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold/40 transition-all"></div>

								<div className="relative z-10">
									<div className="flex items-center justify-between gap-6 mb-8">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 flex items-center justify-center font-black text-xs border bg-brand-gold text-brand-navy border-brand-gold">
												{mod.id}
											</div>
											<h3 className="text-xl lg:text-3xl font-black uppercase tracking-tight leading-none text-white whitespace-pre-wrap max-w-lg">
												{mod.title}
											</h3>
										</div>
										<div className="hidden lg:block h-px flex-1 mx-8 bg-white/10"></div>
									</div>

									<div className="grid lg:grid-cols-2 gap-12">
										<div className="space-y-6">
											<p className="text-base font-bold text-brand-gold">
												{mod.desc}
											</p>
											
											<p className="text-sm font-medium text-white/50 italic">{mod.context}</p>

											<div className="space-y-3">
												<p className="text-[10px] font-black tracking-widest text-white/40 uppercase">We train your staff to:</p>
												<ul className="space-y-2">
													{mod.points.map((p, idx) => (
														<li key={idx} className="flex items-start space-x-3 text-sm text-white/70">
															<span className="text-brand-gold">🔹</span>
															<span>{p}</span>
														</li>
													))}
												</ul>
											</div>
										</div>

										<div className="space-y-6 flex flex-col justify-between">
											<div className="space-y-4">
												<p className="text-[10px] font-black tracking-widest text-brand-gold uppercase">Training formats include:</p>
												<div className="flex flex-wrap gap-2">
													{mod.formats.map((f, idx) => (
														<span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
															{f}
														</span>
													))}
												</div>
											</div>

											<div className="pt-6 border-t border-white/5">
												<p className="text-sm font-black italic text-brand-gold mb-8">
													{mod.outcome}
												</p>
												
												<button className="inline-flex items-center space-x-4 py-3 px-6 border bg-brand-gold text-brand-navy border-brand-gold hover:bg-white hover:border-white transition-all w-full lg:w-auto justify-center">
													<span className="text-[10px] font-black uppercase tracking-[0.3em]">
														Request_Training
													</span>
													<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
													</svg>
												</button>
											</div>
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
									title: 'AI Consulting & Workflow Automation',
									desc: 'We analyze your current operations and design custom AI-powered workflows that fit your organization—not generic SaaS tools.',
									highlights: ['AI Agents', 'Automation', 'Custom Scripts'],
								},
								{
									id: '03',
									title: 'Digital Marketing & Growth Systems',
									desc: 'We combine AI + digital marketing strategy to help businesses grow sustainably. This isn’t just marketing—it’s growth infrastructure.',
									highlights: ['AI SEO', 'Funnels', 'CRM'],
								},
								{
									id: '04',
									title: 'Custom Websites & Internal Tools',
									desc: 'We design and build conversion-focused business websites, admin dashboards, and internal tools tailored to your workflow.',
									highlights: ['Portals', 'Dashboards', 'Secure'],
								}
							].map((mod, i) => (
								<div
									key={i}
									className="group relative border bg-white border-slate-100 hover:border-brand-gold/30 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden p-6 lg:p-8 flex flex-col justify-between">
									
									<div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-gold/40 transition-all"></div>
									<div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-gold/40 transition-all"></div>

									<div className="relative z-10">
										<div className="flex items-center space-x-4 mb-6">
											<div className="w-8 h-8 flex items-center justify-center font-black text-[10px] border bg-brand-light text-brand-navy border-slate-100 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
												{mod.id}
											</div>
											<h4 className="text-sm font-black uppercase tracking-[0.1em] leading-tight text-brand-navy">
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
			<section className="py-13 px-6 lg:px-24 bg-white relative overflow-hidden">
				{/* Background Grid - Very Subtle */}
				<div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
					style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
				</div>

				<div className="max-w-5xl mx-auto relative z-10">
					<div className="bg-white rounded-xl p-10 lg:p-16 shadow-[0_32px_64px_-16px_rgba(0,45,91,0.1)] border border-slate-100 flex flex-col lg:flex-row gap-16 lg:items-start">

						{/* Left: Branding & Intent */}
						<div className="lg:w-[35%] w-full">
							
							<h2 className="text-5xl font-black text-brand-navy tracking-tighter leading-[0.9] mb-10">
								Who We <br />
								<span className="text-brand-gold italic">Serve</span>
							</h2>
							<div className="space-y-6">
								<p className="text-slate-500 text-lg font-bold leading-tight">
									We work with:
								</p>
								<p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] italic">
									If your organization wants to <span className="text-brand-navy font-bold">use AI productively</span>—not experiment endlessly—Bold Ideas is for you.
								</p>
							</div>
						</div>

						{/* Right: The Service Grid / Matrix */}
						<div className="lg:w-[65%] w-full space-y-4">
							{[
								{ name: 'Small and medium-sized businesses', id: '01', focus: 'EFFICIENCY' },
								{ name: 'Corporate organizations & enterprises', id: '02', focus: 'SCALABILITY' },
								{ name: 'Schools, universities & training institutions', id: '03', focus: 'CAPACITY' },
								{ name: 'NGOs, community organizations', id: '04', focus: 'MISSION' },
								{ name: 'Local commerce ecosystems', id: '05', focus: 'INFRASTRUCTURE' },
							].map((item, i) => (
								<div
									key={i}
									className="group flex md:flex-row flex-col md:items-center justify-between p-6 bg-slate-50/50 border border-slate-100/50 rounded-lg hover:bg-white hover:border-brand-gold/20 hover:shadow-xl hover:shadow-brand-navy/5 transition-all duration-500">
									
									<div className="flex items-center space-x-6">
										{/* Diagnostic Disc */}
										<div className="relative flex items-center justify-center">
											<div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
											<div className="absolute w-3 h-3 rounded-full border border-brand-gold/30 animate-ping"></div>
										</div>
										
										<h4 className="text-lg font-extrabold text-brand-navy/90 group-hover:text-brand-navy transition-colors">
											{item.name}
										</h4>
									</div>

									{/* Status Badge */}
									<div className="flex items-center mt-4 md:mt-0">
										<span className="px-3 py-1 bg-white border border-slate-200 text-[8px] font-black tracking-widest text-slate-400 group-hover:text-brand-navy group-hover:border-brand-navy transition-all uppercase">
											{item.focus}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Our Approach: The Workflow Pipeline */}
			<section className="py-32 px-6 lg:px-24 bg-white relative overflow-hidden">
				<div className="max-w-5xl mx-auto relative z-10">
					<div className="mb-20 text-center">
						<h2 className="text-4xl lg:text-5xl font-black text-brand-navy tracking-[0.3em] leading-none">
							<span className="text-brand-navy">Our </span>
							<span className="text-brand-gold italic">Approach</span>
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
								We don’t just deliver tools. <br />
								<span className="text-white font-black not-italic border-t border-white/10 pt-4 mt-4 block">We build capacity, systems, and results.</span>
							</p>
						</div>

						<div className="space-y-4">
							{[
								'Practical, implementation-focused AI',
								'Local understanding with global standards',
								'Custom solutions—not one-size-fits-all',
								'Strong focus on training and adoption',
								'Long-term partnership mindset'
							].map((spec, i) => (
								<div
									key={i}
									className="flex items-center space-x-6 p-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-gold/30 transition-all group">
									<div className="w-10 h-10 flex items-center justify-center border border-brand-gold text-brand-gold font-mono text-xs">
										✔
									</div>
									<div>
										<p className="text-white font-medium text-sm leading-snug">{spec}</p>
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
