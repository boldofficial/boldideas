import { products } from "@/data/product";
import ProductsPage from "@/components/ProductPage";
import CTA from "@/components/CTA";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <ProductsPage product={product} />
      <CTA />
    </div>
  );
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}
