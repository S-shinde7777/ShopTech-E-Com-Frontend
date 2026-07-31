import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Storage key based on current user
  const getStorageKey = () => {
    return user ? `shoptech_cart_${user.id}` : "shoptech_cart_guest";
  };

  // Load cart on user change or mount
  useEffect(() => {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      setCartItems(JSON.parse(stored));
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Helper to persist cart items
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  };

  // Add Product
  const addToCart = (product, quantity = 1) => {
    const qty = Number(quantity) || 1;
    const existingProductIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex > -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingProductIndex].quantity += qty;
      saveCart(updatedItems);
    } else {
      saveCart([...cartItems, { ...product, quantity: qty }]);
    }
  };

  // Remove Product
  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  // Update quantity directly (+ or - or direct input)
  const updateQuantity = (id, newQty) => {
    const qty = Math.max(1, Number(newQty)); // Ensure at least 1
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    saveCart(updated);
  };

  // Clear Cart (e.g. after successful order)
  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;