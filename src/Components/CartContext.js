import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const initialCart = JSON.parse(localStorage.getItem('carrito')) || [];
    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cart));
    }, [cart]);

    const removeFromCart = (indexToRemove) => {
        const newCart = cart.filter((item, index) => index !== indexToRemove);
        setCart(newCart);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};