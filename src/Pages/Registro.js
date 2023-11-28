import React, { useState } from 'react';
import Data from '../data/Data.json';
import '../styles/Registro.css';

function Registro() {
  const [rut, setRut] = useState('');
  const [name, setName] = useState('');
  const [lastname_p, setLastname_p] = useState('');
  const [lastname_m, setLastname_m] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setRut('');
    setName('');
    setLastname_p('');
    setLastname_m('');
    setEmail('');
    setPhone_number('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      rut: rut,
      name: name,
      lastname_1: lastname_p,
      lastname_2: lastname_m,
      email: email,
      phone_number: phone_number,
      password: password,
      number: null,
      poblacion: null,
      street: null,
      description: null,
      sector: null
    };

    console.log('Datos del formulario:', userData);

    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert('Registrado exitosamente');
        resetForm();
      } else {
        alert('Ha ocurrido un error al registrarse. Por favor, inténtelo de nuevo :)');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <div className="registro-container">
      <div className='registro-group'>
        <h3>Regístrate</h3>
        <form onSubmit={handleSubmit}>
          <div className="registro-form-group">
            <label htmlFor="rut">RUT:</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
              placeholder="Ejemplo: 12345678"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ejemplo: Juan"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="lastname_p">Apellido Paterno:</label>
            <input
              type="text"
              id="lastname_p"
              name="lastname_p"
              value={lastname_p}
              onChange={(e) => setLastname_p(e.target.value)}
              required
              placeholder="Ejemplo: Pérez"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="lastname_m">Apellido Materno:</label>
            <input
              type="text"
              id="lastname_m"
              name="lastname_m"
              value={lastname_m}
              onChange={(e) => setLastname_m(e.target.value)}
              required
              placeholder="Ejemplo: Gómez"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ejemplo: juan@example.com"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="phone_number">Número de Teléfono:</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
              required
              placeholder="Ejemplo: 912345678"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ejemplo: Una contraseña segura, min: 8"
            />
          </div>
          <div className="registro-form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repite la contraseña"
            />
          </div>
          <button className="registro-button" type="submit">
            Registrarse
          </button>
          <p>
            ¿Ya tienes una cuenta?
            <a href="/Login">{Data.loginLink}</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registro;
