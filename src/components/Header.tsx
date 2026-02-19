'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useAuthStore} from '@/store/authStore';

const Header: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [productMenuOpen, setProductMenuOpen] = useState(false);
	const pathname = usePathname();

	const closeMenus = () => {
		setMobileMenuOpen(false);
		setProductMenuOpen(false);
	};
	const {user, isAdmin, checkAuth, signOut} = useAuthStore();
	const router = useRouter();

	const searchParams = useSearchParams();
	const [staffMode, setStaffMode] = useState(false);
	const logoClickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
	const logoClicksRef = React.useRef(0);

	useEffect(() => {
		checkAuth();
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		
		// Check for staff mode activation
		const isStaffHidden = localStorage.getItem('bold_staff_hidden') === 'true';
		const isStaffForced = localStorage.getItem('bold_staff_mode') === 'true';
		const activateViaQuery = searchParams.get('staff') === 'true';
		
		// Priority 1: URL Query (Explicit activation)
		if (activateViaQuery) {
			localStorage.setItem('bold_staff_mode', 'true');
			localStorage.removeItem('bold_staff_hidden');
			setStaffMode(true);
		} 
		// Priority 2: Admin Auto-Reveal (If not explicitly hidden)
		else if (isAdmin && !isStaffHidden) {
			setStaffMode(true);
		}
		// Priority 3: Manual persistence from previous session
		else if (isStaffForced && !isStaffHidden) {
			setStaffMode(true);
		}

		return () => window.removeEventListener('scroll', handleScroll);
	}, [searchParams, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleLogoClick = (e: React.MouseEvent) => {
		// If it's the home page and we are NOT logged in, let the link work normally
		// But if we are logged in, we use the triple click to toggle
		logoClicksRef.current += 1;

		if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);

		if (logoClicksRef.current === 3) {
			const newMode = !staffMode;
			setStaffMode(newMode);
			
			if (newMode) {
				localStorage.setItem('bold_staff_mode', 'true');
				localStorage.removeItem('bold_staff_hidden');
			} else {
				localStorage.setItem('bold_staff_hidden', 'true');
				localStorage.removeItem('bold_staff_mode');
			}
			
			logoClicksRef.current = 0;
			// Prevent the link from triggering on the 3rd click if we're toggling
			e.preventDefault();
		} else {
			logoClickTimeoutRef.current = setTimeout(() => {
				logoClicksRef.current = 0;
			}, 500);
		}
		closeMenus();
	};

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
		closeMenus();
	};

	const navLinks = [
		{href: '/', label: 'Home'},
		{href: '/about', label: 'About Us'},
		{href: '/services', label: 'Services'},
		{href: '/blog', label: 'Blog'},
		{href: '/contact', label: 'Contact'},
		{href: '/product', label: 'Product'},
	];

	// Determine if the current page has a dark background by default for unscrolled state
	const isDarkPage = ['/'].includes(pathname);

	// Computation of dynamic theme-based classes
	const getHeaderBgClass = () => {
		if (scrolled) return 'py-3 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm';
		if (pathname === '/') return 'py-6 bg-brand-navy border-transparent shadow-none';
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
					onClick={handleLogoClick}
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
						link.label === 'Product' ? (
							<div 
								key={link.href} 
								className="relative py-4"
								onMouseEnter={() => setProductMenuOpen(true)}
								onMouseLeave={() => setProductMenuOpen(false)}
							>
								<Link
									href={link.href}
									onClick={closeMenus}
									className={`text-sm font-black uppercase tracking-widest transition-colors flex items-center hover:text-brand-gold ${getNavLinkClass(link.href)}`}>
									{link.label}
								</Link>

								{/* Mega Menu Dropdown */}
								<div className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-auto min-w-max bg-white shadow-xl transition-all duration-300 border border-gray-100 py-4 px-2 ${productMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
									<div className="flex flex-col items-start gap-y-2">
										<Link href="/product/ezer-home-care-management" onClick={closeMenus} className="px-6 py-4 text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-tight whitespace-nowrap border-r border-gray-50 last:border-r-0">
											Ezer Care Management
										</Link>
										<Link href="/product/school-management-system" onClick={closeMenus} className="px-6 py-4 text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-tight whitespace-nowrap border-r border-gray-50 last:border-r-0">
											School Management System
										</Link>
										<Link href="/product/classified-ads-directory-platform" onClick={closeMenus} className="px-6 py-4 text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-tight whitespace-nowrap">
											Classified Ads Directory Platform
										</Link>
									</div>
								</div>
							</div>
						) : (
							<Link
								key={link.href}
								href={link.href}
								onClick={closeMenus}
								className={`text-sm font-black uppercase tracking-widest transition-colors ${getNavLinkClass(link.href)}`}>
								{link.label}
							</Link>
						)
					))}
				</div>

				<div className="hidden md:flex items-center space-x-4">
					{/* Admin-only Auth Actions - Only visible in Staff Mode */}
					{staffMode && isAdmin && (
						<>
							<Link
								href="/admin"
								className={`text-sm font-black uppercase tracking-widest transition-colors mr-4 ${
									pathname.startsWith('/admin')
										? 'text-brand-gold'
										: getAuthBtnClass()
								}`}>
								Admin
							</Link>
							<button
								onClick={handleSignOut}
								className={`text-sm font-black uppercase tracking-widest transition-colors mr-4 ${
									scrolled ? 'text-brand-navy/60 hover:text-red-500' : (isDarkPage ? 'text-white/60 hover:text-red-400' : 'text-brand-navy/60 hover:text-red-500')
								}`}>
								Sign Out
							</button>
						</>
					)}
					
					{/* Guest-only Sign In - Only visible in Staff Mode */}
					{staffMode && !user && (
						<Link
							href="/signin"
							className={`text-sm font-black uppercase tracking-widest transition-colors mr-4 ${getAuthBtnClass()}`}>
							Sign In
						</Link>
					)}

					<Link
						href="https://crm.getboldideas.com/book"
						target="_blank"
						className={`px-6 py-2.5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md ${
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
								onClick={closeMenus}
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
							{staffMode && isAdmin && (
								<>
									<Link
										href="/admin"
										onClick={closeMenus}
										className="text-sm font-bold uppercase tracking-widest text-brand-navy hover:text-brand-gold">
										Admin Dashboard
									</Link>
									<button
										onClick={handleSignOut}
										className="text-sm font-bold uppercase tracking-widest text-red-500">
										Sign Out
									</button>
								</>
							)}
							
							{staffMode && !user && (
								<Link
									href="/signin"
									onClick={closeMenus}
									className="text-sm font-bold uppercase tracking-widest text-brand-navy">
									Sign In
								</Link>
							)}

							<Link
								href="https://crm.getboldideas.com/book"
								target="_blank"
								onClick={closeMenus}
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
