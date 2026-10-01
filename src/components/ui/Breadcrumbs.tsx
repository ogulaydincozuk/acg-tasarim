import { Link } from 'react-router-dom';
import s from './Breadcrumbs.module.css';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Sayfa konumu" className={s.root}>
      <ol>
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`}>
            {c.to && i < items.length - 1 ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
