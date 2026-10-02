import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, CreditCard, Landmark, MapPin, Truck } from 'lucide-react';
import { useAccount } from '../context/AccountContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { addBusinessDays, formatDay, formatLongDate } from '../lib/pricing';
import { DemoNotice } from '../components/ui/DemoNotice';
import { OrderSummary } from '../components/cart/OrderSummary';
import { NotFoundPage } from './NotFoundPage';
import s from './OrderConfirmationPage.module.css';

export function OrderConfirmationPage() {
  const { id } = useParams();
  const { user, orders } = useAccount();
  const order = orders.find((o) => o.id === id);
  usePageTitle(order ? 'Siparişin alındı' : 'Sayfa bulunamadı');
  if (!order) return <NotFoundPage />;

  const created = new Date(order.createdAt);
  const from = addBusinessDays(created, 2);
  const to = addBusinessDays(created, 4);
  const first = order.address.fullName.split(/\s+/)[0];

  return (
    <div className={`container ${s.page}`}>
      <header className={s.head}>
        <span className={s.badge} aria-hidden="true">
          <Check strokeWidth={2.4} />
        </span>
        <h1 className={s.title}>Siparişin alındı</h1>
        <p className={s.lead}>
          Teşekkürler {first}. Sipariş numaran <strong className={s.number}>{order.id}</strong>
        </p>
        <p className={s.date}>{formatLongDate(order.createdAt)}</p>
      </header>

      <DemoNotice className={s.demo}>
        Bu bir demo siparişidir: ödeme alınmadı, ürün gönderilmeyecek ve e-posta yollanmadı. Gerçek sürümde burada sipariş onayı ve takip bilgisi yer alır.
      </DemoNotice>

      <div className={s.layout}>
        <div className={s.details}>
          <section className={s.block} aria-labelledby="oc-delivery">
            <h2 id="oc-delivery">
              <Truck strokeWidth={1.5} aria-hidden="true" /> Tahmini teslimat
            </h2>
            <p className={s.strong}>
              {formatDay(from)} – {formatDay(to)}
            </p>
            <p className={s.muted}>2–4 iş günü içinde kargoya verilir ve teslim edilir (örnek süre).</p>
          </section>

          <section className={s.block} aria-labelledby="oc-address">
            <h2 id="oc-address">
              <MapPin strokeWidth={1.5} aria-hidden="true" /> Teslimat adresi
            </h2>
            <address className={s.address}>
              <strong>{order.address.fullName}</strong>
              <span>{order.address.address}</span>
              <span>
                {order.address.postalCode} {order.address.district} / {order.address.city}
              </span>
              <span>{order.address.phone}</span>
            </address>
          </section>

          <section className={s.block} aria-labelledby="oc-payment">
            <h2 id="oc-payment">
              {order.payment === 'kart' ? <CreditCard strokeWidth={1.5} aria-hidden="true" /> : <Landmark strokeWidth={1.5} aria-hidden="true" />} Ödeme yöntemi
            </h2>
            <p className={s.strong}>{order.payment === 'kart' ? 'Kredi / banka kartı' : 'Havale / EFT'}</p>
            <p className={s.muted}>Demo ödeme · tahsilat yapılmadı</p>
          </section>
        </div>

        <aside className={s.summary} aria-labelledby="oc-summary">
          <h2 id="oc-summary" className={s.summaryTitle}>
            Sipariş özeti
          </h2>
          <OrderSummary lines={order.lines} subtotal={order.subtotal} shipping={order.shipping} total={order.total} />
        </aside>
      </div>

      <div className={s.actions}>
        <Link to="/kategori/kaliplar" className="btn btn--primary">
          Alışverişe devam et
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link to={user ? '/hesap#siparisler' : '/giris?next=/hesap'} className="btn btn--secondary">
          {user ? 'Siparişlerim' : 'Giriş yap'}
        </Link>
      </div>
    </div>
  );
}
