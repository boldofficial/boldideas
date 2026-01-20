'use client';

import { useState } from 'react';
import { signUpAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        setMessage('');

        const res = await signUpAction(formData);

        if (res.success) {
            setStatus('success');
            setMessage('Account created! Redirecting to login...');
            setTimeout(() => router.push('/auth/signin'), 2000);
        } else {
            setStatus('error');
            setMessage(res.error || 'Failed to sign up');
            if (res.redirect) {
                setTimeout(() => router.push(res.redirect!), 2000);
            }
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {message}
                </div>
            )}
            {status === 'success' && (
                <div className="p-3 bg-green-50 text-green-600 text-sm rounded border border-green-100 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {message}
                </div>
            )}

            <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#64748b] mb-2">Full Name</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input name="name" type="text" required className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded text-sm placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white/50 backdrop-blur-sm" placeholder="John Doe" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#64748b] mb-2">Email Identity</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input name="email" type="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded text-sm placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white/50 backdrop-blur-sm" placeholder="agent@agency.os" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#64748b] mb-2">Secure Passcode</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input name="password" type={showPassword ? "text" : "password"} required className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded text-sm placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white/50 backdrop-blur-sm" placeholder="••••••••" />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#D4AF37] transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <button disabled={status === 'loading'} className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-bold text-[#0A1128] bg-[#D4AF37] hover:bg-[#b0912d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {status === 'loading' ? 'INITIALIZING...' : 'ESTABLISH IDENTITY'}
            </button>
        </form>
    );
}
