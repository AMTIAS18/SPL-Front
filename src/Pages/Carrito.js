import React, { useState, useEffect } from 'react';
import '../styles/Carrito.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [checkoutDetails, setCheckoutDetails] = useState({
    direccion: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    codigoSeguridad: '',
  });
  const [realizarPedido, setRealizarPedido] = useState(false);
  const [edicionBloqueada, setEdicionBloqueada] = useState(false);
  const [direccionEncontrada, setDireccionEncontrada] = useState(null);

  const actualizarDireccion = async () => {
    if (direccionEncontrada) {
      const { address_id } = direccionEncontrada;
      const requestBody = {
        address_id: address_id,
        number_house: direccionEncontrada.numero_casa,
        street: direccionEncontrada.calle,
        town: direccionEncontrada.poblacion,
        description: direccionEncontrada.descripcion,
        sector: direccionEncontrada.sector,
      };
  
      try {
        const response = await fetch(
          `https://entreraices-production.up.railway.app/api/address/update`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        );
  
        if (response.ok) {
          const updatedAddress = await response.json();
          console.log('Dirección actualizada:', updatedAddress);
        } else {
          console.error('Error al actualizar la dirección:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No se encontró una dirección para actualizar');
    }
  };   

  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    const userIdFromStorage = localStorage.getItem('id_usuario');
    

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const cartWithValidQuantity = parsedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
      }));

      const mergedCart = cartWithValidQuantity.map(item => {
        const existingItem = cartItems.find(
          cartItem => cartItem.id_producto === item.id_producto
        );
        return existingItem ? existingItem : item;
      });

      setCartItems(mergedCart);
    }

    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
    
    if (userIdFromStorage) {
      fetch('https://entreraices-production.up.railway.app/api/user')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al obtener los datos relacionados con id_direccion');
      })
      .then(data => {
        const direccionEncontrada = data.find(item => item.id_usuario === userIdFromStorage);

        if (direccionEncontrada) {
          const idDireccion = direccionEncontrada.id_direccion;
          console.log('ID de Dirección Encontrado:', idDireccion);

          fetch(`https://entreraices-production.up.railway.app/api/address`)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Error al obtener los datos de la dirección');
            })
            .then(data => {
              const direccionEncontradaDetails = data.data.find(
                item => item.id_direccion === idDireccion
              );
            
              if (direccionEncontradaDetails) {
                console.log('Detalles de la dirección encontrada:', direccionEncontradaDetails);
            
                setDireccionEncontrada(direccionEncontradaDetails);
              } else {
                console.log('No se encontraron detalles para esta dirección');
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveItem = index => {
    const confirmation = window.confirm(
      '¿Estás seguro de eliminar este producto del carrito?'
    );

    if (confirmation) {
      const updatedCart = cartItems.filter((item, i) => i !== index);
      setCartItems(updatedCart);
      localStorage.setItem('carrito', JSON.stringify(updatedCart));
      window.location.reload();
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedQuantity = newQuantity <= 0 ? 1 : newQuantity;

    const updatedCart = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: parseInt(updatedQuantity, 10) };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('carrito', JSON.stringify(updatedCart));
  };

  const handleInputChange = (index, value) => {
    setInputValues({
      ...inputValues,
      [index]: value,
    });
  };

  const prepareCheckout = async () => {
    const requestBodyTicket = {
      user_id: userId,
    };
  
    try {
      const responseTicket = await fetch('https://entreraices-production.up.railway.app/api/ticket/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyTicket),
      });
  
      if (responseTicket.ok) {
        const responseDataTicket = await responseTicket.json();
        console.log('Respuesta del servidor (Ticket):', responseDataTicket);
      } else {
        console.error('Error al enviar la solicitud (Ticket):', responseTicket.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    localStorage.removeItem('carrito');
    window.location.href = '/Compra';
  };
  

  const handleRealizarPedido = async () => {
    setRealizarPedido(true);
    setEdicionBloqueada(true);
   
  
    const checkoutData = cartItems.map((item, index) => ({
      client_id: userId,
      product_id: item.id_producto,
      quantity: item.quantity,
      price: item.valor_unitario,
      message: inputValues[index] || ' ',
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
        console.log('Respuesta del servidor:', responseData);
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

  const handleCancelarPedido = () => {
    setRealizarPedido(false);
    setEdicionBloqueada(false);
    setCheckoutDetails({
      direccion: '',
      numeroTarjeta: '',
      fechaExpiracion: '',
      codigoSeguridad: '',
    });
  };

  return (
    <div className= "fondo-carrito-container">
      <div className="carrito">
        <h2>Carrito de Compras</h2>
        <center>*Por el momento, solo aceptamos pagos con tarjetas de crédito o débito</center><br />
        {cartItems.length === 0 ? (
        <center>Sin productos en el carrito</center>
      ) : (
        <div>
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
                    disabled={edicionBloqueada}
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    disabled={edicionBloqueada}
                  >
                    Eliminar producto
                  </button>
                  <br />
                  <input
                    type="text"
                    value={inputValues[index] || ''}
                    onChange={e => handleInputChange(index, e.target.value)}
                    placeholder="Mensaje"
                    disabled={edicionBloqueada}
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
          {realizarPedido && direccionEncontrada && (
          <>
            <div className="seccion-direccion">
              <h3>Detalles de dirección</h3>
              <button onClick={actualizarDireccion} className="boton-actualizar">
                Actualizar Dirección
              </button>
              <p>Calle: {direccionEncontrada.calle}</p>
              <p>Numero casa: {direccionEncontrada.numero_casa}</p>
              <p>Poblacion: {direccionEncontrada.poblacion}</p>
              <p>Descripción: {direccionEncontrada.descripcion}</p>
              <p>Sector: {direccionEncontrada.sector}</p>
            </div>
            <div className="seccion-pago">
              <h3>Detalles de Pago</h3>
              <input
                type="text"
                placeholder="Número de Tarjeta"
                value={checkoutDetails.numeroTarjeta}
                onChange={e => {
                  const inputValue = e.target.value;
                  const cleanedValue = inputValue.replace(/-/g, '');
                  const formattedValue = cleanedValue
                    .replace(/\D/g, '')
                    .slice(0, 16)
                    .match(/.{1,4}/g)
                    ?.join('-') || '';

                  setCheckoutDetails({
                    ...checkoutDetails,
                    numeroTarjeta: formattedValue,
                  });
                }}
                maxLength={19}
                required
              />
              <input
                type="text"
                placeholder="Fecha de Expiración (MM/YY)"
                value={checkoutDetails.fechaExpiracion}
                onChange={e => {
                  const inputValue = e.target.value;
                  const cleanedValue = inputValue.replace(/\//g, '');
                  const formattedValue = cleanedValue
                    .replace(/\D/g, '')
                    .slice(0, 4)
                    .match(/.{1,2}/g)
                    ?.join('/') || '';

                  setCheckoutDetails({
                    ...checkoutDetails,
                    fechaExpiracion: formattedValue,
                  });
                }}
                maxLength={5}
                required
              />
              <input
                type="text"
                placeholder="Código de Seguridad"
                value={checkoutDetails.codigoSeguridad}
                onChange={e => {
                  const inputValue = e.target.value;
                  const formattedValue = inputValue.replace(/\D/g, '').slice(0, 3);

                  setCheckoutDetails({
                    ...checkoutDetails,
                    codigoSeguridad: formattedValue,
                  });
                }}
                maxLength={3}
                required
              />
              <div>
                <button onClick={prepareCheckout} className="boton-pago">
                  Realizar pago
                </button>
                <button onClick={handleCancelarPedido} className="boton-cancelar">
                  Cancelar
                </button>
              </div>
              </div>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Carrito;
