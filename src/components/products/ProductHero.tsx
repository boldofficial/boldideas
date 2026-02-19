import Link from 'next/link';
import { Product } from '@/data/product';

interface ProductsHeroProps {
  product?: Product;
}

const ProductHero: React.FC<ProductsHeroProps> = ({ product }) => {
  return (
    <section className="relative py-20 md:py-28 flex items-center justify-center px-6 overflow-hidden bg-brand-navy mt-[88px]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={product?.heroImage || "/services_hero_strategic_v3.png"}
          alt={product?.title || "Our Services"}
          className="w-full h-full object-cover opacity-40 brightness-50"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center text-center">
        {/* Simplified Header Content */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6">
          {product?.title || "Our Services"}
        </h1>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-3 text-xs md:text-sm font-medium text-white/80 uppercase tracking-widest">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span className="text-white/40">{'>'}</span>
          <Link href="/products" className="hover:text-brand-gold transition-colors">Products</Link>
          {product && (
            <>
              <span className="text-white/40">{'>'}</span>
              <span className="text-brand-gold font-bold">{product.title}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
