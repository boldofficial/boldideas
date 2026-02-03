'use client';

import React, { useState } from 'react';

// Configuration
const CRM_URL = 'http://crm_project.test'; // Replace with actual CRM URL

interface FormProps {
  className?: string;
}

export const ContactForm: React.FC<FormProps> = ({ className = '' }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const formBody = new FormData();
      Object.entries(formData).forEach(([key, value]) => formBody.append(key, value));

      const response = await fetch(`${CRM_URL}/public/lead`, {
        method: 'POST',
        body: formBody,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.errors ? Object.values(data.errors).join(', ') : 'Check your inputs.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg border border-slate-100 w-full ${className}`}>
      <h3 className="text-2xl font-black text-brand-navy mb-6 text-center">Contact Us</h3>
      
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-md text-sm font-medium">
          ✅ Message sent successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-md text-sm font-medium">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Inc."
            className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="How can we help?"
            className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all placeholder:text-slate-400 text-slate-700"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-md hover:bg-brand-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

