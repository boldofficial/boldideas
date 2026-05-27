import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, ShieldCheck } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

export const metadata = {
    title: "Book a Strategy Call | Bold Ideas",
    description: "Schedule a free strategy call. We'll help you map out a website, AI agent, and automation plan for your small business.",
};

export default function BookPage() {
    return (
        <main className="bg-white text-brand-navy">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[#061b35] pt-32 pb-20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.20),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.20),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />
                <div className="relative mx-auto max-w-[1200px] px-6 md:px-12 lg:px-20">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-6 flex justify-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                                <Calendar className="h-4 w-4" />
                                Free Strategy Call
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
                            Let&apos;s map out your
                            <span className="block text-brand-gold">growth system</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/74 md:text-lg">
                            Tell us a little about your business and we&apos;ll put together a website, AI agent, and automation strategy — no pitch, just a practical plan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking section */}
            <section className="relative py-20 md:py-28">
                <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-20">
                    <div className="mx-auto grid max-w-[1000px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                        {/* Form */}
                        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black text-brand-navy">Book a Strategy Call</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Pick a date and time that works for you. We&apos;ll follow up to confirm within 24 hours.
                                </p>
                            </div>
                            <BookingForm />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-brand-gold">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-black text-brand-navy">What to expect</h3>
                                <ul className="mt-4 space-y-3">
                                    {[
                                        '30-minute virtual call',
                                        'We review your current website and lead flow',
                                        'Practical recommendations, no fluff',
                                        'Custom plan with timeline and investment',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-brand-gold">Prefer to start differently?</h3>
                                <div className="mt-4 space-y-3">
                                    <Link
                                        href="/contact"
                                        className="flex items-center gap-2 text-sm font-bold text-brand-navy transition-colors hover:text-brand-gold"
                                    >
                                        Send us a message
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                    <Link
                                        href="/services"
                                        className="flex items-center gap-2 text-sm font-bold text-brand-navy transition-colors hover:text-brand-gold"
                                    >
                                        Browse our services
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
