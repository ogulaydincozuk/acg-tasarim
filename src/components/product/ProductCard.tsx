import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '../../data/types';
import { useShop } from '../../context/ShopContext';
import { cx, stockState } from '../../lib/format';
import { Img } from '../ui/Img';
import { Price, ProductBadge, Rating } from './ProductBits';
import s from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  sizes?: string;
  priority?: boolean;
  tone?: 'default' | 'onTint' | 'onDark';
}

export function ProductCard({ product: p, sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw', priority, tone = 'default' }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite, setQuickView } = useShop();
  const [hovered, setHovered] = useState(false);
  const fav = isFavorite(p.id);
  const href = `/urun/${p.slug}`;
  const stock = stockState(p.stock);
  const soldOut = p.stock <= 0;

  return (
    <article className={cx(s.card, tone === 'onTint' && s.onTint, tone === 'onDark' && s.onDark, soldOut && s.soldOut)} onMouseEnter={() => setHovered(true)}>
      <div className={s.media}>
        <Link to={href} className={s.mediaLink} tabIndex={-1} aria-hidden="true">
          <Img image={p.image} alt="" ratio={4 / 5} sizes={sizes} priority={priority} className={s.img} maxWidth={860} />
          {hovered && p.images[1] && <Img image={p.images[1]} alt="" ratio={4 / 5} sizes={sizes} className={s.imgAlt} maxWidth={860} />}
        </Link>

        <div className={s.badges}>
          <ProductBadge product={p} />
        </div>

        <button
          type="button"
          className={cx(s.fav, fav && s.favActive)}
          onClick={() => toggleFavorite(p.id)}
          aria-pressed={fav}
          aria-label={fav ? `${p.name} favorilerden çıkar` : `${p.name} favorilere ekle`}
        >
          <Heart strokeWidth={1.7} />
        </button>

        {/* Geniş kartta metinli butonlar; dar kartta (mobil, tablet listeleme) yuvarlak ikon butonlar.
            Etiket her durumda erişilebilir ad olarak kalır. */}
        <div className={s.actions}>
          <button type="button" className={cx('btn btn--light btn--sm', s.action)} onClick={() => setQuickView(p)} title="Hızlı incele">
            <Eye className={s.actionIcon} strokeWidth={1.7} aria-hidden="true" />
            <span className={s.actionLabel}>Hızlı incele</span>
          </button>
          <button
            type="button"
            className={cx('btn btn--primary btn--sm', s.action)}
            onClick={() => addToCart(p.id)}
            disabled={soldOut}
            title={soldOut ? 'Tükendi' : 'Sepete ekle'}
          >
            <ShoppingBag className={s.actionIcon} strokeWidth={1.7} aria-hidden="true" />
            <span className={s.actionLabel}>{soldOut ? 'Tükendi' : 'Sepete ekle'}</span>
          </button>
        </div>

        {!soldOut && (
          <button type="button" className={s.quickAdd} onClick={() => addToCart(p.id)} aria-label={`${p.name} sepete ekle`}>
            <Plus strokeWidth={1.8} />
          </button>
        )}
      </div>

      <div className={s.body}>
        <p className={s.meta}>{p.subcategory}</p>
        <h3 className={s.name}>
          <Link to={href}>{p.name}</Link>
        </h3>
        <p className={s.info}>
          {p.shortInfo}
          {stock.tone === 'low' && <span className={s.low}> · {stock.label}</span>}
        </p>
        <div className={s.foot}>
          <Price price={p.price} oldPrice={p.oldPrice} />
          <Rating value={p.rating} count={p.reviewCount} />
        </div>
      </div>
    </article>
  );
}
