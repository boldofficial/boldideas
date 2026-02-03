import React from 'react';
import { ContactForm } from '@/components/CRMForms';
import { BookingForm } from '@/components/BookingForm';

export default function TestFormsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-brand-navy mb-4">CRM Integration Test</h1>
          <p className="text-slate-500">Validating form styles and logic.</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-12 items-start">
          <div className="flex-1 w-full max-w-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center"> Option 1: Contact Form</h2>
            <ContactForm />
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center"> Option 2: Booking Form</h2>
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
