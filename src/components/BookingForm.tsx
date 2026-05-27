'use client';

import React, { useState } from 'react';
import { submitBooking } from '@/actions/booking';

interface FormProps {
  className?: string;
  dark?: boolean;
}

export const BookingForm: React.FC<FormProps> = ({ className = '', dark = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const formBody = new FormData();
      Object.entries(formData).forEach(([key, value]) => formBody.append(key, value));

      const result = await submitBooking(formBody);

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', date: '', time: '', notes: '' });
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`w-full ${className}`}>
      <h3 className={`text-xl font-black mb-5 text-center lg:text-left ${dark ? 'text-white' : 'text-brand-navy'}`}>
        {dark ? 'Book a Strategy Call' : 'Book an Appointment'}
      </h3>

      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-800/30 text-green-300 border border-green-700/50 rounded text-[10px] font-medium leading-tight">
          ✅ Request Sent! We'll be in touch within 1 business day to schedule your call.
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-900/30 text-red-300 border border-red-700/50 rounded text-[10px] font-medium leading-tight">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full h-11 px-4 transition-all rounded-lg text-sm font-medium placeholder:text-slate-400 ${
                dark
                  ? 'bg-white/10 border-white/15 text-white focus:border-brand-gold focus:bg-white/15'
                  : 'bg-slate-50/50 border-slate-100 text-brand-navy focus:border-brand-gold focus:bg-white'
              } border focus:outline-none`}
              placeholder="Your name *"
            />
          </div>
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full h-11 px-4 transition-all rounded-lg text-sm font-medium placeholder:text-slate-400 ${
                dark
                  ? 'bg-white/10 border-white/15 text-white focus:border-brand-gold focus:bg-white/15'
                  : 'bg-slate-50/50 border-slate-100 text-brand-navy focus:border-brand-gold focus:bg-white'
              } border focus:outline-none`}
              placeholder="Email address *"
            />
          </div>
        </div>

        {/* Row 2: Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className={`w-full h-11 px-4 transition-all rounded-lg text-sm font-medium ${
                dark
                  ? 'bg-white/10 border-white/15 text-white focus:border-brand-gold focus:bg-white/15 [color-scheme:dark]'
                  : 'bg-slate-50/50 border-slate-100 text-brand-navy focus:border-brand-gold focus:bg-white'
              } border focus:outline-none`}
            />
          </div>
          <div className="space-y-1">
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className={`w-full h-11 px-4 transition-all rounded-lg text-sm font-medium ${
                dark
                  ? 'bg-white/10 border-white/15 text-white focus:border-brand-gold focus:bg-white/15'
                  : 'bg-slate-50/50 border-slate-100 text-brand-navy focus:border-brand-gold focus:bg-white'
              } border focus:outline-none appearance-none`}
            >
              <option value="" className={dark ? 'bg-[#061b35]' : ''}>Preferred time...</option>
              <option value="09:00" className={dark ? 'bg-[#061b35]' : ''}>09:00 AM</option>
              <option value="10:00" className={dark ? 'bg-[#061b35]' : ''}>10:00 AM</option>
              <option value="11:00" className={dark ? 'bg-[#061b35]' : ''}>11:00 AM</option>
              <option value="13:00" className={dark ? 'bg-[#061b35]' : ''}>01:00 PM</option>
              <option value="14:00" className={dark ? 'bg-[#061b35]' : ''}>02:00 PM</option>
              <option value="15:00" className={dark ? 'bg-[#061b35]' : ''}>03:00 PM</option>
              <option value="16:00" className={dark ? 'bg-[#061b35]' : ''}>04:00 PM</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className={`w-full p-4 transition-all rounded-lg text-sm font-medium placeholder:text-slate-400 resize-none ${
              dark
                ? 'bg-white/10 border-white/15 text-white focus:border-brand-gold focus:bg-white/15'
                : 'bg-slate-50/50 border-slate-100 text-brand-navy focus:border-brand-gold focus:bg-white'
            } border focus:outline-none`}
            placeholder="Tell us about your project or what you'd like to discuss (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className={`w-full h-12 text-xs font-black uppercase tracking-[0.2em] rounded-lg transition-all mt-2 ${
            dark
              ? 'bg-brand-gold text-brand-navy hover:bg-white shadow-lg shadow-brand-gold/20'
              : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/10'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === 'sending' ? 'Sending...' : dark ? 'Request a Strategy Call' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
