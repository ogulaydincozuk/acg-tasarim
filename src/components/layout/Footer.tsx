import { Link } from 'react-router-dom';
import { ChevronDown, Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { STORE } from '../../data/content';
import { useMediaQuery } from '../../hooks/useUi';
import { InstagramIcon, PinterestIcon, TiktokIcon, YoutubeIcon } from '../icons/SocialIcons';
import { Logo } from './Logo';
import s from './Footer.module.css';

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Alışveriş',
    links: [
      { label: 'Kalıplar', to: '/kategori/kaliplar' },
      { label: 'Hammaddeler', to: '/kategori/hammaddeler' },
      { label: 'Başlangıç setleri', to: '/kategori/setler' },
      { label: 'Yeni gelenler', to: '/kategori/yeni-gelenler' },
      { label: 'Kampanyalar', to: '/kategori/kampanyalar' },
    ],
  },
  {
    title: 'Yardım',
    links: [
      { label: 'Sipariş takibi', to: '/sayfa/siparis-takibi' },
      { label: 'Kargo & teslimat', to: '/sayfa/kargo-teslimat' },
      { label: 'İade & değişim', to: '/sayfa/iade-degisim' },
      { label: 'Sıkça sorulan sorular', to: '/sayfa/sss' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', to: '/sayfa/hakkimizda' },
      { label: 'Toptan & atölye satışı', to: '/sayfa/toptan' },
      { label: 'Özel kalıp üretimi', to: '/sayfa/ozel-kalip' },
    ],
  },
  {
    title: 'Üretim & Eğitim',
    links: [
      { label: 'Akademi', to: '/#akademi' },
      { label: 'Hesaplayıcılar', to: '/#hesaplayicilar' },
      { label: 'Mum yapım rehberi', to: '/rehber/mum-yapim-rehberi' },
      { label: 'Epoksiye başlangıç', to: '/rehber/epoksiye-baslangic' },
    ],
  },
];

/* PLACEHOLDER: güven mesajları gerçek hizmet koşullarıyla teyit edilmeli */
const TRUST = [
  { icon: Truck, title: 'Hızlı kargo', text: `${new Intl.NumberFormat('tr-TR').format(STORE.freeShippingThreshold)} TL üzeri ücretsiz` },
  { icon: ShieldCheck, title: 'Güvenli ödeme', text: '256-bit SSL ile korunur' },
  { icon: RotateCcw, title: 'Kolay iade', text: '14 gün içinde iade' },
  { icon: Headphones, title: 'Üretim desteği', text: 'Uzman ekipten yanıt' },
];

/* PLACEHOLDER: ödeme sağlayıcı logoları sözleşme sonrası resmi görsellerle değiştirilecek */
const PAYMENTS = ['VISA', 'Mastercard', 'troy', 'iyzico'];

/* PLACEHOLDER: sosyal medya hesap adresleri */
const SOCIAL = [
  { label: 'Instagram', icon: InstagramIcon, href: '#' },
  { label: 'YouTube', icon: YoutubeIcon, href: '#' },
  { label: 'TikTok', icon: TiktokIcon, href: '#' },
  { label: 'Pinterest', icon: PinterestIcon, href: '#' },
];

export function Footer() {
  const year = new Date().getFullYear();
  // Mobilde kolonlar akordeon olarak kapalı başlar
  const desktop = useMediaQuery('(min-width: 768px)');
  return (
    <footer className={s.footer}>
      <div className={s.trust}>
        <ul className="container">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon strokeWidth={1.5} aria-hidden="true" />
              <span>
                <strong>{title}</strong>
                <span>{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.main}>
        <div className={`container ${s.grid}`}>
          <div className={s.brand}>
            <Logo variant="badge" />
            <p>Kalıp, hammadde ve üretim bilgisi tek yerde — mum, sabun, kokulu taş ve epoksi üreticileri için.</p>
            <ul className={s.social}>
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a href={href} aria-label={label}>
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <details key={col.title} className={s.col} open={desktop}>
              <summary>
                {col.title}
                <ChevronDown aria-hidden="true" />
              </summary>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}

          <div className={s.contact}>
            <p className={s.colTitle}>İletişim</p>
            <ul>
              <li>{STORE.phone}</li>
              <li>
                <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
              </li>
              <li>{STORE.address}</li>
              <li className={s.hours}>{STORE.hours}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={`container ${s.bottomInner}`}>
          <p>© {year} ACG TASARIM. Tüm hakları saklıdır.</p>
          <ul className={s.legal}>
            <li>
              <Link to="/sayfa/kvkk">KVKK aydınlatma metni</Link>
            </li>
            <li>
              <Link to="/sayfa/gizlilik">Gizlilik politikası</Link>
            </li>
            <li>
              <Link to="/sayfa/cerez">Çerez politikası</Link>
            </li>
            <li>
              <Link to="/sayfa/mesafeli-satis">Mesafeli satış sözleşmesi</Link>
            </li>
          </ul>
          <ul className={s.payments} aria-label="Ödeme yöntemleri">
            {PAYMENTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
