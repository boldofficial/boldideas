"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

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
        <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="flex justify-center mb-8">
                    <div className="h-20 w-20 rounded-2xl bg-brand-navy flex items-center justify-center shadow-lg">
                        <span className="text-xl font-black text-white">
                            B<span className="text-brand-gold">I</span>
                        </span>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-brand-navy mb-2">
                        Admin <span className="text-brand-gold">Setup</span>
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Initialize the system administrator account
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        <p className="font-medium">Setup Failed</p>
                        <p className="text-xs mt-1">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Admin Name"
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
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                required
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
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                required
                                minLength={8}
                                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-slate-900 rounded-lg outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                required
                                minLength={8}
                                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-slate-900 rounded-lg outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Initializing...
                            </span>
                        ) : (
                            'Initialize Admin Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSetupForm;
