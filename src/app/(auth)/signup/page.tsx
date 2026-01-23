import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Sign Up | Agency OS',
    description: 'Create your identity.',
};

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#0A1128] rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-2xl font-bold text-[#D4AF37]">A</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0A1128]">Join the Agency</h2>
                    <p className="text-slate-500 text-sm mt-2">Initialize your operative profile.</p>
                </div>

                <SignUpForm />

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an identity?{' '}
                    <Link href="/signin" className="text-[#D4AF37] hover:text-[#b0912d] font-bold">
                        Access Terminal
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-300 font-mono">SECURE UPLINK // ENCRYPTED</p>
            </div>
        </div>
    );
}
