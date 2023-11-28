import React, { useContext } from 'react';
import { CartContext } from '../Components/CartContext';
import '../styles/carro.css'; 

const Carro = () => {
    const [cart, , removeFromCart] = useContext(CartContext);

    const handleRemove = (index) => {
        removeFromCart(index);
    };

    return (
        <div className="carro-container">
            <h2>Carro de Compras</h2>
            {cart.length === 0 ? (
                <p>Sin productos añadidos</p>
            ) : (
                <ul className="carro-list">
                    {cart.map((item, index) => (
                        <li key={index} className="carro-item">
                            <div className="producto">
                                <img src={(item.imagen)} alt={item.nombre} />
                                <span>{item.nombre}</span>
                            </div>
                            <span className="precio">${item.precio}</span>
                            <input type="number" defaultValue={1} />
                            <button className="add-note">Añadir nota</button>
                            <button className="remove" onClick={() => handleRemove(index)}>x</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Carro;
