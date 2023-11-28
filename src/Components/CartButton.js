import React, { useContext, useState } from 'react';
import { BsCartCheckFill } from 'react-icons/bs';
import { CartContext } from '../Components/CartContext';

const CartButton = ({ item }) => {
  const { cart, setCart } = useContext(CartContext);

  const addToCart = (product) => {
    const newCart = Array.isArray(cart) ? [...cart, product] : [product];
    setCart(newCart);
  };
  

  return (
    <button 
      className="cart-button"
      onClick={() => addToCart(item)}
    >
      <BsCartCheckFill size={24}/>
    </button>
  );
};

export default CartButton;
