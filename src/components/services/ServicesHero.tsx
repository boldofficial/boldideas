import Link from 'next/link';

const ServicesHero: React.FC = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center px-6 lg:px-24 py-24 overflow-hidden bg-brand-navy">
      {/* Background Image: Strategic Growth Protocols */}
      <div className="absolute inset-0 z-0">
        <img
          src="/services_hero_strategic_v3.png"
          alt="Strategic Growth Protocols"
          className="w-full h-full object-cover opacity-30 contrast-125 transition-transform duration-[15s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy/40 to-brand-navy"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 w-full flex flex-col items-center text-center">
        <div className="max-w-5xl px-6">
          {/* Subtitle / Strategic Tag */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-[1px] bg-brand-gold mb-4 md:mb-6"></div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40">
              Bold Ideas Innovations
            </span>
          </div>

          {/* Corporate Flagship Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase mb-6 md:mb-8 w-full">
            <span className="tracking-[0.2em] inline-block">Intelligent</span> <br />
            <span className="text-brand-gold italic block mt-1 tracking-[0.2em]">Growth Protocols.</span>
          </h1>

          {/* Simplified Narrative Block */}
          <div className="relative border-t border-white/5 pt-6 md:pt-8 max-w-xl mx-auto mb-10 md:mb-12">
            <p className="text-[10px] sm:text-xs md:text-base text-white/50 font-medium leading-relaxed">
              We deploy custom AI systems designed to <span className="text-brand-gold font-bold">automate, scale, and optimize</span> your organization's entire digital infrastructure.
            </p>
          </div>

          {/* Booking CTA Button */}
          <Link 
            href="https://crm.getboldideas.com/book"
            target="_blank"
            className="group relative inline-flex items-center justify-center bg-brand-gold text-brand-navy font-black text-[10px] md:text-xs uppercase tracking-[0.4em] px-8 md:px-12 py-4 md:py-6 overflow-hidden transition-all hover:pr-14"
          >
            <span className="relative z-10">BOOK A STRATEGY SESSION</span>
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all duration-500 z-10 text-brand-navy">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
