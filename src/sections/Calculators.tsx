import { useId, useMemo, useState } from 'react';
import { Calculator, Droplets, Scale, Tag } from 'lucide-react';
import { CALCULATORS } from '../data/content';
import type { CalculatorMeta } from '../data/types';
import { SectionHeader } from '../components/ui/SectionHeader';
import { cx, formatPrice } from '../lib/format';
import s from './Calculators.module.css';

/*
 * V1: UI önizlemesi. Formüller kasıtlı olarak basit ve yaklaşıktır
 * (ör. erimiş soya wax yoğunluğu ≈ 0,86 g/ml). Gerçek hesaplama motoru,
 * ürün bazlı yoğunluk/esans kapasitesi verisiyle V2'de bağlanacak.
 */

const ICONS: Record<CalculatorMeta['id'], typeof Calculator> = {
  maliyet: Calculator,
  esans: Droplets,
  wax: Scale,
  satis: Tag,
};

type Values = Record<string, number>;

interface FieldDef {
  key: string;
  label: string;
  unit: string;
  step?: number;
}

const FIELDS: Record<CalculatorMeta['id'], { fields: FieldDef[]; defaults: Values }> = {
  maliyet: {
    fields: [
      { key: 'waxPrice', label: 'Wax fiyatı', unit: 'TL/kg' },
      { key: 'waxGram', label: 'Mum başına wax', unit: 'g' },
      { key: 'ratio', label: 'Esans oranı', unit: '%' },
      { key: 'oilPrice', label: 'Esans fiyatı', unit: 'TL/50 ml' },
      { key: 'extras', label: 'Fitil + etiket + kap', unit: 'TL/adet' },
    ],
    defaults: { waxPrice: 420, waxGram: 180, ratio: 8, oilPrice: 185, extras: 28 },
  },
  esans: {
    fields: [
      { key: 'wax', label: 'Wax miktarı', unit: 'g' },
      { key: 'ratio', label: 'Esans oranı', unit: '%' },
    ],
    defaults: { wax: 1000, ratio: 8 },
  },
  wax: {
    fields: [
      { key: 'volume', label: 'Kalıp hacmi', unit: 'ml' },
      { key: 'count', label: 'Adet', unit: 'adet' },
      { key: 'ratio', label: 'Esans oranı', unit: '%' },
    ],
    defaults: { volume: 210, count: 10, ratio: 8 },
  },
  satis: {
    fields: [
      { key: 'cost', label: 'Birim maliyet', unit: 'TL' },
      { key: 'markup', label: 'Kâr oranı', unit: '%' },
      { key: 'commission', label: 'Pazaryeri komisyonu', unit: '%' },
      { key: 'vat', label: 'KDV', unit: '%' },
    ],
    defaults: { cost: 115, markup: 80, commission: 0, vat: 20 },
  },
};

const fmt = (n: number, digits = 0) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: digits }).format(n);

function compute(id: CalculatorMeta['id'], v: Values): { main: string; mainLabel: string; rows: [string, string][] } {
  switch (id) {
    case 'maliyet': {
      const wax = (v.waxGram / 1000) * v.waxPrice;
      const oil = ((v.waxGram * v.ratio) / 100) * (v.oilPrice / 50);
      const total = wax + oil + v.extras;
      return {
        main: formatPrice(total),
        mainLabel: 'Mum başına yaklaşık maliyet',
        rows: [
          ['Wax', formatPrice(wax)],
          ['Esans', formatPrice(oil)],
          ['Fitil, etiket, kap', formatPrice(v.extras)],
        ],
      };
    }
    case 'esans': {
      const grams = (v.wax * v.ratio) / 100;
      return {
        main: `${fmt(grams, 1)} g`,
        mainLabel: 'Gereken esans',
        rows: [
          ['Yaklaşık hacim', `${fmt(grams, 1)} ml`],
          ['50 ml şişe karşılığı', `${fmt(grams / 50, 1)} şişe`],
          ['Ekleme sıcaklığı', '≈ 60–65 °C'],
        ],
      };
    }
    case 'wax': {
      const perUnit = v.volume * 0.86;
      const total = perUnit * v.count * 1.05; // %5 fire payı
      return {
        main: `${fmt(total / 1000, 2)} kg`,
        mainLabel: 'Gereken toplam wax (%5 fire dahil)',
        rows: [
          ['Adet başı wax', `${fmt(perUnit)} g`],
          ['Toplam esans', `${fmt((total * v.ratio) / 100)} g`],
          ['1 kg paket', `${fmt(Math.ceil(total / 1000))} adet`],
        ],
      };
    }
    case 'satis': {
      const net = v.cost * (1 + v.markup / 100);
      const beforeTax = v.commission < 100 ? net / (1 - v.commission / 100) : net;
      const price = beforeTax * (1 + v.vat / 100);
      return {
        main: formatPrice(price),
        mainLabel: 'Önerilen satış fiyatı (KDV dahil)',
        rows: [
          ['Adet başı kâr', formatPrice(net - v.cost)],
          ['Komisyon payı', formatPrice(beforeTax - net)],
          ['KDV tutarı', formatPrice(price - beforeTax)],
        ],
      };
    }
  }
}

