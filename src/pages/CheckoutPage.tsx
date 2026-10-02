import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CreditCard, Landmark, Lock } from 'lucide-react';
import { CITIES } from '../data/turkey';
import { PRODUCT_BY_ID } from '../data/products';
import { useAccount, type OrderAddress, type PaymentMethod } from '../context/AccountContext';
import { useShop } from '../context/ShopContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { cx, formatPrice } from '../lib/format';
import { newOrderId, orderTotals } from '../lib/pricing';
import { DemoNotice } from '../components/ui/DemoNotice';
import { Field, SelectField, TextAreaField } from '../components/ui/Field';
import { OrderSummary, type SummaryLine } from '../components/cart/OrderSummary';
import s from './CheckoutPage.module.css';

interface FormState extends OrderAddress {
  email: string;
  terms: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (v: string) => v.replace(/\D/g, '');

/** Cep telefonu: 05xx xxx xx xx / 5xx xxx xx xx */
function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!EMAIL.test(f.email.trim())) e.email = 'Geçerli bir e-posta adresi yaz.';
  if (f.fullName.trim().split(/\s+/).filter(Boolean).length < 2) e.fullName = 'Ad ve soyadını yaz.';
  const phone = digits(f.phone);
  if (!(phone.length === 10 && phone.startsWith('5')) && !(phone.length === 11 && phone.startsWith('05'))) e.phone = 'Telefonu 5xx xxx xx xx biçiminde yaz.';
  if (!f.city) e.city = 'İl seç.';
  if (f.district.trim().length < 2) e.district = 'İlçeyi yaz.';
  if (digits(f.postalCode).length !== 5) e.postalCode = '5 haneli posta kodunu yaz.';
  if (f.address.trim().length < 10) e.address = 'Mahalle, cadde ve kapı numarasıyla açık adresi yaz.';
  if (!f.terms) e.terms = 'Devam etmek için sözleşmeyi onaylaman gerekiyor.';
  return e;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; title: string; text: string; icon: typeof CreditCard }[] = [
  { id: 'kart', title: 'Kredi / banka kartı', text: 'Demo: kart bilgisi istenmez', icon: CreditCard },
  { id: 'havale', title: 'Havale / EFT', text: 'Demo: banka bilgisi gösterilmez', icon: Landmark },
];

