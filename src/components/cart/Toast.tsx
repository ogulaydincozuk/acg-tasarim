import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Img } from '../ui/Img';
import s from './Toast.module.css';

export function Toast() {
  const { toast, dismissToast, setCartOpen } = useShop();

  return (
    <div className={s.region} aria-live="polite" aria-atomic="true">
      {toast && (
        <div key={toast.id} className={s.toast} role="status">
          {toast.product && <Img image={toast.product.image} alt="" ratio={1} sizes="56px" maxWidth={320} className={s.thumb} />}
          <div className={s.text}>
            <p className={s.title}>
              <Check aria-hidden="true" />
              {toast.title}
            </p>
            {toast.product && <p className={s.name}>{toast.product.name}</p>}
          </div>
          {toast.action === 'cart' ? (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => {
                dismissToast();
                setCartOpen(true);
              }}
            >
              Sepeti gör
            </button>
          ) : (
            <Link to="/favoriler" className="btn btn--secondary btn--sm" onClick={dismissToast}>
              Favoriler
            </Link>
          )}
          <button type="button" className={s.close} onClick={dismissToast} aria-label="Bildirimi kapat">
            <X />
          </button>
        </div>
      )}
    </div>
  );
}
