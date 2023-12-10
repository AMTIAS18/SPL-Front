import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PedidosListos.css';

function UserPedidosListos() {
  const [pedidosListos, setPedidosListos] = useState([]);
  const id_usuario = localStorage.getItem('id_usuario');
  const pollInterval = 30000;

  useEffect(() => {
    const fetchPedidosListos = async () => {
      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/pedidos/ready', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_usuario }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los pedidos listos');
        }

        const data = await response.json();
        const pedidosConFechaFormateada = data.msg.map(pedido => {
          const fechaCompleta = new Date(pedido.fecha_creacion);
          const dia = fechaCompleta.getDate().toString().padStart(2, '0');
          const mes = (fechaCompleta.getMonth() + 1).toString().padStart(2, '0');
          const año = fechaCompleta.getFullYear();
          const hora = fechaCompleta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const fechaFormateada = `${dia}-${mes}-${año} ${hora}`;
          return {
            ...pedido,
            fecha_creacion: fechaFormateada,
          };
        });

        setPedidosListos(pedidosConFechaFormateada);
      } catch (error) {
        console.error('Error al cargar los pedidos listos:', error);
      }
    };

    const interval = setInterval(fetchPedidosListos, pollInterval);

    if (id_usuario) {
      fetchPedidosListos();
    }

    return () => clearInterval(interval);
  }, [id_usuario]);

  return (
    <div className='fondo-user-pedidos-listos'>
      <div className='user-pedidos-listos'>
        <Link to="/UserOrderStatus" className="back-to-admin-link-products">
          <i className="fas fa-arrow-left"></i> Volver
        </Link>
        <h2>Pedidos Listos</h2>
        <table>
          <thead>
            <tr>
              <th>ID Detalle Boleta</th>
              <th>Fecha de Creación</th>
              <th>Nombre del Producto</th>
              <th>Cantidad</th>
              <th>Nombre del Usuario</th>
              <th>RUT</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosListos.slice(0).reverse().map(pedido => (
              <tr key={pedido.id_detalle_boleta}>
                <td>{pedido.id_detalle_boleta}</td>
                <td>{pedido.fecha_creacion}</td>
                <td>{pedido.nombre_producto}</td>
                <td>{pedido.cantidad}</td>
                <td>{pedido.nombre_usuario}</td>
                <td>{pedido.rut}</td>
                <td>{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserPedidosListos;