export function CheckoutPage() {
  usePageTitle('Ödeme');
  const { cart, cartCount, cartTotal, clearCart } = useShop();
  const { user, orders, addOrder } = useAccount();
  const navigate = useNavigate();
  const lastAddress = orders[0]?.address;

  const [form, setForm] = useState<FormState>(() => ({
    email: user?.email ?? orders[0]?.email ?? '',
    fullName: lastAddress?.fullName ?? (user && user.name !== 'Demo Kullanıcı' ? user.name : ''),
    phone: lastAddress?.phone ?? '',
    city: lastAddress?.city ?? '',
    district: lastAddress?.district ?? '',
    postalCode: lastAddress?.postalCode ?? '',
    address: lastAddress?.address ?? '',
    terms: false,
  }));
  const [payment, setPayment] = useState<PaymentMethod>('kart');
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const lines: SummaryLine[] = cart.flatMap((l) => {
    const p = PRODUCT_BY_ID.get(l.id);
    return p ? [{ id: p.id, name: p.name, qty: l.qty, price: p.price }] : [];
  });
  const totals = orderTotals(cartTotal);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (processing) return;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setProcessing(true);
    // Demo ödeme: gerçek bir ödeme sağlayıcıya istek gitmez
    timer.current = window.setTimeout(() => {
      const id = newOrderId();
      addOrder({
        id,
        createdAt: new Date().toISOString(),
        email: form.email.trim(),
        lines,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total,
        address: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          city: form.city,
          district: form.district.trim(),
          postalCode: digits(form.postalCode),
          address: form.address.trim(),
        },
        payment,
      });
      setPlaced(true);
      clearCart();
      navigate(`/siparis-onayi/${id}`, { replace: true });
    }, 1100);
  };

  if (placed) return null;

  if (cart.length === 0) {
    return (
      <div className={`container ${s.page}`}>
        <div className={s.empty}>
          <p className={s.emptyTitle}>Ödenecek ürün yok</p>
          <p className={s.emptyText}>Sepetin boş. Ürün ekleyip tekrar dene.</p>
          <Link to="/kategori/kaliplar" className="btn btn--primary">
            Alışverişe başla
          </Link>
        </div>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className={`container ${s.page}`}>
      <Link to="/sepet" className={s.back}>
        <ArrowLeft aria-hidden="true" />
        Sepete dön
      </Link>

      <header className={s.head}>
        <h1 className={s.title}>Ödeme</h1>
        {!user && (
          <p className={s.login}>
            Hesabın var mı? <Link to="/giris?next=/odeme">Giriş yap</Link>
          </p>
        )}
      </header>

      <DemoNotice className={s.demo}>
        Demo sürümü: gerçek ödeme alınmaz ve sipariş oluşmaz. Gerçek kişisel bilgi girmek zorunda değilsin; örnek değerler yazabilirsin. Bilgiler yalnızca bu
        tarayıcıda saklanır.
      </DemoNotice>

      <div className={s.layout}>
        <form ref={formRef} className={s.form} onSubmit={submit} noValidate aria-label="Ödeme formu">
          {errorCount > 0 && (
            <p className={s.errorSummary} role="alert">
              Lütfen işaretli {errorCount} alanı düzelt.
            </p>
          )}

          <fieldset className={s.section}>
            <legend>
              <span className={s.step}>1</span> İletişim
            </legend>
            <Field
              label="E-posta"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="ornek@eposta.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              hint="Sipariş bilgilendirmesi için (demo: e-posta gönderilmez)"
            />
          </fieldset>

          <fieldset className={s.section}>
            <legend>
              <span className={s.step}>2</span> Teslimat adresi
            </legend>
            <div className={s.grid}>
              <Field
                className={s.span2}
                label="Ad soyad"
                name="name"
                autoComplete="name"
                required
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                error={errors.fullName}
              />
              <Field
                className={s.span2}
                label="Telefon"
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                placeholder="5xx xxx xx xx"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                error={errors.phone}
              />
              <SelectField
                label="İl"
                name="city"
                autoComplete="address-level1"
                required
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                error={errors.city}
              >
                <option value="">İl seç</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
              <Field
                label="İlçe"
                name="district"
                autoComplete="address-level2"
                required
                value={form.district}
                onChange={(e) => set('district', e.target.value)}
                error={errors.district}
              />
              <TextAreaField
                className={s.span2}
                label="Açık adres"
                name="address"
                autoComplete="street-address"
                required
                rows={3}
                placeholder="Mahalle, cadde/sokak, bina ve daire no"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                error={errors.address}
              />
              <Field
                label="Posta kodu"
                name="postal"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                required
                value={form.postalCode}
                onChange={(e) => set('postalCode', digits(e.target.value))}
                error={errors.postalCode}
              />
            </div>
          </fieldset>

          <fieldset className={s.section}>
            <legend>
              <span className={s.step}>3</span> Ödeme yöntemi
            </legend>
            <div className={s.options} role="radiogroup" aria-label="Ödeme yöntemi">
              {PAYMENT_OPTIONS.map(({ id, title, text, icon: Icon }) => (
                <label key={id} className={cx(s.option, payment === id && s.optionOn)}>
                  <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} />
                  <Icon strokeWidth={1.5} aria-hidden="true" />
                  <span>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </span>
                  <span className={s.radio} aria-hidden="true" />
                </label>
              ))}
            </div>
            <p className={s.payNote}>
              <Lock strokeWidth={1.6} aria-hidden="true" />
              {payment === 'kart'
                ? 'Gerçek sürümde kart bilgilerin 3D Secure ile ödeme sağlayıcısının güvenli sayfasında alınır. Demoda kart bilgisi istenmez; “Siparişi tamamla” ödemeyi başarılı sayar.'
                : 'Gerçek sürümde banka hesap bilgileri sipariş sonrası gösterilir. Demoda “Siparişi tamamla” siparişi onaylar.'}
            </p>
          </fieldset>

          <div className={s.terms}>
            <label className={s.check}>
              <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} aria-invalid={errors.terms ? true : undefined} />
              <span className={s.box} aria-hidden="true" />
              <span>
                <Link to="/sayfa/mesafeli-satis" target="_blank">
                  Ön bilgilendirme formunu ve mesafeli satış sözleşmesini
                </Link>{' '}
                okudum, onaylıyorum.
              </span>
            </label>
            {errors.terms && <p className={s.termsError}>{errors.terms}</p>}
          </div>

          <button type="submit" className={cx('btn btn--primary btn--block', s.submit)} disabled={processing}>
            {processing ? 'Ödeme işleniyor…' : `Siparişi tamamla · ${formatPrice(totals.total)}`}
          </button>
        </form>

        {/* Mobil: katlanır özet */}
        <details className={s.mobileSummary}>
          <summary>
            <span>
              Sipariş özeti <span className={s.summaryCount}>({cartCount} ürün)</span>
            </span>
            <span className={`${s.summaryTotal} price`}>{formatPrice(totals.total)}</span>
            <ChevronDown aria-hidden="true" />
          </summary>
          <OrderSummary lines={lines} {...totals} />
        </details>

        <aside className={s.summary} aria-labelledby="co-summary">
          <h2 id="co-summary" className={s.summaryTitle}>
            Sipariş özeti
          </h2>
          <OrderSummary lines={lines} {...totals} />
        </aside>
      </div>
    </div>
  );
}
