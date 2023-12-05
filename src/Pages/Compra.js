import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Compra.css';

const Compra = () => {
  const navigate = useNavigate();

  const handleVerPedido = () => {
    navigate('/UserOrderStatus');
  };

  return (
    <div className="fondo-compra-container">
      <div className="contenedor-compra">
        <h2>Gracias por su compra!</h2>
        <p>Su orden fue completada exitosamente.</p>
        <button onClick={handleVerPedido}>Ver mi pedido</button>
      </div>
    </div>
  );
};

export default Compra;
