
import Link from 'next/link';
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
    title: "Admin Login | Bold Ideas Innovation",
    robots: "noindex, nofollow"
};

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 w-full">
                <SignInForm />

                <div className="mt-6 text-center text-sm text-slate-400">
                    New to the agency?{' '}
                    <Link href="/auth/signup" className="text-[#D4AF37] hover:text-[#b0912d] font-bold">
                        Initialize Identity
                    </Link>
                </div>
            </div>
        </div>
    );
}
