import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem } from "../data/foods";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface CartItem {
  food: FoodItem;
  quantity: number;
  customization?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: FoodItem, quantity: number, customization?: string) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemsCount: number;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // 1. Initial Load from Local Storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("foodnet_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Local storage cart retrieval failed:", e);
    }
    setInitialLoaded(true);
  }, []);

  // 2. Authentication Sync: Load & Merge guest cart with user cart on sign-in
  useEffect(() => {
    if (!initialLoaded) return;

    const syncCartOnAuth = async () => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        try {
          const snap = await getDoc(cartRef);
          if (snap.exists()) {
            const dbItems = snap.data().items as CartItem[] || [];
            
            // Merge guest cart items gracefully into database cart items
            const merged = [...dbItems];
            for (const guestItem of cartItems) {
              const existingIdx = merged.findIndex((item) => item.food.id === guestItem.food.id);
              if (existingIdx > -1) {
                // Keep the larger quantity, or accumulate
                merged[existingIdx].quantity = Math.max(merged[existingIdx].quantity, guestItem.quantity);
              } else {
                merged.push(guestItem);
              }
            }

            setCartItems(merged);
            localStorage.setItem("foodnet_cart", JSON.stringify(merged));
            await setDoc(cartRef, { items: JSON.parse(JSON.stringify(merged)), updatedAt: new Date() });
          } else if (cartItems.length > 0) {
            // No cart in db yet but guest had items, save them immediately
            await setDoc(cartRef, { items: JSON.parse(JSON.stringify(cartItems)), updatedAt: new Date() });
          }
        } catch (err) {
          console.error("Failed to sync cart from Firestore:", err);
        }
      } else {
        // Logged out
        try {
          const stored = localStorage.getItem("foodnet_cart");
          setCartItems(stored ? JSON.parse(stored) : []);
        } catch {
          setCartItems([]);
        }
      }
    };

    syncCartOnAuth();
  }, [user, initialLoaded]);

  // 3. Save to localStorage & database whenever cart changes
  useEffect(() => {
    if (!initialLoaded) return;
    localStorage.setItem("foodnet_cart", JSON.stringify(cartItems));

    const persistToDb = async () => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        try {
          await setDoc(cartRef, { items: JSON.parse(JSON.stringify(cartItems)), updatedAt: new Date() });
        } catch (err) {
          console.error("Failed to save cart state to Firestore:", err);
        }
      }
    };

    const handler = setTimeout(() => {
      persistToDb();
    }, 600);

    return () => clearTimeout(handler);
  }, [cartItems, user, initialLoaded]);

  const addToCart = (food: FoodItem, quantity: number, customization?: string) => {
    const existing = cartItems.find((item) => item.food.id === food.id);
    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.food.id === food.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                ...(customization ? { customization } : {}),
              }
            : item
        )
      );
      toast.success(`Updated ${food.name} quantity in cart!`);
    } else {
      setCartItems((prev) => [...prev, { food, quantity, customization }]);
      toast.success(`${food.name} added to cart!`);
    }
  };

  const removeFromCart = (foodId: string) => {
    const item = cartItems.find((i) => i.food.id === foodId);
    if (item) {
      toast.success(`${item.food.name} removed from cart.`);
    }
    setCartItems((prev) => prev.filter((i) => i.food.id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 1500 : 0; // Flat 1,500 RWF fee for Kirehe courier deliveries
  const total = subtotal + deliveryFee;
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " RWF";
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemsCount,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
