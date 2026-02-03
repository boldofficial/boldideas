'use client';

import React, { useState } from 'react';

// Configuration
const CRM_URL = 'http://crm_project.test'; // Replace with actual CRM URL

interface FormProps {
  className?: string;
}

export const BookingForm: React.FC<FormProps> = ({ className = '' }) => {
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

      const response = await fetch(`${CRM_URL}/public/appointment`, {
        method: 'POST',
        body: formBody,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', date: '', time: '', notes: '' });
      } else {
        setStatus('error');
        setErrorMessage('Check your inputs.');
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
      <h3 className="text-xl font-black text-brand-navy mb-5 text-center lg:text-left">Book an Appointment</h3>

      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-50 text-green-800 border border-green-100 rounded text-[10px] font-medium leading-tight">
          ✅ Request Sent!
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-100 rounded text-[10px] font-medium leading-tight">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            {/* <label className="block text-[9px] font-black uppercase tracking-widest text-brand-navy">
              Your Name *
            </label> */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50/50 border border-slate-100 focus:border-brand-gold focus:bg-white focus:outline-none transition-all rounded text-xs text-brand-navy font-medium"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-1">
            {/* <label className="block text-[9px] font-black uppercase tracking-widest text-brand-navy">
              Email Address *
            </label> */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50/50 border border-slate-100 focus:border-brand-gold focus:bg-white focus:outline-none transition-all rounded text-xs text-brand-navy font-medium"
              placeholder='Enter your email'
            />
          </div>
        </div>

        {/* Row 2: Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            {/* <label className="block text-[9px] font-black uppercase tracking-widest text-brand-navy">
              Date *
            </label> */}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className="w-full h-10 px-3 bg-slate-50/50 border border-slate-100 focus:border-brand-gold focus:bg-white focus:outline-none transition-all rounded text-xs text-brand-navy font-medium"
            />
          </div>
          <div className="space-y-1">
            {/* <label className="block text-[9px] font-black uppercase tracking-widest text-brand-navy">
              Time *
            </label> */}
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50/50 border border-slate-100 focus:border-brand-gold focus:bg-white focus:outline-none transition-all rounded text-xs text-brand-navy font-medium appearance-none"
            >
              <option value="">Time...</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          {/* <label className="block text-[9px] font-black uppercase tracking-widest text-brand-navy">
            Notes
          </label> */}
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full p-3 bg-slate-50/50 border border-slate-100 focus:border-brand-gold focus:bg-white focus:outline-none transition-all rounded text-xs text-brand-navy font-medium resize-none shadow-sm shadow-slate-200/50"
            placeholder="Enter your notes"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full h-11 bg-brand-gold text-brand-navy text-[10px] font-black uppercase tracking-[0.2em] rounded hover:bg-brand-gold/90 transition-all shadow-lg shadow-brand-gold/10 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {status === 'sending' ? 'Sending...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
