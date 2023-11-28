import React, { useState } from 'react';
import Data from '../data/Data.json';
import './../styles/CambioContrasena.css';

function CambioContrasena() {
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmNewPassword) {
      const requestData = {
        email: email,
        password: newPassword,
        username: rut
      };

      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/account/password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          alert('Contraseña cambiada exitosamente');
          const data = await response.json();
          console.log('Respuesta del servidor:', data);
        } else {
          alert('Ha ocurrido un error al cambiar la contraseña. Por favor, inténtelo de nuevo.');
        }
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
      }
    } else {
      alert('Las contraseñas nuevas no coinciden. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="cambio-contrasena-container">
      <h3>Cambio de Contraseña</h3>
      <form onSubmit={handleSubmit}>
        <div className="cambio-contrasena-form-group">
          <input
            type="text"
            id="rut"
            name="rut"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
            placeholder="RUT sin digito verificador"
          />
        </div>
        <div className="cambio-contrasena-form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div className="cambio-contrasena-form-group">
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Nueva Contraseña"
          />
        </div>
        <div className="cambio-contrasena-form-group">
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            placeholder="Confirmar Nueva Contraseña"
          />
        </div>
        <button className="cambio-contrasena-button" type="submit">
          Cambiar Contraseña
        </button>
      </form>
      <p>
        ¿Recordaste tu contraseña?
        <a href="/Login">{Data.loginLink}</a>
      </p>
    </div>
  );
}

export default CambioContrasena;
