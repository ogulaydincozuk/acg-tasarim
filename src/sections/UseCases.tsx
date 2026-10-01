import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gauge, Plus } from 'lucide-react';
import { USE_CASES } from '../data/content';
import { getProducts } from '../data/products';
import type { Product, Usage } from '../data/types';
import { useShop } from '../context/ShopContext';
import { Img } from '../components/ui/Img';
import { cx, formatPrice } from '../lib/format';
import s from './UseCases.module.css';

interface UseCasesProps {
  product: Product;
  usages: Usage[];
  eyebrow?: string;
  title?: string;
  /** Ürün detayında mini ürün kartı gösterilmez */
  showProduct?: boolean;
}

function ProductMini({ product, onAdd, className }: { product: Product; onAdd: () => void; className: string }) {
  return (
    <div className={className}>
      <Img image={product.image} alt="" ratio={1} sizes="64px" maxWidth={320} className={s.productImg} />
      <div className={s.productText}>
        <Link to={`/urun/${product.slug}`} className={s.productName}>
          {product.name}
        </Link>
        <span className="price">{formatPrice(product.price)}</span>
      </div>
      <button type="button" className={s.productAdd} onClick={onAdd} aria-label={`${product.name} sepete ekle`}>
        <Plus strokeWidth={1.8} />
      </button>
    </div>
  );
}

/**
 * "Bu kalıpla ne yapabilirsin?" — ACG'nin farklılaşma alanı.
 * Kalıp → üretim türü → gereken malzemeler akışını tek blokta bağlar.
 */
export function UseCases({ product, usages, eyebrow = 'ACG’ye özel', title = 'Bu kalıpla ne yapabilirsin?', showProduct = true }: UseCasesProps) {
  const cases = usages.map((u) => USE_CASES[u]).filter(Boolean);
  const [active, setActive] = useState(0);
  const { addToCart, addManyToCart } = useShop();
  const uid = useId();
  const current = cases[active];
  if (!current) return null;

  return (
    <div className={s.root}>
      <div className={s.visual}>
        <Img
          key={current.image}
          image={current.image}
          alt={`${product.name} ile üretilmiş ${current.title.toLocaleLowerCase('tr')} örneği`}
          ratio={4 / 5}
          sizes="(min-width: 1024px) 44vw, 100vw"
          className={s.image}
          maxWidth={1080}
        />
        <span className={s.caption}>
          Örnek üretim <ArrowRight aria-hidden="true" /> {current.title}
        </span>
        {showProduct && <ProductMini product={product} onAdd={() => addToCart(product.id)} className={s.product} />}
      </div>

      <div className={s.content}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className={s.title}>{title}</h2>
        <p className={s.lead}>Tek kalıp, birden fazla üretim. Bir kullanım seç; adımları ve gereken malzemeleri gör.</p>
        {showProduct && <ProductMini product={product} onAdd={() => addToCart(product.id)} className={s.productMobile} />}

        <ul className={s.list}>
          {cases.map((c, i) => {
            const open = i === active;
            const materials = getProducts(c.materialIds);
            return (
              <li key={c.usage} className={cx(s.item, open && s.itemOpen)}>
                <h3>
                  <button
                    type="button"
                    className={s.trigger}
                    aria-expanded={open}
                    aria-controls={`${uid}-${c.usage}`}
                    onClick={() => setActive(i)}
                  >
                    <span className={s.index}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={s.itemTitle}>{c.title}</span>
                    <span className={s.plus} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${uid}-${c.usage}`} className={s.panel} hidden={!open}>
                  {open && (
                    <Img image={c.image} alt="" ratio={4 / 3} sizes="100vw" maxWidth={860} className={s.panelImg} />
                  )}
                  <p className={s.summary}>{c.summary}</p>
                  <p className={s.meta}>
                    <span>
                      <Clock aria-hidden="true" /> {c.duration}
                    </span>
                    <span>
                      <Gauge aria-hidden="true" /> {c.level}
                    </span>
                  </p>
                  <p className={s.needTitle}>Kullanılan malzemeler</p>
                  <ul className={s.materials}>
                    {materials.map((m) => (
                      <li key={m.id}>
                        <Link to={`/urun/${m.slug}`} className={s.material}>
                          <Img image={m.image} alt="" ratio={1} sizes="44px" maxWidth={320} className={s.materialImg} />
                          <span className={s.materialName}>{m.name}</span>
                          <span className={cx(s.materialPrice, 'price')}>{formatPrice(m.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className={s.actions}>
                    <Link to={`/kategori/hammaddeler?kullanim=${c.usage}`} className="btn btn--primary btn--md">
                      Kullanılan malzemeleri keşfet
                      <ArrowRight aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className="btn btn--secondary btn--md"
                      onClick={() => addManyToCart(materials.map((m) => m.id))}
                    >
                      Tümünü sepete ekle
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
