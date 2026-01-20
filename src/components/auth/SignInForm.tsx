
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

const SignInForm: React.FC = () => {
    const router = useRouter();
    const { checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (error) throw error;

            // Update store
            await checkAuth();

            // Redirect based on role
            const { role } = useAuthStore.getState();
            if (role === 'admin') {
                router.push('/admin');
            } else if (role === 'staff') {
                router.push('/staff');
            } else if (role === 'client') {
                router.push('/client');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto w-full relative">
            <div className="border border-white/10 bg-brand-navy/80 backdrop-blur-md p-1 rounded-sm relative shadow-2xl">
                {/* Tech Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>

                <div className="bg-brand-navy/50 p-3 flex justify-between items-center border-b border-white/5">
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">SECURE_ACCESS_REQUIRED</span>
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight text-center">
                        Admin <span className="text-brand-gold">Login</span>
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-sm mb-6 text-red-200 text-xs font-mono">
                            ACCESS_DENIED: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                                Identity
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ENTER_EMAIL"
                                required
                                suppressHydrationWarning
                                className="w-full bg-black/20 border border-white/10 focus:border-brand-gold text-white p-3 rounded-sm text-sm font-mono placeholder:text-white/10 outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                                Access Code
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="********"
                                required
                                suppressHydrationWarning
                                className="w-full bg-black/20 border border-white/10 focus:border-brand-gold text-white p-3 rounded-sm text-sm font-mono placeholder:text-white/10 outline-none transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-white transition-colors mt-4"
                        >
                            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
