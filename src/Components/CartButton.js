import React, { useContext } from 'react';
import { BsCartCheckFill } from 'react-icons/bs';
import { CartContext } from '../Components/CartContext';
import { UserContext } from '../Components/UserContext';

const CartButton = ({ item, onAddToCart }) => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const addToCart = (product) => {
    if (user) {
      onAddToCart(product);

      const existingItemIndex = cart.findIndex((item) => item.id_producto === product.id_producto);

      if (existingItemIndex !== -1) {
        const updatedCart = cart.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });

        setCart(updatedCart);
      } else {
        const newCart = Array.isArray(cart) ? [...cart, { ...product, quantity: 1 }] : [{ ...product, quantity: 1 }];
        setCart(newCart);
      }
    } else {
      alert('Necesitas iniciar sesión para agregar productos al carrito');
    }
  };

  return (
    <button className="cart-button" onClick={() => addToCart(item)}>
      <BsCartCheckFill size={24} />
    </button>
  );
};

export default CartButton;
