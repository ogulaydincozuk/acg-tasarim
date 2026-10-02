import { PRODUCT_BY_ID } from '../../data/products';
import { STORE } from '../../data/content';
import { formatPrice } from '../../lib/format';
import { Img } from '../ui/Img';
import s from './OrderSummary.module.css';

export interface SummaryLine {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export function TotalsRows({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <>
      <dl className={s.totals}>
        <div>
          <dt>Ara toplam</dt>
          <dd className="price">{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Kargo</dt>
          <dd className="price">{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</dd>
        </div>
        <div className={s.grand}>
          <dt>
            Toplam <span>KDV dahil</span>
          </dt>
          <dd className="price">{formatPrice(total)}</dd>
        </div>
      </dl>
      {shipping > 0 && (
        <p className={s.note}>{new Intl.NumberFormat('tr-TR').format(STORE.freeShippingThreshold)} TL ve üzeri siparişlerde kargo ücretsiz.</p>
      )}
    </>
  );
}

/** Sipariş kalemleri + toplamlar (ödeme ve sipariş onayı sayfalarında ortak). */
export function OrderSummary({ lines, subtotal, shipping, total }: { lines: SummaryLine[]; subtotal: number; shipping: number; total: number }) {
  return (
    <div>
      <ul className={s.lines}>
        {lines.map((l) => {
          const product = PRODUCT_BY_ID.get(l.id);
          return (
            <li key={l.id} className={s.line}>
              <span className={s.thumb}>
                {product && <Img image={product.image} alt="" ratio={1} sizes="64px" maxWidth={320} />}
                <span className={s.qty} aria-hidden="true">
                  {l.qty}
                </span>
              </span>
              <span className={s.name}>
                {l.name}
                <span className="visually-hidden">, {l.qty} adet</span>
              </span>
              <span className={`${s.price} price`}>{formatPrice(l.price * l.qty)}</span>
            </li>
          );
        })}
      </ul>
      <TotalsRows subtotal={subtotal} shipping={shipping} total={total} />
    </div>
  );
}
