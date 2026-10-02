import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

/*
 * DEMO — gerçek üyelik/sipariş sistemi V2'de. Bu bağlam yalnızca tarayıcıda
 * (localStorage) tutulur; sunucuya hiçbir şey gönderilmez, şifre hiçbir yerde saklanmaz.
 */

export interface DemoUser {
  name: string;
  email: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  postalCode: string;
  address: string;
}

export interface OrderLine {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export type PaymentMethod = 'kart' | 'havale';

export interface DemoOrder {
  id: string;
  createdAt: string;
  email: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
  payment: PaymentMethod;
}

interface AccountState {
  user: DemoUser | null;
  orders: DemoOrder[];
  signIn: (user: DemoUser) => void;
  signOut: () => void;
  addOrder: (order: DemoOrder) => void;
  clearDemoData: () => void;
}

const AccountContext = createContext<AccountState | null>(null);
const KEYS = { user: 'acg.demoUser', orders: 'acg.demoOrders' };
const MAX_ORDERS = 10;

const isUser = (u: unknown): u is DemoUser =>
  typeof u === 'object' && u !== null && typeof (u as DemoUser).name === 'string' && typeof (u as DemoUser).email === 'string';

const isOrder = (o: unknown): o is DemoOrder =>
  typeof o === 'object' && o !== null && typeof (o as DemoOrder).id === 'string' && Array.isArray((o as DemoOrder).lines) && typeof (o as DemoOrder).total === 'number';

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => {
    const stored = readStorage<unknown>(KEYS.user, null);
    return isUser(stored) ? stored : null;
  });
  const [orders, setOrders] = useState<DemoOrder[]>(() => {
    const stored = readStorage<unknown>(KEYS.orders, []);
    return Array.isArray(stored) ? stored.filter(isOrder) : [];
  });

  useEffect(() => writeStorage(KEYS.user, user), [user]);
  useEffect(() => writeStorage(KEYS.orders, orders), [orders]);

  const signIn = useCallback((u: DemoUser) => setUser(u), []);
  const signOut = useCallback(() => setUser(null), []);
  const addOrder = useCallback((order: DemoOrder) => setOrders((list) => [order, ...list].slice(0, MAX_ORDERS)), []);
  const clearDemoData = useCallback(() => {
    setUser(null);
    setOrders([]);
  }, []);

  const value = useMemo<AccountState>(
    () => ({ user, orders, signIn, signOut, addOrder, clearDemoData }),
    [user, orders, signIn, signOut, addOrder, clearDemoData],
  );
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside <AccountProvider>');
  return ctx;
}
