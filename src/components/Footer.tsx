import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="py-20 px-4 lg:px-24 border-t bg-brand-navy border-white/5">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
					<div className="col-span-2">
						<div className="mb-6">
							<Image
								src="/logo.png"
								alt="Bold Ideas Innovation"
								width={150}
								height={50}
								className="h-12 w-auto brightness-0 invert"
							/>
						</div>
						<p className="text-slate-500 text-sm max-w-xs leading-relaxed">
							Engineering the future of work through simple systems, clear
							playbooks, and campaigns that compound.
						</p>
						<div className="mt-8 space-y-3">
							<div className="flex items-center space-x-3 text-slate-400 text-xs">
								<span className="text-brand-gold">📍</span>
								<span>Lagos, Nigeria</span>
							</div>
							<div className="flex items-center space-x-3 text-slate-400 text-xs">
								<span className="text-brand-gold">📞</span>
								<span>+234 810 551 4520</span>
							</div>
							<div className="flex items-center space-x-3 text-slate-400 text-xs">
								<span className="text-brand-gold">✉️</span>
								<span>info@getboldideas.com</span>
							</div>
						</div>
					</div>

					<div>
						<h5 className="text-white text-xs font-black uppercase tracking-widest mb-6">
							Services
						</h5>
						<ul className="space-y-4 text-xs text-slate-500">
							<li>
								<Link href="/services" className="hover:text-brand-gold">
									AI Strategy
								</Link>
							</li>
							<li>
								<Link href="/services" className="hover:text-brand-gold">
									Automation
								</Link>
							</li>
							<li>
								<Link href="/services" className="hover:text-brand-gold">
									Prog SEO
								</Link>
							</li>
							<li>
								<Link href="/services" className="hover:text-brand-gold">
									Paid Media
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h5 className="text-white text-xs font-black uppercase tracking-widest mb-6">
							Company
						</h5>
						<ul className="space-y-4 text-xs text-slate-500">
							<li>
								<Link href="/about" className="hover:text-brand-gold">
									About Us
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-brand-gold">
									Contact
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-brand-gold">
									LinkedIn
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-brand-gold">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-brand-gold">
									Terms & Conditions
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-2">
						<h5 className="text-white text-xs font-black uppercase tracking-widest mb-6">
							Tools We Master
						</h5>
						<div className="flex flex-wrap gap-2">
							{[
								'OpenAI',
								'Zapier',
								'Make',
								'Airtable',
								'HubSpot',
								'Python',
							].map((tool) => (
								<span
									key={tool}
									className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
									{tool}
								</span>
							))}
						</div>
					</div>
				</div>
				<div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
						© 2025 Bold Ideas Innovation. All rights reserved.
					</p>
					<div className="flex space-x-6">
						<Link
							href="#"
							className="text-slate-600 hover:text-white transition-colors">
							<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
								<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
