import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { STORE } from '../../data/content';
import { MAIN_NAV, type NavItem } from '../../data/taxonomy';
import { useShop } from '../../context/ShopContext';
import { useAccount } from '../../context/AccountContext';
import { useHeaderVisibility } from '../../hooks/useUi';
import { cx } from '../../lib/format';
import { Img } from '../ui/Img';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import s from './Header.module.css';

export function AnnouncementBar() {
  return (
    <div className={s.announce}>
      <ul className="container">
        {STORE.announcement.map((item, i) => (
          <li key={item} className={i > 0 ? s.announceExtra : undefined}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaPanel({ item, id, onNavigate }: { item: NavItem; id: string; onNavigate: () => void }) {
  if (!item.mega) return null;
  const { columns, promo } = item.mega;
  return (
    <div id={id} className={s.mega}>
      <div className={cx('container', s.megaInner)}>
        {columns.map((col) => (
          <div key={col.title} className={s.megaCol}>
            <p className={s.megaTitle}>{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} onClick={onNavigate}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link to={promo.to} className={s.megaPromo} onClick={onNavigate}>
          <Img image={promo.image} alt="" ratio={16 / 10} sizes="320px" maxWidth={640} className={s.megaPromoImg} />
          <span className={s.megaPromoTitle}>
            {promo.title}
            <ArrowRight aria-hidden="true" />
          </span>
          <span className={s.megaPromoText}>{promo.text}</span>
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const { cartCount, favorites, setSearchOpen, setCartOpen } = useShop();
  const { user } = useAccount();
  const { hidden, scrolled } = useHeaderVisibility();
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    setOpenMega(null);
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!openMega) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenMega(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMega]);

  const scheduleMega = (label: string | null, delay = 140) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenMega(label), delay);
  };

  const headerHidden = hidden && !openMega && !menuOpen;
  // Yapışkan alt çubuklar (ör. mobil filtre) header'ın açık/gizli durumuna göre konumlansın
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', headerHidden);
  }, [headerHidden]);

  const active = MAIN_NAV.find((n) => n.label === openMega);

  return (
    <>
      <header
        className={cx(s.header, scrolled && s.scrolled, headerHidden && s.hidden)}
        onMouseLeave={() => scheduleMega(null, 180)}
      >
        <div className={cx('container', s.inner)}>
          <Logo />

          <nav className={s.nav} aria-label="Ana menü">
            <ul>
              {MAIN_NAV.map((item) => {
                const megaId = `mega-${item.to.split('/').pop()}`;
                const isOpen = openMega === item.label;
                return (
                  <li
                    key={item.label}
                    className={s.navItem}
                    onMouseEnter={() => scheduleMega(item.mega ? item.label : null, item.mega ? 140 : 80)}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => cx(s.navLink, (isActive || isOpen) && s.navActive, item.accent && s.navAccent)}
                    >
                      {item.label}
                    </NavLink>
                    {item.mega && (
                      <button
                        type="button"
                        className={cx(s.navToggle, isOpen && s.navToggleOpen)}
                        aria-expanded={isOpen}
                        aria-controls={megaId}
                        aria-label={`${item.label} alt menüsü`}
                        onClick={() => setOpenMega(isOpen ? null : item.label)}
                      >
                        <ChevronDown aria-hidden="true" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={s.tools}>
            <button type="button" className={s.tool} onClick={() => setSearchOpen(true)} aria-label="Ara">
              <Search strokeWidth={1.6} />
            </button>
            <Link to={user ? '/hesap' : '/giris'} className={cx(s.tool, s.desktopOnly)} aria-label={user ? `Hesabım (${user.name})` : 'Giriş yap'}>
              <User strokeWidth={1.6} />
              {user && <span className={s.dot} aria-hidden="true" />}
            </Link>
            <Link to="/favoriler" className={cx(s.tool, s.desktopOnly)} aria-label={`Favoriler (${favorites.length})`}>
              <Heart strokeWidth={1.6} />
              {favorites.length > 0 && <span className={s.count}>{favorites.length}</span>}
            </Link>
            <button type="button" className={s.tool} onClick={() => setCartOpen(true)} aria-label={`Sepet (${cartCount} ürün)`}>
              <ShoppingBag strokeWidth={1.6} />
              {cartCount > 0 && (
                <span key={cartCount} className={cx(s.count, s.countBump)}>
                  {cartCount}
                </span>
              )}
            </button>
            <button type="button" className={cx(s.tool, s.mobileOnly)} onClick={() => setMenuOpen(true)} aria-label="Menüyü aç" aria-expanded={menuOpen}>
              <Menu strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {active?.mega && (
          <MegaPanel item={active} id={`mega-${active.to.split('/').pop()}`} onNavigate={() => setOpenMega(null)} />
        )}
      </header>
      <div className={cx(s.scrim, openMega && s.scrimOn)} aria-hidden="true" onMouseEnter={() => scheduleMega(null, 60)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
