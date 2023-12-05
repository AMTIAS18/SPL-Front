import React, { useState, useEffect } from 'react';
import '../styles/Pedido.css';


function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/pedidos/all');
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
      if (data && Array.isArray(data.msg)) { 
        const ordersWithFormattedDate = data.msg.map(order => {
          const fechaCompleta = new Date(order.fecha);
          fechaCompleta.setHours(fechaCompleta.getHours());
          const dia = fechaCompleta.getDate().toString().padStart(2, '0');
          const mes = (fechaCompleta.getMonth() + 1).toString().padStart(2, '0');
          const año = fechaCompleta.getFullYear();
          const hora = fechaCompleta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const fechaYHora = `${dia}-${mes}-${año} ${hora}`;
          return {
            ...order,
            fechaYHora
          };
        });
        setOrders(ordersWithFormattedDate);
      } else {
      }
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    }
  };
  
  const handleOrderReady = async (idDetalleBoleta) => {
    try {
      const response = await fetch(`https://entreraices-production.up.railway.app/api/pedidos/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_detalle_boleta: idDetalleBoleta,
          estado: 'Listo'
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el pedido');
      }
  
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id_detalle_boleta === idDetalleBoleta
            ? { ...order, estado: 'Listo' }
            : order
        )
      );
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
    }
  };
  

  return (
    <div className='fondo-pedido-cajera'>
      <h2>Gestión de Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID Detalle Boleta</th>
            <th>Fecha emision</th>
            <th>RUT</th>
            <th>Nombre usuario</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map(order => (
            <tr key={order.id_detalle_boleta}>
              <td>{order.id_detalle_boleta}</td>
              <td>{order.fechaYHora}</td>
              <td>{order.rut}</td>
              <td>{order.nombre_usuario}</td>
              <td>{order.nombre_producto}</td>
              <td>{order.cantidad}</td>
              <td>{order.estado}</td>
              <td>
                <button onClick={() => handleOrderReady(order.id_detalle_boleta)}>
                  Marcar como Listo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;