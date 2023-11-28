import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';


function Header() {
  return (
    <div className="header-container">
      <div className="header-logo">
        <h1>Restobar Entre Pueblos</h1>
      </div>
      <div className="header-nav">
        <Link to="/login" className="header-link">Login</Link>
        <Link to="/sobre-nosotros" className="header-link">Sobre Nosotros</Link>
      </div>
    </div>
  );
}

export default Header;