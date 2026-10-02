import { Link } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { STARTER_SETS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Img } from '../components/ui/Img';
import { Price } from '../components/product/ProductBits';
import s from './StarterSets.module.css';

export function StarterSets() {
  const { addToCart } = useShop();
  return (
    <section className={`section section--band ${s.band}`} aria-labelledby="sets-title">
      <div className="container">
        <SectionHeader
          id="sets-title"
          eyebrow="Yeni başlayanlar için"
          title="Başlangıç setleri"
          description="İlk üretimin için gereken her şey tek kutuda; adım adım rehber kartıyla."
          action={{ label: 'Tüm setler', to: '/kategori/setler' }}
        />
        <ul className={`${s.grid} ${STARTER_SETS.length <= 2 ? s.wide : ''} no-scrollbar`}>
          {STARTER_SETS.map((set) => (
            <li key={set.id} className={s.card}>
              <Link to={`/urun/${set.slug}`} className={s.media} tabIndex={-1} aria-hidden="true">
                <Img image={set.image} alt="" ratio={4 / 3} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 80vw" maxWidth={860} />
              </Link>
              <div className={s.body}>
                <p className={s.meta}>
                  <span>{set.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{set.yields}</span>
                </p>
                <h3 className={s.name}>
                  <Link to={`/urun/${set.slug}`}>{set.name}</Link>
                </h3>
                <ul className={s.contents} aria-label="Set içeriği">
                  {set.contents!.slice(0, 4).map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                  {set.contents!.length > 4 && <li className={s.more}>+{set.contents!.length - 4} parça daha</li>}
                </ul>
                <div className={s.foot}>
                  <Price price={set.price} oldPrice={set.oldPrice} />
                  <div className={s.actions}>
                    <Link to={`/urun/${set.slug}`} className="btn btn--secondary btn--sm">
                      Seti incele
                    </Link>
                    <button type="button" className={s.add} onClick={() => addToCart(set.id)} aria-label={`${set.name} sepete ekle`}>
                      <ShoppingBag strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
