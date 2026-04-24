"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartNotification, setCartNotification] = useState(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("kasana-cart");
            if (saved) {
                setCartItems(JSON.parse(saved));
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem("kasana-cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product, quantity = 1) => {
        setCartItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.id === product.id && item.category === product.category
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            return [
                ...prev,
                {
                    id: product.id,
                    category: product.category,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image || product.images?.[0],
                    quantity,
                },
            ];
        });

        // Show notification
        setCartNotification(product.name);
        setTimeout(() => setCartNotification(null), 2500);
    }, []);

    const removeFromCart = useCallback((id, category) => {
        setCartItems((prev) =>
            prev.filter((item) => !(item.id === id && item.category === category))
        );
    }, []);

    const updateQuantity = useCallback((id, category, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.category === category
                    ? { ...item, quantity }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                isCartOpen,
                setIsCartOpen,
                cartNotification,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
