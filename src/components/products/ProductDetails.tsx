import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '@/data/product';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <section className="py-20 bg-white overflow-hidden relative">
      {/* Background Schematic Grid (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12">
          
          {/* Row 1, Col 1: Hero Image Section */}
          <div className="relative">
            <div className="relative z-10 w-full aspect-square md:aspect-[16/10] lg:aspect-square rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={product.mainImage}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Design Accents */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-gold/15 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-brand-navy/5 rounded-full blur-3xl -z-0"></div>
          </div>

          {/* Row 1, Col 2: Main Context (Title & Bold Summary) */}
          <div className="flex flex-col justify-center lg:pl-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-[2px] bg-brand-gold"></div>
              <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-gold">
                {product.subtitle}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-brand-navy uppercase tracking-tighter mb-8 leading-[0.9] lg:-ml-1">
              {product.title}
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 font-bold leading-snug border-l-4 border-brand-gold/30 pl-6 py-2 italic bg-slate-50/50 rounded-r-2xl">
              {product.intro}
            </p>
          </div>

          {/* Row 2, Col 1: Configuration & Target (The "How it works") */}
          <div className="bg-brand-navy text-white rounded-[40px] p-10 lg:p-14 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Decorative Grid Mesh overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            
            <div className="relative z-10">
              {/* Who It's For */}
              <div className="mb-12">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">Ideal User Base</h4>
                <div className="flex flex-wrap gap-3">
                  {product.whoItIsFor.map((item, idx) => (
                    <span key={idx} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customization & Deployment Options */}
              <div className="space-y-12">
                {product.customizationOptions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">Customization Matrix</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {product.customizationOptions.map((opt, idx) => (
                        <li key={idx} className="flex items-center text-sm lg:text-base font-bold text-white/90">
                          <div className="w-2 h-2 bg-brand-gold rounded-full mr-4 flex-shrink-0"></div>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.deploymentOptions.length > 0 && (
                  <div className="pt-10 border-t border-white/10">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">Deployment Infrastructure</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {product.deploymentOptions.map((opt, idx) => (
                        <li key={idx} className="flex items-center text-sm lg:text-base font-bold text-white/90">
                          <div className="w-2 h-2 bg-brand-gold/40 border border-brand-gold rounded-full mr-4 flex-shrink-0"></div>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2, Col 2: Core Features List (Visible & Structured) */}
          <div className="flex flex-col h-full">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-navy/40 mb-8 px-2">Core System Capabilities</h4>
            <div className="space-y-4 mb-10 overflow-hidden">
              {product.coreFeatures.map((feature, idx) => (
                <div key={idx} className="group p-8 bg-slate-50 border border-slate-100 rounded-[30px] hover:bg-white hover:border-brand-gold/40 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-gold/10 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-black text-brand-navy uppercase tracking-tight text-lg lg:text-xl mb-3 group-hover:text-brand-gold transition-colors">{feature.title}</h5>
                      <p className="text-base text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Action Area */}
            <div className="mt-auto p-4 flex flex-col gap-8">
              <Link 
                href={product.ctaLink}
                className="w-full inline-flex items-center justify-center space-x-6 px-12 py-7 bg-brand-navy text-white text-xs lg:text-sm font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 shadow-2xl group relative overflow-hidden"
              >
                <span className="relative z-10">{product.ctaText}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2 relative z-10" />
              </Link>

              {product.articleLink && (
                <Link 
                  href={product.articleLink.href}
                  className="text-sm lg:text-base font-black text-brand-navy hover:text-brand-gold transition-all flex items-center group justify-center"
                >
                  <span className="border-b-[3px] border-brand-gold/30 group-hover:border-brand-gold transition-all pb-1 uppercase tracking-widest italic">
                    {product.articleLink.title}
                  </span>
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
