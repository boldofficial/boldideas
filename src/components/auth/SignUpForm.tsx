'use client';

import { useState } from 'react';
import { signUpAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Image from 'next/image';

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
            setTimeout(() => router.push('/signin'), 2000);
        } else {
            setStatus('error');
            setMessage(res.error || 'Failed to sign up');
            if (res.redirect) {
                setTimeout(() => router.push(res.redirect!), 2000);
            }
        }
    }

    return (
        <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-24 h-24">
                        <Image
                            src="/logo.png"
                            alt="Bold Ideas Innovation"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-brand-navy mb-2">
                        Create Account
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Join Bold Ideas Innovation
                    </p>
                </div>

                {/* Status Messages */}
                {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        <p className="font-medium">Registration Failed</p>
                        <p className="text-xs mt-1">{message}</p>
                    </div>
                )}
                {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        <p className="font-medium">Success!</p>
                        <p className="text-xs mt-1">{message}</p>
                    </div>
                )}

                {/* Form */}
                <form action={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="John Doe"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-slate-900 rounded-lg outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-slate-900 rounded-lg outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Create a strong password"
                                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-slate-900 rounded-lg outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={status === 'loading'}
                        className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
