import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addLine,
  cartCount,
  cartSubtotal,
  parseStoredCart,
  setLineQty,
  type CartLine,
} from "./cart-logic";

const STORAGE_KEY = "aurum-cart";

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: CartLine) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLines(parseStoredCart(window.localStorage.getItem(STORAGE_KEY)));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const add = useCallback((line: CartLine) => setLines((ls) => addLine(ls, line)), []);
  const setQty = useCallback(
    (slug: string, size: string, qty: number) => setLines((ls) => setLineQty(ls, slug, size, qty)),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      ready: loaded,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines),
      open,
      setOpen,
      add,
      setQty,
      clear,
    }),
    [lines, loaded, open, add, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
