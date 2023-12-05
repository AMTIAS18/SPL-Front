import React, { useState, useEffect } from 'react';

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
        setOrders(data.msg);
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
    <div>
      <h2>Gestión de Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID Detalle Boleta</th>
            <th>Fecha Creación</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Usuario</th>
            <th>RUT</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id_detalle_boleta}>
              <td>{order.id_detalle_boleta}</td>
              <td>{order.fecha_creacion}</td>
              <td>{order.nombre_producto}</td>
              <td>{order.cantidad}</td>
              <td>{order.nombre_usuario}</td>
              <td>{order.rut}</td>
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