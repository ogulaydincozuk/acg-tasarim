import { useEffect, useRef, useState, type RefObject } from 'react';

/* Birden çok katman aynı anda açık olabildiği için kilit sayaçla tutulur. */
let lockCount = 0;

export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbar > 0 ? `${scrollbar}px` : '';
    document.body.classList.add('is-locked');
    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.classList.remove('is-locked');
        document.body.style.paddingRight = '';
      }
    };
  }, [active]);
}

export function useMediaQuery(query: string) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Aşağı kaydırırken header'ı gizle, yukarı kaydırınca göster. */
export function useHeaderVisibility(offset = 120) {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  const last = useRef(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last.current;
        setState((s) => {
          const hidden = y > offset && delta > 4 ? true : delta < -4 || y <= offset ? false : s.hidden;
          const scrolled = y > 8;
          return hidden === s.hidden && scrolled === s.scrolled ? s : { hidden, scrolled };
        });
        last.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return state;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Diyalog/çekmece içinde Tab odağını hapseder, Esc ile kapatır, kapanınca odağı geri verir. */
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void, initialFocus?: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusFirst = () => {
      const target = initialFocus?.current ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node;
      target?.focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, ref, initialFocus]);
}
