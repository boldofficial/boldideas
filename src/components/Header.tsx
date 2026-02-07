'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useAuthStore} from '@/store/authStore';

const Header: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const {user, isAdmin, checkAuth, signOut} = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		checkAuth();
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [mobileMenuOpen]);

	const handleSignOut = async () => {
		await signOut();
		router.push('/');
		setMobileMenuOpen(false);
	};

	const navLinks = [
		{href: '/', label: 'Home'},
		{href: '/about', label: 'About Us'},
		{href: '/services', label: 'Services'},
		{href: '/blog', label: 'Blog'},
		{href: '/contact', label: 'Contact'},
	];

	// Determine if the current page has a dark background by default
	const isDarkPage = ['/', '/services', '/contact'].includes(pathname);

	// Computation of dynamic theme-based classes
	const getHeaderBgClass = () => {
		if (scrolled) return 'py-3 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm';
		return 'py-6 bg-transparent border-transparent shadow-none';
	};

	const getNavLinkClass = (linkHref: string) => {
		const isActive = pathname === linkHref || (linkHref !== '/' && pathname.startsWith(linkHref));
		if (isActive) return 'text-brand-gold';
		
		if (scrolled) return 'text-brand-navy/60 hover:text-brand-gold';
		return isDarkPage ? 'text-white/60 hover:text-brand-gold' : 'text-brand-navy/60 hover:text-brand-gold';
	};

	const getAuthBtnClass = () => {
		if (scrolled) return 'text-brand-navy/60 hover:text-brand-gold';
		return isDarkPage ? 'text-white/60 hover:text-brand-gold' : 'text-brand-navy/60 hover:text-brand-gold';
	};

	const getMobileMenuToggleClass = () => {
		if (scrolled) return 'text-brand-navy';
		return isDarkPage ? 'text-white' : 'text-brand-navy';
	};

	const getLogoFilter = () => {
		if (scrolled) return '';
		return isDarkPage ? 'brightness-200 contrast-100' : '';
	};

	return (
		<header className="fixed top-0 left-0 z-50 w-full transition-all duration-300">
			<nav
				className={`px-4 md:px-8 flex items-center justify-between transition-all duration-500 fixed w-full top-0 left-0 z-50 ${getHeaderBgClass()}`}>
				<Link
					href="/"
					className="flex items-center space-x-3 group relative z-50">
					<Image
						src="/logo.png"
						alt="Bold Ideas Innovation"
						width={120}
						height={40}
						className={`h-8 md:h-10 w-auto transition-all duration-500 ${getLogoFilter()}`}
						priority
					/>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-8">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-[10px] font-black uppercase tracking-widest transition-colors ${getNavLinkClass(link.href)}`}>
							{link.label}
						</Link>
					))}
				</div>

				<div className="hidden md:flex items-center space-x-4">
					{/* Dynamic Auth Button */}
					{isAdmin && (
						<Link
							href="/admin"
							className={`text-[10px] font-black uppercase tracking-widest transition-colors mr-4 ${
								pathname.startsWith('/admin')
									? 'text-brand-gold'
									: getAuthBtnClass()
							}`}>
							Admin
						</Link>
					)}
					{user ? (
						<button
							onClick={handleSignOut}
							className={`text-[10px] font-black uppercase tracking-widest transition-colors mr-4 ${
								scrolled ? 'text-brand-navy/60 hover:text-red-500' : (isDarkPage ? 'text-white/60 hover:text-red-400' : 'text-brand-navy/60 hover:text-red-500')
							}`}>
							Sign Out
						</button>
					) : (
						<Link
							href="/signin"
							className={`text-[10px] font-black uppercase tracking-widest transition-colors mr-4 ${getAuthBtnClass()}`}>
							Sign In
						</Link>
					)}

					<Link
						href="https://crm.getboldideas.com/book"
						target="_blank"
						className={`px-6 py-2.5 rounded-full text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md ${
							scrolled || !isDarkPage
								? 'bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy'
								: 'bg-brand-gold text-brand-navy hover:bg-white'
						}`}>
						GET STARTED
					</Link>
				</div>

				{/* Mobile Menu Toggle */}
				<button
					type="button"
					className={`md:hidden relative z-50 w-10 h-10 flex items-center justify-center transition-colors ${getMobileMenuToggleClass()}`}
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
					<div
						className={`w-6 flex flex-col items-end gap-1.5 transition-all duration-300 ${
							mobileMenuOpen ? 'gap-0' : ''
						}`}>
						<span
							className={`h-0.5 bg-current transition-all duration-300 ${
								mobileMenuOpen ? 'w-6 rotate-45 translate-y-0.5' : 'w-6'
							}`}
						/>
						<span
							className={`h-0.5 bg-current transition-all duration-300 ${
								mobileMenuOpen ? 'w-0 opacity-0' : 'w-4'
							}`}
						/>
						<span
							className={`h-0.5 bg-current transition-all duration-300 ${
								mobileMenuOpen ? 'w-6 -rotate-45 -translate-y-0.5' : 'w-6'
							}`}
						/>
					</div>
				</button>

				{/* Mobile Menu Overlay */}
				<div
					className={`fixed inset-0 bg-white z-40 transition-all duration-500 md:hidden flex flex-col ${
						mobileMenuOpen
							? 'opacity-100 pointer-events-auto'
							: 'opacity-0 pointer-events-none'
					}`}>
					<div className="flex-1 flex flex-col items-center justify-center space-y-8 p-8 bg-brand-navy/50">
						{navLinks.map((link, idx) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className={`text-2xl font-black uppercase tracking-tighter transition-all duration-500 transform ${
									mobileMenuOpen
										? 'translate-y-0 opacity-100'
										: 'translate-y-8 opacity-0'
								}`}
								style={{transitionDelay: `${idx * 100}ms`}}>
								<span
									className={
										pathname === link.href
											? 'text-brand-gold'
											: 'text-brand-navy'
									}>
									{link.label}
								</span>
							</Link>
						))}

						<div className="w-12 h-0.5 bg-gray-100 my-8"></div>

						<div className="flex flex-col items-center space-y-6">
							{user ? (
								<>
									{isAdmin && (
										<Link
											href="/admin"
											onClick={() => setMobileMenuOpen(false)}
											className="text-sm font-bold uppercase tracking-widest text-brand-navy hover:text-brand-gold">
											Admin Dashboard
										</Link>
									)}
									<button
										onClick={handleSignOut}
										className="text-sm font-bold uppercase tracking-widest text-red-500">
										Sign Out
									</button>
								</>
							) : (
								<Link
									href="/signin"
									onClick={() => setMobileMenuOpen(false)}
									className="text-sm font-bold uppercase tracking-widest text-brand-navy">
									Sign In
								</Link>
							)}

							<Link
								href="https://crm.getboldideas.com/book"
								target="_blank"
								onClick={() => setMobileMenuOpen(false)}
								className="bg-brand-navy text-white px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl mt-4">
								Get Started
							</Link>
						</div>
					</div>

					{/* Mobile Footer Decor */}
					<div className="p-8 text-center border-t border-gray-100">
						<p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
							System_Status: Online
						</p>
					</div>
				</div>
			</nav>
		</header>
	);
};
export default Header;
