import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyLock, useDialog } from '../../hooks/useUi';
import { cx } from '../../lib/format';
import s from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  side?: 'right' | 'left' | 'bottom';
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  className?: string;
}

/** Yan/alt çekmece: mobil menü, sepet, mobil filtre. Kapalıyken DOM'da kalır (çıkış animasyonu) ama inert'tir. */
export function Drawer({ open, onClose, title, side = 'right', children, footer, width = 440, className }: DrawerProps) {
  const panel = useRef<HTMLDivElement>(null);
  useBodyLock(open);
  useDialog(panel, open, onClose);

  return createPortal(
    <div className={cx(s.root, open && s.open)} inert={!open}>
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className={cx(s.panel, s[side], className)}
        style={side !== 'bottom' ? { width: `min(${width}px, 100vw - 40px)` } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
      >
        <header className={s.head}>
          <div className={s.title}>{title}</div>
          <button type="button" className={s.close} onClick={onClose} aria-label="Kapat">
            <X strokeWidth={1.6} />
          </button>
        </header>
        <div className={s.body}>{children}</div>
        {footer && <footer className={s.foot}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
