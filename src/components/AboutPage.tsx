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

			{/* Engineering Schematic: Core Logic Modules with Texture Popups */}
			<section className="py-40 px-4 lg:px-24 relative overflow-hidden bg-white">
				<div className="max-w-7xl mx-auto relative">
					<div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
						<div className="max-w-xl">
							<div className="inline-block border border-brand-navy/10 px-3 py-1 mb-4">
								<p className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.4em]">
									Core Principles
								</p>
							</div>
							<h2 className="text-5xl font-black text-brand-navy tracking-tighter leading-none">
								Operating <br />
								Principles.
							</h2>
						</div>
						<div className="hidden md:block w-1/2 h-px bg-brand-navy/20 relative">
							<div className="absolute right-0 -top-1 w-2 h-2 bg-brand-gold shadow-[0_0_8px_#FFB81C]"></div>
						</div>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
						{[
							{
								id: '01',
								title: 'Human Centric',
								desc: 'Technology serves people, not the other way around.',
								img: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
							},
							{
								id: '02',
								title: 'Simplicity',
								desc: 'Simplicity scales, complexity breaks.',
								img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
							},
							{
								id: '03',
								title: 'Objectivity',
								desc: 'Data beats opinion everytime.',
								img: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
							},
							{
								id: '04',
								title: 'Speed',
								desc: 'Speed of implementation is a competitive advantage.',
								img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
							},
							{
								id: '05',
								title: 'Growth',
								desc: 'Continuous iteration leads to exponential growth.',
								img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
							},
							{
								id: '06',
								title: 'ROI',
								desc: 'A focus on ROI and measurable outcomes.',
								img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107',
							},
							{
								id: '07',
								title: 'Clarity',
								desc: 'No jargon—just plain English and results.',
								img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
							},
							{
								id: '08',
								title: 'Partnership',
								desc: 'A true partnership mindset, not just a vendor.',
								img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
							},
						].map((mod, i) => (
							<div
								key={i}
								className="bg-white border border-brand-navy/10 p-8 group hover:border-brand-gold transition-colors duration-300 relative overflow-hidden rounded-sm">
								<div className="absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-500 grayscale">
									<img
										src={`${mod.img}?auto=format&fit=crop&q=40&w=400`}
										alt=""
										className="w-full h-full object-cover"
									/>
								</div>

								{/* Corner Accents */}
								<div className="absolute top-0 right-0 p-2 font-mono text-[9px] md:text-xs text-brand-navy/20 group-hover:text-brand-gold">
									M_{mod.id}
								</div>

								<div className="relative z-10">
									<div className="w-8 h-8 flex items-center justify-center text-brand-navy font-black text-xs md:text-sm mb-8 bg-brand-light border border-brand-navy/5 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors">
										{mod.id}
									</div>
									<h3 className="text-xl font-black text-brand-navy mb-4 transition-colors uppercase tracking-tight">
										{mod.title}
									</h3>
									<p className="text-sm text-slate-500 font-mono leading-relaxed transition-colors">
										{mod.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Target Ecosystems: The diagnostic look with subtle textures */}
			<section className="py-32 px-k4   bg-brand-light border-t border-brand-navy/5">
				<div className="max-w-7xl mx-auto">
					<div className="bg-white rounded-sm p-12 lg:p-20 shadow-xl border border-brand-navy/5 relative overflow-hidden group">
						<div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-[5s]"></div>

						<div className="grid lg:grid-cols-3 gap-16 relative z-10">
							<div className="lg:col-span-1">
								<div className="inline-block border border-brand-navy/10 px-3 py-1 mb-4">
									<p className="text-[10px] md:text-xs font-mono text-brand-gold uppercase tracking-[0.4em]">
										Target_Audience
									</p>
								</div>
								<h2 className="text-4xl font-black text-brand-navy tracking-tight mb-8 leading-none">
									Who We <br />
									Help.
								</h2>
								<p className="text-slate-500 font-light leading-relaxed">
									We partner with forward-thinking SMEs, ambitious
									entrepreneurs, and scaling startups.
								</p>
							</div>
							<div className="lg:col-span-2 space-y-4">
								{[
									{
										name: 'SMEs',
										focus: 'EFFICIENCY',
										desc: 'Teams tired of the manual grind and ready for self-sustaining growth systems.',
									},
									{
										name: 'Entrepreneurs',
										focus: 'VISION',
										desc: 'Ambitious leaders ready to embrace the future of work.',
									},
									{
										name: 'Startups',
										focus: 'SCALE',
										desc: 'Scaling companies wanting to build a self-sustaining growth machine.',
									},
								].map((item, i) => (
									<div
										key={i}
										className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-sm bg-brand-light/50 border border-brand-navy/5 group/item hover:border-brand-navy hover:bg-white transition-all duration-300">
										<div className="mb-4 md:mb-0">
											<span className="font-mono text-[9px] md:text-xs text-brand-gold mb-2 block tracking-widest uppercase">
												NODE_0{i + 1}: CONNECTED
											</span>
											<h4 className="text-2xl font-black text-brand-navy">
												{item.name}
											</h4>
										</div>
										<div className="text-right flex flex-col items-end">
											<span className="px-2 py-0.5 rounded-sm bg-brand-navy text-brand-gold text-[8px] md:text-[10px] font-mono font-bold tracking-widest mb-2">
												{item.focus}
											</span>
											<p className="text-xs md:text-sm text-slate-500 font-mono max-w-xs">
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Tech Stack Schematic: The Final Block with Deep Texture Background */}
			<section className="py-40 px-4 lg:px-24 relative overflow-hidden">
				{/* Background Texture for the whole section */}
				<div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale contrast-125">
					<img
						src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
					<div>
						<div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/20 px-4 py-1.5 rounded-full mb-8">
							<span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
							<span className="text-[10px] md:text-xs font-mono font-black uppercase tracking-widest text-brand-navy">
								Sys_Stack: Active
							</span>
						</div>
						<h2 className="text-5xl lg:text-7xl font-black text-brand-navy mb-12 tracking-tighter leading-none">
							Tools We <br />
							<span className="text-brand-gold italic">Work With.</span>
						</h2>
						<div className="space-y-6">
							{[
								{label: 'TRANSPARENCY', val: 'Transparent communication.'},
								{label: 'ROADMAPS', val: 'Clear roadmaps.'},
								{label: 'OUTCOMES', val: 'Focus on ROI & measurable results.'},
							].map((spec, i) => (
								<div
									key={i}
									className="flex items-center space-x-6 p-6 rounded-sm border border-brand-navy/5 bg-white shadow-sm hover:border-brand-gold transition-colors group">
									<div className="w-12 h-12 rounded-sm bg-brand-navy flex items-center justify-center text-brand-gold font-bold group-hover:scale-105 transition-transform font-mono">
										0{i + 1}
									</div>
									<div>
										<p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
											{spec.label}
										</p>
										<p className="text-brand-navy font-bold">{spec.val}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-0 bg-brand-gold/20 blur-[120px] rounded-full"></div>
						<div className="relative bg-brand-navy rounded-sm p-12 lg:p-16 border-4 border-white shadow-2xl overflow-hidden group/box">
							{/* Internal Texture: Silicon Chip Detail */}
							<div className="absolute inset-0 opacity-[0.08] pointer-events-none grayscale brightness-50 contrast-150 mix-blend-screen">
								<img
									src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800"
									alt=""
									className="w-full h-full object-cover group-hover/box:scale-110 transition-transform duration-[10s]"
								/>
							</div>

							<div className="flex justify-between items-center mb-16 relative z-10">
								<div className="flex space-x-2">
									<div className="w-3 h-3 rounded-full bg-white/10"></div>
									<div className="w-3 h-3 rounded-full bg-white/10"></div>
									<div className="w-3 h-3 rounded-full bg-white/10"></div>
								</div>
								<span className="font-mono text-[9px] md:text-xs text-brand-gold tracking-widest">
									ECOSYSTEM_V2
								</span>
							</div>

							<div className="space-y-16 relative z-10">
								<div className="absolute left-[39px] top-8 bottom-8 w-[2px] bg-white/10"></div>
								{[
									{l: 'INPUT', t: 'OpenAI / Gemini / Notion', i: '🧠'},
									{l: 'LOGIC', t: 'Make.com / Python / Scripts', i: '⚡'},
									{
										l: 'OUTPUT',
										t: 'HubSpot / Airtable / Google Sheets',
										i: '🚀',
									},
								].map((node, i) => (
									<div
										key={i}
										className="flex items-center space-x-8 relative z-10 group">
										<div className="w-20 h-20 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover:bg-brand-gold group-hover:scale-105 transition-all text-white group-hover:text-brand-navy">
											{node.i}
										</div>
										<div>
											<span className="text-[9px] md:text-xs font-black text-brand-gold tracking-[0.3em] uppercase block mb-1 font-mono">
												{node.l}
											</span>
											<span className="text-xl font-bold text-white">
												{node.t}
											</span>
										</div>
									</div>
								))}
							</div>
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
