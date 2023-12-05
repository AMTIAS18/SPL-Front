import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    const userIdFromStorage = localStorage.getItem('id_usuario');

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

  const handleRemoveItem = index => {
    const confirmation = window.confirm(
      '¿Estás seguro de eliminar este producto del carrito?'
    );

    if (confirmation) {
      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);
      localStorage.setItem('carrito', JSON.stringify(updatedCart));
      window.location.reload();
    }
  };

  const handleVaciarCarrito = () => {
    const confirmation = window.confirm('¿Estás seguro de vaciar el carrito?');
    if (confirmation) {
      setCartItems([]); // Vacía el carrito
      localStorage.removeItem('carrito'); // Elimina el carrito guardado en localStorage
      setInputValues({}); // Limpia los valores de los inputs de mensaje
  
      // Opcional: redirecciona a la página actual para refrescarla y mostrar el carrito vacío
      window.location.reload();
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedQuantity = newQuantity <= 0 ? 1 : newQuantity;

    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: parseInt(updatedQuantity, 10) } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('carrito', JSON.stringify(updatedCart));
  };

  const handleInputChange = (index, value) => {
    setInputValues({
      ...inputValues,
      [index]: value,
    });
  };

  const handleRealizarPedido = async () => {
    const checkoutData = cartItems.map(item => ({
      client_id: userId,
      message: inputValues[item.id_producto] || ' ',
      price: item.valor_unitario,
      product_id: item.id_producto,
      quantity: item.quantity
    }));  
  
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/cart/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: checkoutData }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Data:', checkoutData);
        console.log('Respuesta del servidor:', responseData);
  
        navigate('/pago');
      } else {
        console.error('Error al enviar la solicitud:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const calcularPrecioTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.valor_unitario * item.quantity;
      return total + (isNaN(itemPrice) ? 0 : itemPrice);
    }, 0);
  };

  return (
    <div className="fondo-carrito-container">
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        <center>*Por el momento, solo aceptamos pagos con tarjetas de crédito o débito.</center><br />
        {cartItems.length === 0 ? (
          <center>Sin productos en el carrito</center>
        ) : (
          <div>
            <button className="boton-vaciar" onClick={handleVaciarCarrito}>
              Vaciar Carrito
            </button>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  <div>
                    <img src={item.imagen} alt={item.nombre} />
                    <br />
                    <span>Precio: ${item.valor_unitario}</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={item.quantity || item.quantity === 0 ? item.quantity : 1}
                      min="0"
                      onChange={e => {
                        const newQuantity = e.target.value <= 0 ? 0 : e.target.value;
                        handleQuantityChange(index, newQuantity);
                      }}
                    />
                    <button onClick={() => handleRemoveItem(index)}>
                      Eliminar producto
                    </button>
                    <br />
                    <input
                      type="text"
                      value={inputValues[index] || ''}
                      onChange={e => handleInputChange(index, e.target.value)}
                      placeholder="Mensaje"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="total">
              <p>Total: ${calcularPrecioTotal()}</p>
            </div>
            <button className="boton-pedido" onClick={handleRealizarPedido}>
              Realizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
