import React from 'react';
import '../styles/MenuCard.css';

const MenuCard = ({ menu }) => {
    return (
        <div className="menu-card">
            <div className="menu-card-content">
                <h3>{menu.nombre}</h3>
                <p>{menu.ingredientes ? menu.ingredientes.join(', ') : ''}</p>
                <p>Precio: ${menu.valor_unitario}</p>
            </div>
            <img src={menu.ruta_imagen} alt={menu.nombre} className="menu-card-image"/>
        </div>
    );
};

export default MenuCard;