import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Heart, Package, Search, User } from 'lucide-react';
import { STORE } from '../../data/content';
import { CRAFT_CATEGORIES, MAIN_NAV } from '../../data/taxonomy';
import { useShop } from '../../context/ShopContext';
import { useAccount } from '../../context/AccountContext';
import { Drawer } from '../ui/Drawer';
import { Img } from '../ui/Img';
import s from './MobileMenu.module.css';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setSearchOpen, favorites } = useShop();
  const { user } = useAccount();

  return (
    <Drawer open={open} onClose={onClose} title="Menü" side="right" width={420}>
      <div className={s.wrap}>
        <button
          type="button"
          className={s.search}
          onClick={() => {
            onClose();
            setSearchOpen(true);
          }}
        >
          <Search strokeWidth={1.6} aria-hidden="true" />
          Kalıp, hammadde veya set ara
        </button>

        <nav aria-label="Mobil ana menü">
          <ul className={s.list}>
            {MAIN_NAV.map((item) =>
              item.mega ? (
                <li key={item.label}>
                  <details className={s.group}>
                    <summary className={s.row}>
                      {item.label}
                      <ChevronDown aria-hidden="true" className={s.chev} />
                    </summary>
                    <div className={s.sub}>
                      {item.mega.columns.map((col) => (
                        <div key={col.title}>
                          <p className={s.subTitle}>{col.title}</p>
                          <ul>
                            {col.links.map((l) => (
                              <li key={l.label}>
                                <Link to={l.to} onClick={onClose}>
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </li>
              ) : (
                <li key={item.label}>
                  <Link to={item.to} className={s.row} onClick={onClose}>
                    <span className={item.accent ? s.accent : undefined}>{item.label}</span>
                    <ChevronRight aria-hidden="true" className={s.chev} />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <section className={s.crafts} aria-labelledby="mm-crafts">
          <p id="mm-crafts" className={s.subTitle}>
            Ne üretmek istiyorsun?
          </p>
          <ul>
            {CRAFT_CATEGORIES.map((c) => (
              <li key={c.usage}>
                <Link to={`/kategori/${c.usage}`} onClick={onClose} className={s.craft}>
                  <Img image={c.image} alt="" ratio={1} sizes="96px" maxWidth={320} className={s.craftImg} />
                  <span>{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ul className={s.account}>
          <li>
            <Link to={user ? '/hesap' : '/giris'} onClick={onClose}>
              <User strokeWidth={1.6} aria-hidden="true" /> {user ? `Hesabım · ${user.name.split(/\s+/)[0]}` : 'Giriş yap / Üye ol'}
            </Link>
          </li>
          <li>
            <Link to="/favoriler" onClick={onClose}>
              <Heart strokeWidth={1.6} aria-hidden="true" /> Favorilerim {favorites.length > 0 && <span className={s.badge}>{favorites.length}</span>}
            </Link>
          </li>
          <li>
            <Link to={user ? '/hesap#siparisler' : '/giris?next=/hesap'} onClick={onClose}>
              <Package strokeWidth={1.6} aria-hidden="true" /> Siparişlerim
            </Link>
          </li>
        </ul>

        <p className={s.contact}>
          {STORE.hours}
          <br />
          {STORE.email}
        </p>
      </div>
    </Drawer>
  );
}
