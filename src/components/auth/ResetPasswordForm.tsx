
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordForm: React.FC = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passcodes do not match.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Security credentials renewed successfully.' });
            
            setTimeout(() => {
                router.push('/admin');
            }, 2000);

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
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
                   <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">CREDENTIAL_RENEWAL</span>
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-black text-white mb-8 uppercase tracking-tight text-center">
                        Set New <span className="text-brand-gold">Passcode</span>
                    </h2>
                    
                    {message && (
                        <div className={`p-3 rounded-sm mb-6 text-xs font-mono border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-red-500/10 border-red-500/30 text-red-200'}`}>
                            {message.type === 'success' ? 'SUCCESS: ' : 'ERROR: '} {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                       <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                               New Passcode
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                    minLength={8}
                                    className="w-full bg-black/20 border border-white/10 focus:border-brand-gold text-white p-3 pr-10 rounded-sm text-sm font-mono placeholder:text-white/10 outline-none transition-colors"
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
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                               Confirm New Passcode
                            </label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                    minLength={8}
                                    className="w-full bg-black/20 border border-white/10 focus:border-brand-gold text-white p-3 pr-10 rounded-sm text-sm font-mono placeholder:text-white/10 outline-none transition-colors"
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
                            className="w-full bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-white transition-colors mt-4 disabled:opacity-50"
                        >
                            {loading ? 'UPDATING...' : 'UPDATE_CREDENTIALS'}
                       </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
