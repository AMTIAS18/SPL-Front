import React, { useState, useEffect } from 'react';
import '../styles/Direccion.css';

const Direccion = () => {
  const [direccion, setDireccion] = useState({
    numero_casa: '',
    calle: '',
    poblacion: '',
    descripcion: '',
    sector: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserAddress = async (userId) => {
    try {
      const userResponse = await fetch('https://entreraices-production.up.railway.app/api/user');
      const userData = await userResponse.json();
  
      const user = userData.find(user => user.id_usuario === userId);
  
      if (!user) {
        console.error('Usuario no encontrado');
        return;
      }
  
      const addressResponse = await fetch('https://entreraices-production.up.railway.app/api/address');
      const addressData = await addressResponse.json();
  
      if (!Array.isArray(addressData)) {
        console.error('Datos de dirección no válidos');
        return;
      }
  
      const userAddressId = user ? user.id_direccion : null;
      const userAddressData = addressData.find(address => address.id_direccion === userAddressId);
  
      if (userAddressData) {
        setDireccion({
          numero_casa: userAddressData.numero_casa || '',
          calle: userAddressData.calle || '',
          poblacion: userAddressData.poblacion || '',
          descripcion: userAddressData.descripcion || '',
          sector: userAddressData.sector || ''
        });
      } else {
        console.error('Dirección no encontrada para el usuario');
      }
  
    } catch (error) {
      console.error('Error al obtener la dirección del usuario:', error);
    }
  };  
  
  useEffect(() => {
    const userId = localStorage.getItem('id_usuario');
    if (userId) {
      fetchUserAddress(userId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDireccion({ ...direccion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Nueva dirección:', direccion);
    setIsEditing(false);
    // Agregar lógica para guardar la dirección del usuario
    // fetch('URL_API', { method: 'PUT', body: { userId, direccion } })
  };
  
  return (
    <div className="direccion-container">
      <h2>Dirección de Envío</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numero_casa">Número de Casa:</label>
          <input
            type="text"
            id="numero_casa"
            name="numero_casa"
            value={direccion.numero_casa}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="calle">Calle:</label>
          <input
            type="text"
            id="calle"
            name="calle"
            value={direccion.calle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="poblacion">Población:</label>
          <input
            type="text"
            id="poblacion"
            name="poblacion"
            value={direccion.poblacion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={direccion.descripcion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sector">Sector:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={direccion.sector}
            onChange={handleInputChange}
            required
          />
        </div>
        {!isEditing && (
          <button type="button" onClick={() => setIsEditing(true)}>Editar Dirección</button>
        )}
        {isEditing && (
          <div>
            <button type="submit">Guardar Dirección</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Direccion;
