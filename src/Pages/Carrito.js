import React, { useState, useEffect } from 'react';
import '../styles/Carrito.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario

  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    const userIdFromStorage = localStorage.getItem("id_usuario"); // Obtener el id_usuario del localStorage

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const cartWithValidQuantity = parsedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCartItems(cartWithValidQuantity);
    }

    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
  }, []);
  

  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((item, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('carrito', JSON.stringify(updatedCart)); // Actualizar el carrito en el localStorage
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCart = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: parseInt(newQuantity, 10) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('carrito', JSON.stringify(updatedCart));
  };

  const prepareCheckout = () => {
    const productsForCheckout = cartItems.map(item => ({
      client_id: userId,
      product_id: item.id_producto,
      quantity: item.quantity,
      price: item.valor_unitario,
      message: null,
      v: 0
    }));

    console.log('Productos para el pago:', productsForCheckout);
    // Aquí podrías hacer algo con los productos para enviarlos al proceso de pago
    // Por ejemplo, enviarlos a la API de pago
  };

  const calcularPrecioTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.valor_unitario * item.quantity;
      return total + (isNaN(itemPrice) ? 0 : itemPrice);
    }, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('carrito');
    setCartItems([]);
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Sin productos en el carrito</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <div>
                <img src={item.imagen} alt={item.nombre} /><br />
                <span>{item.nombre}</span><br />
                <span>Precio: ${item.valor_unitario}</span>
              </div>
              <div>
                <input
                  type="number"
                  value={item.quantity || item.quantity === 0 ? item.quantity : 1}
                  min="0"
                  onChange={(e) => {
                    const newQuantity = e.target.value <= 0 ? 0 : e.target.value;
                    handleQuantityChange(index, newQuantity);
                  }}
                />
                <button onClick={() => handleRemoveItem(index)}>Eliminar producto</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="total">
        <p>Total: ${calcularPrecioTotal()}</p>
      </div>
      <button onClick={prepareCheckout} className="boton-pago">
        Proceder al Pago
      </button>
    </div>
  );
};

export default Carrito;
