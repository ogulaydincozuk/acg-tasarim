import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { GUIDES } from '../data/content';
import { getProducts } from '../data/products';
import type { Guide } from '../data/types';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Img } from '../components/ui/Img';
import { cx } from '../lib/format';
import s from './Academy.module.css';

/** Rehber kartı: içerik ↔ ürün bağlantısını kartın içinde gösterir. */
export function GuideCard({ guide, featured }: { guide: Guide; featured?: boolean }) {
  const products = getProducts(guide.productIds);
  const href = `/rehber/${guide.slug}`;
  return (
    <article className={cx(s.card, featured && s.featured)}>
      <Link to={href} className={s.media} tabIndex={-1} aria-hidden="true">
        <Img
          image={guide.image}
          alt=""
          ratio={featured ? 4 / 3 : 1}
          sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 14vw, 30vw'}
          maxWidth={featured ? 1080 : 640}
        />
      </Link>
      <div className={s.body}>
        <p className={s.meta}>
          <span>{guide.level}</span>
          <span className={s.sep} aria-hidden="true" />
          <span className={s.time}>
            <Clock aria-hidden="true" /> {guide.readTime} okuma
          </span>
        </p>
        <h3 className={s.title}>
          <Link to={href}>{guide.title}</Link>
        </h3>
        <p className={s.excerpt}>{guide.excerpt}</p>
        <div className={s.products}>
          <ul className={s.thumbs} aria-hidden="true">
            {products.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Img image={p.image} alt="" ratio={1} sizes="32px" maxWidth={320} />
              </li>
            ))}
          </ul>
          <Link to={`${href}#urunler`} className={s.productsLink}>
            Rehberdeki {products.length} ürün
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Academy() {
  const [first, ...rest] = GUIDES;
  return (
    <section className={`section section--divided ${s.section}`} id="akademi" aria-labelledby="academy-title">
      <div className="container">
        <SectionHeader
          id="academy-title"
          eyebrow="ACG Akademi"
          title="Üretmeyi öğren"
          description="Adım adım rehberler; her rehberde kullanılan ürünlere tek tıkla ulaş."
          action={{ label: 'Tüm rehberler', to: '/rehber/mum-yapim-rehberi' }}
        />
        <div className={s.grid}>
          <GuideCard guide={first} featured />
          <div className={s.list}>
            {rest.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
