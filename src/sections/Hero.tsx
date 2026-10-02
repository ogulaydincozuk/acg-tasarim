import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_BY_ID } from '../data/products';
import { POPULAR_SEARCHES } from '../data/content';
import { Img } from '../components/ui/Img';
import { formatPrice } from '../lib/format';
import { useMediaQuery } from '../hooks/useUi';
import s from './Hero.module.css';

export function Hero() {
  // Mobil/tablet: kolaj yerine tek, yatay kadraja uygun görsel.
  // Ana görsel kalıp + ondan çıkan ürünü birlikte gösterir (ACG kalıp üreticisidir, mum satıcısı değil).
  const compact = useMediaQuery('(max-width: 1023px)');
  const tagged = PRODUCT_BY_ID.get('p-001')!;
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={`container ${s.grid}`}>
        <div className={s.copy}>
          <span className="eyebrow">Kalıp · Hammadde · Üretim bilgisi</span>
          <h1 id="hero-title" className={s.title}>
            Hayalindeki tasarımı <em>üret</em>.
          </h1>
          <p className={s.lead}>Profesyonel üretim için kalıplar, hammaddeler ve ihtiyaç duyduğun malzemeler tek yerde.</p>
          <div className={s.ctas}>
            <Link to="/kategori/kaliplar" className="btn btn--primary">
              Ürünleri Keşfet
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link to="/kategori/setler" className="btn btn--secondary">
              Başlangıç Setlerini İncele
            </Link>
          </div>
          <div className={s.popular}>
            <span>Popüler:</span>
            <ul>
              {POPULAR_SEARCHES.slice(0, 3).map((term) => (
                <li key={term}>
                  <Link to={`/arama?q=${encodeURIComponent(term)}`}>{term}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={s.visual}>
          <span className={s.shape} aria-hidden="true" />
          <figure className={s.main}>
            <Img
              image="leafStones"
              alt="Açık mavi silikon yaprak kalıbı ve kalıptan çıkmış beyaz yaprak formlu ürünler, yanında mum"
              ratio={compact ? 16 / 10 : 4 / 5}
              sizes={compact ? '100vw' : '34vw'}
              priority
              maxWidth={compact ? 1400 : 1080}
            />
            <Link to={`/urun/${tagged.slug}`} className={s.tag}>
              <span className={s.tagDot} aria-hidden="true" />
              <span className={s.tagText}>
                <span className={s.tagName}>{tagged.name}</span>
                <span className="price">{formatPrice(tagged.price)}</span>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </figure>
          {!compact && (
            <div className={s.side}>
              <Img image="bubblePink" alt="Pudra pembe kabarcık mum ve kalp mum" ratio={1} sizes="(min-width: 1024px) 18vw, 30vw" priority maxWidth={640} className={s.sideImg} />
              <Img image="donutVase" alt="Halka formlu minimal vazo" ratio={1} sizes="(min-width: 1024px) 18vw, 30vw" priority maxWidth={640} className={s.sideImg} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
