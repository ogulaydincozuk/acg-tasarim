import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { STORE } from '../data/content';
import { FEATURED_IDS, PRODUCT_BY_ID, getProducts } from '../data/products';
import { useShop } from '../context/ShopContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatPrice } from '../lib/format';
import { orderTotals } from '../lib/pricing';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DemoNotice } from '../components/ui/DemoNotice';
import { Img } from '../components/ui/Img';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ProductRail } from '../components/product/ProductGrid';
import { TotalsRows } from '../components/cart/OrderSummary';
import s from './CartPage.module.css';

export function CartPage() {
  usePageTitle('Sepetim');
  const { cart, cartCount, cartTotal, setQty, removeFromCart, clearCart } = useShop();
  const totals = orderTotals(cartTotal);
  const remaining = Math.max(0, STORE.freeShippingThreshold - cartTotal);
  const progress = Math.min(1, cartTotal / STORE.freeShippingThreshold);
  const suggestions = useMemo(
    () => getProducts(FEATURED_IDS).filter((p) => p.stock > 0 && !cart.some((l) => l.id === p.id)).slice(0, 8),
    [cart],
  );

  return (
    <div className={`container ${s.page}`}>
      <Breadcrumbs items={[{ label: 'Ana sayfa', to: '/' }, { label: 'Sepetim' }]} />

      <header className={s.head}>
        <h1 className={s.title}>Sepetim</h1>
        {cart.length > 0 && <span className={s.count}>{cartCount} ürün</span>}
      </header>

      {cart.length === 0 ? (
        <div className={s.empty}>
          <span className={s.emptyIcon}>
            <ShoppingBag strokeWidth={1.4} aria-hidden="true" />
          </span>
          <p className={s.emptyTitle}>Sepetin henüz boş</p>
          <p className={s.emptyText}>Kalıplar, hammaddeler ve başlangıç setleriyle üretmeye başla.</p>
          <div className={s.emptyActions}>
            <Link to="/kategori/kaliplar" className="btn btn--primary">
              Kalıpları keşfet
            </Link>
            <Link to="/kategori/setler" className="btn btn--secondary">
              Başlangıç setleri
            </Link>
          </div>
        </div>
      ) : (
        <div className={s.layout}>
          <section aria-labelledby="cart-lines" className={s.main}>
            <h2 id="cart-lines" className="visually-hidden">
              Sepetteki ürünler
            </h2>

            <div className={s.shipping}>
              <Truck strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p>
                  {remaining > 0 ? (
                    <>
                      Ücretsiz kargo için <strong className="price">{formatPrice(remaining)}</strong> daha ekle.
                    </>
                  ) : (
                    <strong>Ücretsiz kargo kazandın.</strong>
                  )}
                </p>
                <div
                  className={s.bar}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  aria-label="Ücretsiz kargo ilerlemesi"
                >
                  <span style={{ transform: `scaleX(${progress})` }} />
                </div>
              </div>
            </div>

            <ul className={s.lines}>
              {cart.map((line) => {
                const p = PRODUCT_BY_ID.get(line.id);
                if (!p) return null;
                return (
                  <li key={line.id} className={s.line}>
                    <Link to={`/urun/${p.slug}`} className={s.thumb} tabIndex={-1} aria-hidden="true">
                      <Img image={p.image} alt="" ratio={4 / 5} sizes="120px" maxWidth={480} />
                    </Link>
                    <div className={s.info}>
                      <p className={s.sub}>{p.subcategory}</p>
                      <Link to={`/urun/${p.slug}`} className={s.name}>
                        {p.name}
                      </Link>
                      <p className={s.meta}>
                        {p.shortInfo} · <span className="price">{formatPrice(p.price)}</span> / adet
                      </p>
                      {p.stock <= 10 && <p className={s.low}>Stokta son {p.stock} adet</p>}
                    </div>
                    <div className={s.controls}>
                      <QuantityStepper size="sm" value={line.qty} max={p.stock} onChange={(n) => setQty(p.id, n)} label={`${p.name} adet`} />
                      <button type="button" className={s.remove} onClick={() => removeFromCart(p.id)}>
                        <Trash2 strokeWidth={1.6} aria-hidden="true" />
                        <span>Kaldır</span>
                        <span className="visually-hidden"> {p.name} ürününü sepetten</span>
                      </button>
                    </div>
                    <p className={`${s.lineTotal} price`}>{formatPrice(p.price * line.qty)}</p>
                  </li>
                );
              })}
            </ul>

            <div className={s.mainFoot}>
              <Link to="/kategori/kaliplar" className="text-link">
                Alışverişe devam et
                <ArrowRight aria-hidden="true" />
              </Link>
              <button type="button" className={s.clear} onClick={clearCart}>
                Sepeti temizle
              </button>
            </div>
          </section>

          <aside className={s.summary} aria-labelledby="summary-title">
            <h2 id="summary-title" className={s.summaryTitle}>
              Sipariş özeti
            </h2>
            <TotalsRows {...totals} />
            <Link to="/odeme" className={`btn btn--primary btn--block ${s.checkout}`}>
              Ödemeye geç
              <ArrowRight aria-hidden="true" />
            </Link>
            <p className={s.secure}>
              <ShieldCheck strokeWidth={1.5} aria-hidden="true" />
              Güvenli ödeme · 14 gün içinde iade
            </p>
            <DemoNotice className={s.demo}>Demo sürümü: ödeme adımında gerçek ödeme alınmaz.</DemoNotice>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className={s.suggest} aria-labelledby="suggest-title">
          <SectionHeader id="suggest-title" eyebrow="Keşfet" title="Bunları da beğenebilirsin" />
          <ProductRail products={suggestions} label="Önerilen ürünler" />
        </section>
      )}
    </div>
  );
}
