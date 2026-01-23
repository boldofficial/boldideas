
"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

import { sendPasswordResetAction } from '@/actions/auth';

const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await sendPasswordResetAction(email);
            
            if (!result.success) throw new Error(result.error || 'Failed to request reset.');

            setMessage({ type: 'success', text: 'If an admin account exists, a secure uplink token has been transmitted.' });

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
                   <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">RECOVERY_PROTOCOL_V1</span>
                   <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight text-center">
                        Recover <span className="text-brand-gold">Access</span>
                    </h2>
                    <p className="text-slate-400 text-xs font-mono text-center mb-6">Enter your identity string to initiate recovery.</p>
                    
                    {message && (
                        <div className={`p-3 rounded-sm mb-6 text-xs font-mono border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-red-500/10 border-red-500/30 text-red-200'}`}>
                            {message.type === 'success' ? 'TRANSMISSION_COMPLETE: ' : 'TRANSMISSION_FAILED: '} {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                       <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                               Secure Email
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ENTER_EMAIL"
                                required
                                className="w-full bg-black/20 border border-white/10 focus:border-brand-gold text-white p-3 rounded-sm text-sm font-mono placeholder:text-white/10 outline-none transition-colors"
                            />
                       </div>

                       <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black text-xs uppercase tracking-widest py-3 rounded-sm transition-colors mt-2 disabled:opacity-50"
                        >
                            {loading ? 'TRANSMIT...' : 'INITIATE_RESET_SEQUENCE'}
                       </button>
                       
                       <div className="text-center pt-2">
                           <a href="/signin" className="text-[10px] font-mono text-brand-gold/70 hover:text-brand-gold uppercase tracking-widest hover:underline">
                               &lt; Abort_Sequence
                           </a>
                       </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
