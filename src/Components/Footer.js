import React from 'react';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-left">
        <h2>TE ESPERAMOS</h2>
        
        <div className="footer-section">
          <h3>MARTES-MIÉRCOLES-JUEVES</h3>
          <p>ALMUERZO: 13:00 PM – 16:00 PM</p>
          <p>NOCHE: 18:15 PM – 00:00 AM</p>
        </div>

        <div className="footer-section">
          <h3>VIERNES</h3>
          <p>ALMUERZO: 13:00 PM – 16:00 PM</p>
          <p>NOCHE: 18:15 PM – 01:00 AM</p>
        </div>

        <div className="footer-section">
          <h3>SÁBADO</h3>
          <p>18:30 PM – 01:00 AM</p>
        </div>
      </div>

      <div className="footer-right">
        <h2>Contacto</h2>
        <p>WHATSAPP DE PEDIDOS</p>
        <p>+569 32975667</p>
        <p>EMAIL</p>
        <p>hola@cerveceriaentrepueblos.cl</p>
        <p>DIRECCIÓN</p>
        <p>Bernardo Ohiggins #2, Curepto</p>
        <p>Frente a Plaza de Armas</p>

        <div className="social-icons">
          <a href="https://www.instagram.com/cerveceriaentrepueblos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={30} />
          </a>
          <a href="https://www.facebook.com/cerveceriaentrepueblos" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook size={30} />
          </a>
          <a href="https://twitter.com/tu_usuario/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter size={30} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;