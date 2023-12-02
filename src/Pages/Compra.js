import React from 'react';
import '../styles/Compra.css';

const Compra = () => {
  return (
    <div className="fondo-compra-container">
      <div className="contenedor-compra">
        <h2>Gracias por tu compra!</h2>
        <p>Su orden fue completada exitosamente.</p>
        <button>Ver mi pedido</button>
      </div>
    </div>
  );
};

export default Compra;
