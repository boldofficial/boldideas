import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="py-24 px-6 lg:px-24 bg-brand-navy border-t border-white/5 relative overflow-hidden">
			{/* Subtle Grounding Glow */}
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-brand-gold/20 blur-md pointer-events-none"></div>
			
			<div className="max-w-[1440px] mx-auto relative z-10">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-24">
					<div className="col-span-2">
						<div className="mb-8">
							<Image
								src="/logo.png"
								alt="Bold Ideas Innovation"
								width={140}
								height={45}
								className="h-10 w-auto brightness-0 invert opacity-90"
							/>
						</div>
						<p className="text-white/40 text-sm max-w-xs leading-relaxed font-medium mb-10">
							Practical AI for Small Businesses & Solopreneurs. We build the digital backbone that gives you back your time.
						</p>
						<div className="space-y-4">
							<div className="flex items-center space-x-4 text-white/30 text-[10px] font-bold uppercase tracking-widest group">
								<span className="text-brand-gold">HQ_UNIT</span>
								<span className="w-4 h-px bg-white/10 group-hover:w-8 transition-all"></span>
								<span>Lagos, Nigeria</span>
							</div>
							<div className="flex items-center space-x-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">
								<span className="text-brand-gold">COMMS</span>
								<span className="w-4 h-px bg-white/10"></span>
								<span>info@getboldideas.com</span>
							</div>
						</div>
					</div>

					<div>
						<h5 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
							Capabilities
						</h5>
						<ul className="space-y-5 text-[11px] font-bold uppercase tracking-widest text-white/40">
							<li>
								<Link href="/services#training" className="hover:text-brand-gold transition-colors">
									AI Training
								</Link>
							</li>
							<li>
								<Link href="/services#coaching" className="hover:text-brand-gold transition-colors">
									AI Coaching
								</Link>
							</li>
							<li>
								<Link href="/services#automation" className="hover:text-brand-gold transition-colors">
									Automation
								</Link>
							</li>
							<li>
								<Link href="/services#systems" className="hover:text-brand-gold transition-colors">
									Growth Systems
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h5 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
							Structure
						</h5>
						<ul className="space-y-5 text-[11px] font-bold uppercase tracking-widest text-white/40">
							<li>
								<Link href="/about" className="hover:text-brand-gold transition-colors">
									About Us
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-brand-gold transition-colors">
									Contact
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-brand-gold transition-colors">
									LinkedIn
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-brand-gold transition-colors">
									Privacy
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-2">
						<h5 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
							Validated Stack
						</h5>
						<div className="flex flex-wrap gap-2">
							{[
								'OpenAI',
								'Zapier',
								'Make',
								'Airtable',
								'HubSpot',
								'Assistant UI',
							].map((tool) => (
								<span
									key={tool}
									className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-sm text-[9px] font-black text-white/20 uppercase tracking-[0.2em] hover:border-brand-gold/30 hover:text-white/40 transition-all cursor-default">
									{tool}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Final Technical Footer Strip */}
				<div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
					<div className="flex flex-col md:flex-row items-center gap-10">
						<div className="flex items-center space-x-6">
							<div className="w-12 h-[1px] bg-brand-gold/30"></div>
							<span className="text-[10px] font-black text-white/10 uppercase tracking-[0.8em]">
								Bold Ideas Innovations Ltd // Strategic Unit B.1
							</span>
						</div>
						<div className="flex items-center space-x-4">
							<div className="w-2 h-2 rounded-full bg-brand-gold/40 animate-pulse"></div>
							<span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
								System: Operational
							</span>
						</div>
					</div>
					
					<p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.4em]">
						© 2025 Bold Ideas Innovation. Code is Law.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
