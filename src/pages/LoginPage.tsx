import { useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useAccount } from '../context/AccountContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { cx } from '../lib/format';
import { DemoNotice } from '../components/ui/DemoNotice';
import { Field } from '../components/ui/Field';
import { Img } from '../components/ui/Img';
import s from './LoginPage.module.css';

type Mode = 'giris' | 'uye';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Yalnızca site içi yollara yönlendir (açık yönlendirmeyi önler). */
const safeNext = (value: string | null) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/hesap');

const nameFromEmail = (email: string) => {
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return local ? local.charAt(0).toLocaleUpperCase('tr-TR') + local.slice(1) : 'Misafir';
};

export function LoginPage() {
  usePageTitle('Giriş yap');
  const { user, signIn } = useAccount();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [mode, setMode] = useState<Mode>('giris');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  if (user) return <Navigate to={next} replace />;

  const finish = (u: { name: string; email: string }) => {
    signIn(u);
    navigate(next, { replace: true });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (mode === 'uye' && name.trim().length < 2) found.name = 'Ad soyadını yaz.';
    if (!EMAIL.test(email.trim())) found.email = 'Geçerli bir e-posta adresi yaz.';
    if (password.length < 6) found.password = 'Şifre en az 6 karakter olmalı.';
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    // Şifre hiçbir yerde saklanmaz veya gönderilmez
    setPassword('');
    finish({ name: mode === 'uye' ? name.trim() : nameFromEmail(email.trim()), email: email.trim() });
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
  };

  return (
    <div className={`container ${s.page}`}>
      <div className={s.layout}>
        <aside className={s.aside}>
          <Img image="candleJarsPeach" alt="" ratio={4 / 5} sizes="(min-width: 1024px) 40vw, 0px" className={s.asideImg} maxWidth={1080} />
          <div className={s.asideText}>
            <p className={s.asideTitle}>Üretime kaldığın yerden devam et</p>
            <ul>
              <li>
                <Check aria-hidden="true" /> Siparişlerini tek yerden takip et
              </li>
              <li>
                <Check aria-hidden="true" /> Favori kalıplarını kaydet
              </li>
              <li>
                <Check aria-hidden="true" /> Adresini bir kez gir, hızlıca öde
              </li>
            </ul>
          </div>
        </aside>

        <section className={s.card} aria-labelledby="login-title">
          <h1 id="login-title" className={s.title}>
            {mode === 'giris' ? 'Hoş geldin' : 'Hesap oluştur'}
          </h1>
          <p className={s.lead}>{mode === 'giris' ? 'Hesabına giriş yap.' : 'Birkaç saniyede üye ol.'}</p>

          <div className={s.tabs} role="tablist" aria-label="Giriş türü">
            {(
              [
                ['giris', 'Giriş yap'],
                ['uye', 'Üye ol'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={mode === id}
                aria-controls="auth-panel"
                tabIndex={mode === id ? 0 : -1}
                className={cx(s.tab, mode === id && s.tabActive)}
                onClick={() => switchMode(id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const other: Mode = id === 'giris' ? 'uye' : 'giris';
                    switchMode(other);
                    document.getElementById(`tab-${other}`)?.focus();
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <DemoNotice className={s.demo}>
            Demo sürümü: gerçek üyelik yok. Herhangi bir e-posta ve 6+ karakterlik bir değerle girebilirsin; <strong>gerçek şifreni yazma</strong>. Hiçbir bilgi
            gönderilmez veya saklanmaz.
          </DemoNotice>

          <form ref={formRef} id="auth-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className={s.form} onSubmit={submit} noValidate>
            {mode === 'uye' && (
              <Field
                label="Ad soyad"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            )}
            <Field
              label="E-posta"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="ornek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div className={s.passwordRow}>
              <Field
                label="Şifre"
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete={mode === 'giris' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                hint={mode === 'uye' ? 'En az 6 karakter' : undefined}
              />
              <button
                type="button"
                className={s.eye}
                onClick={() => setShow((v) => !v)}
                aria-pressed={show}
                aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {show ? <EyeOff strokeWidth={1.6} /> : <Eye strokeWidth={1.6} />}
              </button>
            </div>

            <button type="submit" className="btn btn--primary btn--block">
              {mode === 'giris' ? 'Giriş yap' : 'Üye ol'}
            </button>
          </form>

          <div className={s.divider}>
            <span>veya</span>
          </div>
          <button type="button" className="btn btn--secondary btn--block" onClick={() => finish({ name: 'Demo Kullanıcı', email: 'demo@acgtasarim.com' })}>
            Demo hesabıyla devam et
          </button>
        </section>
      </div>
    </div>
  );
}
