import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DEALS, NEW_ARRIVALS } from '../data/products';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ProductCard } from '../components/product/ProductCard';
import { ProductRail } from '../components/product/ProductGrid';
import { dativeSuffix, discountPercent } from '../lib/format';
import s from './NewAndDeals.module.css';

export function NewArrivals() {
  return (
    <section className="section" aria-labelledby="new-title">
      <div className="container">
        <SectionHeader
          id="new-title"
          eyebrow="Koleksiyona yeni eklenenler"
          title="Yeni gelenler"
          action={{ label: 'Tüm yeni ürünler', to: '/kategori/yeni-gelenler' }}
        />
        <ProductRail products={NEW_ARRIVALS} label="Yeni gelen ürünler" />
      </div>
    </section>
  );
}

/**
 * Seçili fırsatlar — kırmızı/sarı "indirim" dili yerine charcoal zemin,
 * pudra rozetler ve sakin tipografi.
 */
export function Deals() {
  const maxDiscount = Math.max(...DEALS.map((p) => discountPercent(p.price, p.oldPrice)));
  return (
    <section className="section" aria-labelledby="deals-title">
      <div className="container">
        <div className={s.panel}>
          <div className={s.intro}>
            <SectionHeader
              id="deals-title"
              tone="dark"
              eyebrow="Dönemsel avantaj"
              title="Seçili fırsatlar"
              description="Sezonun sevilen kalıp, hammadde ve setlerinde sınırlı stokla fiyat avantajı."
              className={s.header}
            />
            <p className={s.stat}>
              <span className={s.statValue}>
                %{maxDiscount}
                {dativeSuffix(maxDiscount)}
              </span>
              <span className={s.statLabel}>varan indirim</span>
            </p>
            <Link to="/kategori/kampanyalar" className="btn btn--light">
              Tüm kampanyalar
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ul className={s.products}>
            {DEALS.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} tone="onDark" sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 60vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