export function Calculators() {
  const [activeId, setActiveId] = useState<CalculatorMeta['id']>('maliyet');
  const [values, setValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(Object.entries(FIELDS).map(([k, f]) => [k, { ...f.defaults }])),
  );
  const uid = useId();
  const active = CALCULATORS.find((c) => c.id === activeId)!;
  const current = values[activeId];
  const result = useMemo(() => compute(activeId, current), [activeId, current]);

  const update = (key: string, raw: string) => {
    const n = Number(raw.replace(',', '.'));
    setValues((all) => ({ ...all, [activeId]: { ...all[activeId], [key]: Number.isFinite(n) ? Math.max(0, n) : 0 } }));
  };

  return (
    <section className="section" id="hesaplayicilar" aria-labelledby="calc-title">
      <div className="container">
        <SectionHeader
          id="calc-title"
          eyebrow="Üretim araçları"
          title="Üretimini hesapla"
          description="Maliyetini, esans ve wax ihtiyacını, satış fiyatını saniyeler içinde gör."
        />
        <div className={s.wrap}>
          <div className={cx(s.tabs, 'no-scrollbar')} role="tablist" aria-label="Hesaplayıcılar" aria-orientation="vertical">
            {CALCULATORS.map((c) => {
              const Icon = ICONS[c.id];
              const selected = c.id === activeId;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={cx(s.tab, selected && s.tabActive)}
                  onClick={() => setActiveId(c.id)}
                  onKeyDown={(e) => {
                    const i = CALCULATORS.findIndex((x) => x.id === activeId);
                    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
                    if (!dir) return;
                    e.preventDefault();
                    const next = CALCULATORS[(i + dir + CALCULATORS.length) % CALCULATORS.length];
                    setActiveId(next.id);
                    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                  }}
                >
                  <span className={s.tabIcon}>
                    <Icon strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className={s.tabText}>
                    <span className={s.tabName}>{c.name}</span>
                    <span className={s.tabDesc}>{c.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${activeId}`} className={s.panel}>
            <div className={s.form}>
              <p className={s.panelTitle}>{active.name}</p>
              <div className={s.fields}>
                {FIELDS[activeId].fields.map((f) => (
                  <label key={f.key} className={s.field}>
                    <span className={s.fieldLabel}>{f.label}</span>
                    <span className={s.inputWrap}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={f.step ?? 1}
                        value={current[f.key]}
                        onChange={(e) => update(f.key, e.target.value)}
                      />
                      <span className={s.unit}>{f.unit}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className={s.result} aria-live="polite">
              <p className={s.resultLabel}>{result.mainLabel}</p>
              <p className={cx(s.resultValue, 'price')}>{result.main}</p>
              <dl className={s.rows}>
                {result.rows.map(([k, val]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className="price">{val}</dd>
                  </div>
                ))}
              </dl>
              <p className={s.note}>Önizleme: sonuçlar yaklaşık değerlerdir.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
