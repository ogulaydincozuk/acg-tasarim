import type { ReactNode } from 'react';
import { cx } from '../../lib/format';
import s from './DemoNotice.module.css';

export function DemoNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cx(s.notice, className)} role="note">
      <span className={s.tag}>Demo</span>
      <p>{children ?? 'Bu sayfa demo sürümüdür: gerçek ödeme alınmaz, gerçek sipariş oluşturulmaz.'}</p>
    </div>
  );
}
