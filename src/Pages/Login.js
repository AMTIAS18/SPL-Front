import React, { useState } from 'react';
import './../styles/Login.css';
import Data from '../data/Data.json';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAdmin, setUser }) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: rut,
      password: password
    };

    console.log('Datos del formulario:', userData);

    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        try {
          const data = await response.json();
          console.log('Respuesta del servidor:', data);
      
          if (data.message === 'accepted' && data.userdata.length > 0) {
            const user = data.userdata[0];
            setUser(user);
            setAuthToken(data.token);

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', data.token);
            localStorage.setItem('id_usuario', user.id_usuario);
            localStorage.setItem('rut', user.rut);
            console.log('Respuesta del servidor:', data);
            
      
            if (user.actividad === 'BLOQUEADO') {
              alert('Esta cuenta ha sido bloqueada, por favor contacta al soporte.');
              handleLogout();
              return;
            }
      
            if (user.actividad === 'ELIMINADO') {
              alert('Lo sentimos, tu cuenta ha sido eliminada.');
              handleLogout();
              return;
            }
      
            if (user.rol === 'ADMIN') {
              setIsAdmin(true);
              navigate('/');
            } else if (user.rol === 'CLIENTE') {
              setIsAdmin(false);
              navigate('/');
            } else if (user.rol === 'CAJERO') {
              navigate('/');
            }            
          } else {
            alert('Credenciales incorrectas. Intente de nuevo.');
          }
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
        }
      } else {
        alert('Ha ocurrido un error al iniciar sesión o credenciales incorrectas. Intente de nuevo.');
      } 
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/Login');
  };

  return (
    <div className="login-container">
      <div className="barra"></div>
      <img src={Data.logoSrc} alt="Logo" className="logo-image" />
      <div className="login-box">
        <h2>{Data.pageTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
          <button className="login-button" type="submit">
            Iniciar Sesión
          </button>
        </form>
        <p>
          <a href="/CambioContrasena">{Data.forgotPasswordLink}</a>
        </p>
        <p>
          ¿No tienes cuenta?
          <a href="/Registro">{Data.registerLink}</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
