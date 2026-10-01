import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CRAFT_CATEGORIES } from '../data/taxonomy';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Img } from '../components/ui/Img';
import s from './CategoryDiscovery.module.css';

export function CategoryDiscovery() {
  return (
    <section className="section" aria-labelledby="craft-title" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHeader
          id="craft-title"
          eyebrow="Kategoriler"
          title="Ne üretmek istiyorsun?"
          description="Üretim türünü seç; o iş için gereken kalıp, hammadde ve setleri tek sayfada gör."
        />
        <ul className={s.grid}>
          {CRAFT_CATEGORIES.map((c, i) => (
            <li key={c.usage}>
              <Link to={`/kategori/${c.usage}`} className={s.card}>
                <Img image={c.image} alt="" ratio={3 / 4} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 46vw" className={s.img} priority={i < 3} maxWidth={860} />
                <span className={s.label}>
                  <span className={s.name}>{c.name}</span>
                  <ArrowUpRight aria-hidden="true" className={s.icon} />
                </span>
                <span className={s.hint}>{c.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
