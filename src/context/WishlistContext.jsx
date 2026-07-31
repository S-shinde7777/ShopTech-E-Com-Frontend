import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Wishlist Storage Key depending on logged in user
  const getStorageKey = () => {
    return user ? `shoptech_wishlist_${user.id}` : "shoptech_wishlist_guest";
  };

  // Load wishlist on mount or user change
  useEffect(() => {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  // Save wishlist changes
  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  };

  const addToWishlist = (product) => {
    if (wishlistItems.find((item) => item.id === product.id)) return;
    const updated = [...wishlistItems, product];
    saveWishlist(updated);
  };

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    saveWishlist(updated);
  };

  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
