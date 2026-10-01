import { FEATURED_IDS, PRODUCT_BY_ID, getProducts } from '../data/products';
import { SHOWCASE } from '../data/content';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ProductGrid } from '../components/product/ProductGrid';
import { Hero } from '../sections/Hero';
import { CategoryDiscovery } from '../sections/CategoryDiscovery';
import { UseCases } from '../sections/UseCases';
import { StarterSets } from '../sections/StarterSets';
import { Deals, NewArrivals } from '../sections/NewAndDeals';
import { Calculators } from '../sections/Calculators';
import { Academy } from '../sections/Academy';
import { Creations } from '../sections/Creations';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Ana sayfa akışı (rakip analizi önerisine göre):
 * değer önerisi → kategori keşfi → öne çıkanlar → "ne yapabilirsin?" →
 * başlangıç setleri → yeni gelenler / fırsatlar → hesaplayıcılar → akademi → topluluk
 */
export function HomePage() {
  usePageTitle();
  const showcase = PRODUCT_BY_ID.get(SHOWCASE.productId)!;
  return (
    <>
      <Hero />
      <CategoryDiscovery />

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <SectionHeader
            id="featured-title"
            eyebrow="Seçki"
            title="Öne çıkan ürünler"
            description="Atölyelerin en çok tercih ettiği kalıplar ve hammaddeler."
            action={{ label: 'Tüm ürünler', to: '/kategori/kaliplar' }}
          />
          <ProductGrid products={getProducts(FEATURED_IDS)} />
        </div>
      </section>

      <section className="section" aria-label="Bu kalıpla ne yapabilirsin?">
        <div className="container">
          <UseCases product={showcase} usages={SHOWCASE.usages} />
        </div>
      </section>

      <StarterSets />
      <NewArrivals />
      <Deals />
      <Calculators />
      <Academy />
      <Creations />
    </>
  );
}
