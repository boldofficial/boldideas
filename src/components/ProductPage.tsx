import React from 'react';
import ProductHero from './products/ProductHero';
import ProductDetails from './products/ProductDetails';
import { Product } from '@/data/product';

interface ProductsPageProps {
  product?: Product;
}

const ProductPage: React.FC<ProductsPageProps> = ({ product }) => {
  return (
    <div className="pt-24 pb-20 overflow-hidden bg-brand-light relative">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <ProductHero product={product} />
      {product && <ProductDetails product={product} />}
      {/* <ServicesList /> */}
    </div>
  );
};

export default ProductPage;

