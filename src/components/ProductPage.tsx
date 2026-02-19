import React from 'react';
import ProductHero from './products/ProductHero';
import ProductDetails from './products/ProductDetails';
import { Product, products } from '@/data/product';

interface ProductsPageProps {
  product?: Product;
}

const ProductPage: React.FC<ProductsPageProps> = ({ product }) => {
  // Use the provided product or default to the first one in the catalog
  const activeProduct = product || products[0];

  return (
    <div className="pb-20 overflow-hidden bg-brand-light relative">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#002D5B 1px, transparent 1px), linear-gradient(90deg, #002D5B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <ProductHero product={activeProduct} />
      {activeProduct && <ProductDetails product={activeProduct} />}
    </div>
  );
};

export default ProductPage;

