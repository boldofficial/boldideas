
import Link from 'next/link';
import SignInForm from "@/components/auth/SignInForm";
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: "Sign In | Bold Ideas Innovation",
    robots: "noindex, nofollow"
};

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>

            {/* Back to Home Link */}
            <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-300 hover:text-brand-gold transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
            </Link>

            {/* Main Content - Centered Container */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                <SignInForm />

                <div className="mt-6 text-center text-sm text-slate-300">
                    New to Bold Ideas?{' '}
                    <Link href="/signup" className="text-brand-gold hover:text-white font-semibold transition-colors">
                        Create an account
                    </Link>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    © 2025 Bold Ideas Innovation. All rights reserved.
                </div>
            </div>
        </div>
    );
}
