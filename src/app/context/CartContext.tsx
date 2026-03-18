import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { API_BASE } from "../config/api";
import { useAuth } from "./AuthContext";

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  stock: number;
  description?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  products: CartProduct;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (product_id: number, quantity?: number) => Promise<void>;
  removeFromCart: (product_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getQty: (product_id: number) => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !token) { setItems([]); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/cart`, { headers: authHeaders });
      const data = await res.json();
      if (data.status === "success") setItems(data.data || []);
    } catch (e) {
      console.error("Failed to fetch cart:", e);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product_id: number, quantity = 1) => {
    await fetch(`${API_BASE}/cart/add`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ product_id, quantity }),
    });
    await fetchCart();
  };

  const removeFromCart = async (product_id: number) => {
    await fetch(`${API_BASE}/cart/remove`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ product_id }),
    });
    await fetchCart();
  };

  const clearCart = async () => {
    await fetch(`${API_BASE}/cart/clear`, { method: "DELETE", headers: authHeaders });
    setItems([]);
  };

  const getQty = (product_id: number) =>
    items.find((i) => i.products?.id === product_id)?.quantity || 0;

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = items.reduce((s, i) => s + Number(i.products?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading, cartCount, cartTotal,
      addToCart, removeFromCart, clearCart,
      getQty, refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
