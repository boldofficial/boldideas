
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';

import { setupAdminAction } from '@/actions/auth';

const AdminSetupForm: React.FC = () => {
    const router = useRouter();
    const { checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('email', formData.email);
            formDataObj.append('password', formData.password);
            formDataObj.append('name', formData.name);

            const result = await setupAdminAction(formDataObj);

            if (result.error) {
                if (result.redirect) {
                    router.push(result.redirect);
                    return;
                }
                throw new Error(result.error);
            }

            if (!result.success) {
                throw new Error(result.error || "Failed to create admin.");
            }

            // Success
            router.push('/signin?setup=success');
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto w-full relative">
            <div className="border border-brand-gold/30 bg-brand-navy/90 backdrop-blur-md p-1 rounded-sm relative shadow-2xl">
                 {/* Tech Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-brand-gold"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-brand-gold"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-brand-gold"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-brand-gold"></div>

                <div className="bg-brand-navy/50 p-3 flex justify-between items-center border-b border-brand-gold/10">
                   <span className="font-mono text-[9px] text-brand-gold uppercase tracking-widest animate-pulse">SYSTEM_INIT_PROTOCOL</span>
                   <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-brand-gold/20 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-brand-gold/20 rounded-full"></div>
                   </div>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight text-center">
                        Admin <span className="text-brand-gold">Setup</span>
                    </h2>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-sm mb-6 text-red-200 text-xs font-mono">
                            ERROR: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                       <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-gold/70">
                               Full Name
                            </label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="ENTER_ID"
                                className="w-full bg-brand-navy/50 border border-brand-navy/30 focus:border-brand-gold text-white p-3 rounded-sm text-sm font-mono placeholder:text-white/20 outline-none transition-colors"
                            />
                       </div>

                       <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-gold/70">
                               Secure Email
                            </label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ENTER_EMAIL"
                                required
                                className="w-full bg-brand-navy/50 border border-brand-navy/30 focus:border-brand-gold text-white p-3 rounded-sm text-sm font-mono placeholder:text-white/20 outline-none transition-colors"
                            />
                       </div>

                       <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-gold/70">
                               Passcode
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                    minLength={8}
                                    className="w-full bg-brand-navy/50 border border-brand-navy/30 focus:border-brand-gold text-white p-3 pr-10 rounded-sm text-sm font-mono placeholder:text-white/20 outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-brand-gold transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                       </div>

                       <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-gold/70">
                               Confirm Passcode
                            </label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                    minLength={8}
                                    className="w-full bg-brand-navy/50 border border-brand-navy/30 focus:border-brand-gold text-white p-3 pr-10 rounded-sm text-sm font-mono placeholder:text-white/20 outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-brand-gold transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                       </div>

                       <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-white transition-colors relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? 'INITIALIZING...' : 'ESTABLISH_ADMIN_ACCESS'}
                            </span>
                       </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSetupForm;
