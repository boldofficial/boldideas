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
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Image with Decorative Shapes */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[60px] overflow-hidden shadow-2xl">
              <Image
                src={product.mainImage}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Decorative Blobs (Mirroring the provided image style) */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-navy/5 rounded-full blur-3xl -z-0"></div>
            
            {/* Blob SVG Background (Simplified version of the image) */}
            <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 scale-110 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#002D5B" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.4,90.1,-16.2,88.5,-0.9C86.9,14.4,81.1,28.8,71.8,40.8C62.4,52.8,49.6,62.3,35.8,69.5C22,76.6,7.2,81.4,-8.1,79.8C-23.4,78.2,-39.3,70.2,-52.1,59.3C-64.9,48.4,-74.6,34.6,-79.8,19.3C-85,4.1,-85.8,-12.6,-80.4,-27.6C-75,-42.6,-63.4,-55.9,-49.8,-63.4C-36.2,-70.9,-20.6,-72.6,-2.8,-67.8C15,-63,30.6,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-8 h-[1px] bg-brand-gold"></div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-brand-gold">
                {product.subtitle}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy uppercase tracking-tighter mb-8 leading-tight">
              {product.title}
            </h2>
            
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
              {product.intro}
            </p>

            {/* Who It's For */}
            <div className="mb-10">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy/40 mb-4">Who It’s For</h4>
              <div className="flex flex-wrap gap-3">
                {product.whoItIsFor.map((item, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-brand-navy/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <div className="mb-12 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy/40 mb-6">Core Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.coreFeatures.map((feature, idx) => (
                  <div key={idx} className="flex space-x-4">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-black text-brand-navy uppercase tracking-tight text-sm mb-1">{feature.title}</h5>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customization & Deployment (Conditionally rendered) */}
            {(product.customizationOptions.length > 0 || product.deploymentOptions.length > 0) && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 pt-10 border-t border-slate-100">
                  {product.customizationOptions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-navy/40 mb-4">Customization Options</h4>
                      <ul className="space-y-2">
                        {product.customizationOptions.map((opt, idx) => (
                          <li key={idx} className="flex items-center text-xs font-bold text-slate-600">
                            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-3"></span>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.deploymentOptions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-navy/40 mb-4">Deployment Options</h4>
                      <ul className="space-y-2">
                        {product.deploymentOptions.map((opt, idx) => (
                          <li key={idx} className="flex items-center text-xs font-bold text-slate-600">
                            <span className="w-1.5 h-1.5 bg-brand-navy/20 rounded-full mr-3"></span>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
               </div>
            )}

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <Link 
                href={product.ctaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-5 bg-brand-navy text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 shadow-xl group"
              >
                <span>{product.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Article Link */}
            {product.articleLink && (
              <Link 
                href={product.articleLink.href}
                className="text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center"
              >
                <span className="border-b-2 border-brand-gold/30 pb-1">
                  {product.articleLink.title}
                </span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
