import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CREATIONS } from '../data/content';
import { PRODUCT_BY_ID } from '../data/products';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Img } from '../components/ui/Img';
import { InstagramIcon } from '../components/icons/SocialIcons';
import { cx } from '../lib/format';
import s from './Creations.module.css';

/**
 * ACG ile Üretenler.
 * PLACEHOLDER: Görseller stok fotoğraftır; gerçek müşteri paylaşımları izinle
 * eklenene kadar kullanıcı adı / yorum GÖSTERİLMEZ. Her kart, üretimde kullanılan
 * ürüne bağlanır (alışverişe dönüş).
 */
export function Creations() {
  return (
    <section className="section" aria-labelledby="creations-title">
      <div className="container">
        <div className={s.head}>
          <SectionHeader
            id="creations-title"
            eyebrow="Topluluk"
            title="ACG ile üretenler"
            description="Kalıplarımız ve hammaddelerimizle üretilen çalışmalar. Sen de #acgileuret etiketiyle paylaş, burada yer al."
            className={s.header}
          />
          {/* PLACEHOLDER: resmi Instagram hesabı bağlantısı */}
          <a href="#" className="btn btn--secondary btn--md">
            <InstagramIcon />
            Instagram’da takip et
          </a>
        </div>
        <ul className={s.grid}>
          {CREATIONS.map((c, i) => {
            const product = PRODUCT_BY_ID.get(c.productId);
            if (!product) return null;
            return (
              <li key={c.id} className={cx(s.tile, i === 0 && s.big)}>
                <Link to={`/urun/${product.slug}`} className={s.link}>
                  <Img image={c.image} alt={`${product.name} ile üretilmiş çalışma`} ratio={i === 0 ? undefined : 1} sizes={i === 0 ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 20vw, 50vw'} className={s.img} maxWidth={860} />
                  <span className={s.overlay}>
                    <span className={s.used}>Kullanılan ürün</span>
                    <span className={s.product}>
                      {product.name}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
