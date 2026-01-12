"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, checkAuth, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
     await signOut();
     router.push('/');
  };

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
    >
      <nav
        className={`px-8 py-4 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="/logo.png"
            alt="Bold Ideas Innovation"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              pathname === "/"
                ? "text-brand-gold"
                : "text-brand-navy/60 hover:text-brand-gold"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              pathname === "/about"
                ? "text-brand-gold"
                : "text-brand-navy/60 hover:text-brand-gold"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/services"
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              pathname === "/services"
                ? "text-brand-gold"
                : "text-brand-navy/60 hover:text-brand-gold"
            }`}
          >
            Services
          </Link>
          


          <Link
            href="/contact"
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              pathname === "/contact"
                ? "text-brand-gold"
                : "text-brand-navy/60 hover:text-brand-gold"
            }`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
             {/* Dynamic Auth Button */}
             {isAdmin && (
                <Link
                    href="/admin"
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors mr-4 ${
                    pathname.startsWith("/admin")
                        ? "text-brand-gold"
                        : "text-brand-navy/60 hover:text-brand-gold"
                    }`}
                >
                    Admin
                </Link>
             )}
             {user ? (
                <button
                    onClick={handleSignOut}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-navy/60 hover:text-red-500 transition-colors mr-4"
                >
                    Sign Out
                </button>
             ) : (
                <Link
                    href="/auth/signin"
                    className="hidden md:block text-[10px] font-black uppercase tracking-widest text-brand-navy/60 hover:text-brand-gold transition-colors mr-4"
                >
                    Sign In
                </Link>
             )}

            <Link
            href="/contact"
            className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-xs font-black hover:bg-brand-gold hover:text-brand-navy transition-all hover:scale-105 active:scale-95 shadow-md"
            >
            GET STARTED
            </Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;
