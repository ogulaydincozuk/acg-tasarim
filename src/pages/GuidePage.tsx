import { Link, useParams } from 'react-router-dom';
import { Clock, ShoppingBag } from 'lucide-react';
import { GUIDES, USE_CASES } from '../data/content';
import { getProducts } from '../data/products';
import { USAGE_LABEL } from '../data/taxonomy';
import { useShop } from '../context/ShopContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatPrice } from '../lib/format';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Img } from '../components/ui/Img';
import { ProductGrid } from '../components/product/ProductGrid';
import { GuideCard } from '../sections/Academy';
import { NotFoundPage } from './NotFoundPage';
import s from './GuidePage.module.css';

/*
 * PLACEHOLDER: Rehber metinleri örnek iskelettir. Gerçek eğitim içerikleri
 * (CMS'ten) geldiğinde aynı yerleşim kullanılacak; ürün bağlantıları korunur.
 */
const STEPS = [
  { title: 'Hazırlık', text: 'Çalışma alanını temizle, malzemeleri tart ve kalıbı düz bir zemine yerleştir.' },
  { title: 'Eritme & karıştırma', text: 'Hammaddeyi önerilen sıcaklığa getir; renk ve kokuyu doğru sırayla ekle.' },
  { title: 'Döküm', text: 'Kalıba yavaş ve sabit bir akışla dök; hava kabarcıklarını yüzeyden al.' },
  { title: 'Dinlendirme & çıkarma', text: 'Önerilen süre boyunca beklet, ardından kalıbı esneterek ürünü çıkar.' },
];

export function GuidePage() {
  const { slug } = useParams();
  const guide = GUIDES.find((g) => g.slug === slug);
  const { addToCart } = useShop();
  usePageTitle(guide?.title);
  if (!guide) return <NotFoundPage />;

  const products = getProducts(guide.productIds);
  const total = products.reduce((sum, p) => sum + p.price, 0);
  const others = GUIDES.filter((g) => g.id !== guide.id);

  return (
    <div className={`container ${s.page}`}>
      <Breadcrumbs items={[{ label: 'Ana sayfa', to: '/' }, { label: 'Akademi', to: '/#akademi' }, { label: guide.title }]} />

      <header className={s.head}>
        <div className={s.headText}>
          <p className={s.meta}>
            <span>{USAGE_LABEL[guide.usage]}</span>
            <span aria-hidden="true">·</span>
            <span>{guide.level}</span>
            <span aria-hidden="true">·</span>
            <span className={s.time}>
              <Clock aria-hidden="true" /> {guide.readTime} okuma
            </span>
          </p>
          <h1 className={s.title}>{guide.title}</h1>
          <p className={s.lead}>{guide.excerpt}</p>
        </div>
        <Img image={guide.image} alt="" ratio={16 / 9} sizes="(min-width: 1024px) 60vw, 100vw" priority className={s.cover} maxWidth={1400} />
      </header>

      <div className={s.layout}>
        <article className={s.article}>
          <p className={s.intro}>{USE_CASES[guide.usage].summary}</p>
          <ol className={s.steps}>
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className={s.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <aside className={s.kit} aria-labelledby="kit-title">
          <p id="kit-title" className={s.kitTitle}>
            Bu rehberde kullanılanlar
          </p>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <Link to={`/urun/${p.slug}`} className={s.kitItem}>
                  <Img image={p.image} alt="" ratio={1} sizes="52px" maxWidth={320} className={s.kitImg} />
                  <span className={s.kitName}>{p.name}</span>
                  <span className="price">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={s.kitTotal}>
            <span>Toplam</span>
            <strong className="price">{formatPrice(total)}</strong>
          </div>
          <button type="button" className="btn btn--primary btn--block" onClick={() => products.forEach((p) => p.stock > 0 && addToCart(p.id))}>
            <ShoppingBag aria-hidden="true" />
            Tümünü sepete ekle
          </button>
        </aside>
      </div>

      <section id="urunler" className={s.section} aria-labelledby="guide-products">
        <h2 id="guide-products" className={s.sectionTitle}>
          Rehberdeki ürünler
        </h2>
        <ProductGrid products={products} />
      </section>

      <section className={s.section} aria-labelledby="more-guides">
        <h2 id="more-guides" className={s.sectionTitle}>
          Diğer rehberler
        </h2>
        <div className={s.more}>
          {others.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
