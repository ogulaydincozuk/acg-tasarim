import { Link, Navigate } from 'react-router-dom';
import { ChevronRight, Heart, LogOut, Package } from 'lucide-react';
import { PRODUCT_BY_ID } from '../data/products';
import { useAccount } from '../context/AccountContext';
import { useShop } from '../context/ShopContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatPrice } from '../lib/format';
import { formatLongDate } from '../lib/pricing';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DemoNotice } from '../components/ui/DemoNotice';
import { Img } from '../components/ui/Img';
import s from './AccountPage.module.css';

export function AccountPage() {
  usePageTitle('Hesabım');
  const { user, orders, signOut, clearDemoData } = useAccount();
  const { favorites, notify } = useShop();
  if (!user) return <Navigate to="/giris?next=/hesap" replace />;

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('');

  return (
    <div className={`container ${s.page}`}>
      <Breadcrumbs items={[{ label: 'Ana sayfa', to: '/' }, { label: 'Hesabım' }]} />

      <header className={s.head}>
        <span className={s.avatar} aria-hidden="true">
          {initials || 'A'}
        </span>
        <div>
          <h1 className={s.title}>Merhaba, {user.name.split(/\s+/)[0]}</h1>
          <p className={s.email}>{user.email}</p>
        </div>
      </header>

      <DemoNotice className={s.demo}>Demo hesap: bilgiler yalnızca bu tarayıcıda saklanır, sunucuya gönderilmez.</DemoNotice>

      <div className={s.layout}>
        <nav className={s.side} aria-label="Hesap menüsü">
          <Link to="/hesap#siparisler" className={s.sideLink}>
            <Package strokeWidth={1.5} aria-hidden="true" /> Siparişlerim
            <ChevronRight aria-hidden="true" />
          </Link>
          <Link to="/favoriler" className={s.sideLink}>
            <Heart strokeWidth={1.5} aria-hidden="true" /> Favorilerim
            {favorites.length > 0 && <span className={s.pill}>{favorites.length}</span>}
            <ChevronRight aria-hidden="true" />
          </Link>
          <button type="button" className={s.sideLink} onClick={signOut}>
            <LogOut strokeWidth={1.5} aria-hidden="true" /> Çıkış yap
          </button>
          <button
            type="button"
            className={s.reset}
            onClick={() => {
              clearDemoData();
              notify({ title: 'Demo verileri temizlendi' });
            }}
          >
            Demo verilerini temizle
          </button>
        </nav>

        <section id="siparisler" className={s.orders} aria-labelledby="orders-title">
          <h2 id="orders-title" className={s.sectionTitle}>
            Siparişlerim
          </h2>

          {orders.length === 0 ? (
            <div className={s.empty}>
              <p className={s.emptyTitle}>Henüz siparişin yok</p>
              <p className={s.emptyText}>Sepete ürün ekleyip ödeme adımını deneyebilirsin (demo).</p>
              <Link to="/kategori/kaliplar" className="btn btn--primary">
                Alışverişe başla
              </Link>
            </div>
          ) : (
            <ul className={s.list}>
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={`/siparis-onayi/${o.id}`} className={s.order}>
                    <div className={s.orderTop}>
                      <div>
                        <p className={s.orderId}>{o.id}</p>
                        <p className={s.orderDate}>{formatLongDate(o.createdAt)}</p>
                      </div>
                      <span className={s.status}>Demo · Hazırlanıyor</span>
                    </div>
                    <div className={s.orderBottom}>
                      <ul className={s.thumbs} aria-hidden="true">
                        {o.lines.slice(0, 4).map((l) => {
                          const p = PRODUCT_BY_ID.get(l.id);
                          return p ? (
                            <li key={l.id}>
                              <Img image={p.image} alt="" ratio={1} sizes="48px" maxWidth={320} />
                            </li>
                          ) : null;
                        })}
                      </ul>
                      <p className={s.orderMeta}>
                        {o.lines.reduce((n, l) => n + l.qty, 0)} ürün
                      </p>
                      <p className={`${s.orderTotal} price`}>{formatPrice(o.total)}</p>
                      <ChevronRight aria-hidden="true" className={s.chev} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
