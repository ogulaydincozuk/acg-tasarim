import { STORE } from '../data/content';

/** Sepet/sipariş toplamları. Fiyatlar KDV dahildir. */
export function orderTotals(subtotal: number) {
  const shipping = subtotal <= 0 || subtotal >= STORE.freeShippingThreshold ? 0 : STORE.shippingFee;
  return { subtotal, shipping, total: subtotal + shipping };
}

/** Hafta sonlarını atlayarak iş günü ekler (tahmini teslimat için). */
export function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left -= 1;
  }
  return d;
}

const dayFormat = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });
const longFormat = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDay = (d: Date) => dayFormat.format(d);
export const formatLongDate = (iso: string) => longFormat.format(new Date(iso));

/** DEMO sipariş numarası — gerçek sipariş sistemiyle ilgisi yoktur. */
export function newOrderId() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `ACG-${new Date().getFullYear()}-${n}`;
}
