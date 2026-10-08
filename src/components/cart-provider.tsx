import { createContext, useContext, useSyncExternalStore } from "react";

export type CartLine = { id: string; name: string; business: string; price: number; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (line: Omit<CartLine, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

// Cart lives in a tiny external store persisted to localStorage, so it survives
// page reloads without a backend.
const STORAGE_KEY = "group-cart";
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (lines === null) {
    try {
      lines = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      lines = [];
    }
  }
  return lines!;
}

function write(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode): cart still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, read);

  const value: CartContextValue = {
    lines: current,
    count: current.reduce((n, l) => n + l.qty, 0),
    total: current.reduce((n, l) => n + l.qty * l.price, 0),
    add: (line) => {
      const prev = read();
      write(
        prev.some((l) => l.id === line.id)
          ? prev.map((l) => (l.id === line.id ? { ...l, qty: l.qty + 1 } : l))
          : [...prev, { ...line, qty: 1 }],
      );
    },
    setQty: (id, qty) => {
      const prev = read();
      write(qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)));
    },
    clear: () => write([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
