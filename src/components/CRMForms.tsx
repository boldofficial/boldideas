'use client';

import React, { useState } from 'react';
import { createWebsiteLead } from '@/actions/crm';

interface FormProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export const ContactForm: React.FC<FormProps> = ({ className = '', theme = 'light' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLeadContext = () => {
    if (typeof window === 'undefined') return { service: '', type: '', features: '' };
    const params = new URLSearchParams(window.location.search);
    return {
      service: params.get('service') || '',
      type: params.get('type') || '',
      features: params.get('features') || '',
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const formBody = new FormData();
      const leadContext = getLeadContext();
      const message = formData.message || (
        leadContext.type === 'custom-quote' && leadContext.features
          ? `I would like a custom website quote with these features: ${leadContext.features}.`
          : ''
      );

      if (!message.trim()) {
        setStatus('error');
        setErrorMessage('Please enter a short message.');
        return;
      }

      Object.entries(formData).forEach(([key, value]) => formBody.append(key, value));
      formBody.set('message', message);
      formBody.set('source', 'website_contact_form');
      formBody.set(
        'serviceInterest',
        leadContext.service === 'websites'
          ? leadContext.type === 'custom-quote'
            ? 'Custom website quote request'
            : 'Website inquiry'
          : 'Website or AI agent inquiry'
      );
      if (leadContext.service) formBody.set('service', leadContext.service);
      if (leadContext.type) formBody.set('type', leadContext.type);
      if (leadContext.features) formBody.set('features', leadContext.features);

      const result = await createWebsiteLead(formBody);

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Check your inputs.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-transparent' : 'bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-100'} w-full ${className}`}>
      {!isDark && <h3 className="text-2xl font-black text-brand-navy mb-6 text-center">Contact Us</h3>}
      
      {status === 'success' && (
        <div className={`mb-6 p-4 ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-800 border-green-200'} border rounded-md text-sm font-medium`}>
          ✅ Message sent successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className={`mb-6 p-4 ${isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-800 border-red-200'} border rounded-md text-sm font-medium`}>
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-brand-navy'}`}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-sm border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20' : 'bg-white border-slate-200 text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} outline-none transition-all placeholder:text-slate-500`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-brand-navy'}`}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className={`w-full px-4 py-3 rounded-sm border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20' : 'bg-white border-slate-200 text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} outline-none transition-all placeholder:text-slate-500`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-brand-navy'}`}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={`w-full px-4 py-3 rounded-sm border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20' : 'bg-white border-slate-200 text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} outline-none transition-all placeholder:text-slate-500`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-brand-navy'}`}>Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc."
              className={`w-full px-4 py-3 rounded-sm border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20' : 'bg-white border-slate-200 text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} outline-none transition-all placeholder:text-slate-500`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-brand-navy'}`}>Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your operational bottleneck..."
            className={`w-full px-4 py-4 rounded-sm border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20' : 'bg-white border-slate-200 text-slate-700 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} outline-none transition-all placeholder:text-slate-500`}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className={`w-full group relative overflow-hidden font-black text-[10px] uppercase tracking-[0.4em] py-5 transition-all ${isDark ? 'bg-brand-gold text-brand-navy hover:scale-[1.02]' : 'bg-brand-navy text-white hover:bg-brand-navy/90'}`}
        >
          <span className="relative z-10">{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
          {isDark && <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>}
        </button>
      </form>
    </div>
  );
};
