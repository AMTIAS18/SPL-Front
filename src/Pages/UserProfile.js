import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import '../styles/UserProfile.css';

function UserProfile() {
  const { user } = useUser();
  const [rut, setRut] = useState(user.rut);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [addressData, setAddressData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isEditingData, setIsEditingData] = useState(false);

  const fetchUserData = async (rut) => {
    try {
      const userResponse = await fetch('https://entreraices-production.up.railway.app/api/user');
      if (!userResponse.ok) {
        console.error('No se pudo obtener la información del usuario');
        return;
      }
  
      const usersData = await userResponse.json();
      const currentUser = usersData.find((userData) => userData.rut === rut);
  
      if (!currentUser) {
        console.error('No se encontró el usuario');
        return;
      }
  
      setUserDetails(currentUser);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  const fetchUserAddress = async (rut) => {
    try {
      const userResponse = await fetch('https://entreraices-production.up.railway.app/api/user');
      if (!userResponse.ok) {
        console.error('No se pudo obtener la información del usuario');
        return;
      }

      const usersData = await userResponse.json();
      const currentUser = usersData.find((userData) => userData.rut === rut);

      if (!currentUser || !currentUser.id_direccion) {
        console.error('No se encontraron datos de dirección para el usuario');
        return;
      }

      const addressResponse = await fetch('https://entreraices-production.up.railway.app/api/address');
      if (!addressResponse.ok) {
        console.error('No se pudo obtener la información de dirección');
        return;
      }

      const addressData = await addressResponse.json();

      if (!addressData.success || !Array.isArray(addressData.data) || addressData.data.length === 0) {
        console.error('Datos de dirección no son válidos o están vacíos');
        return;
      }

      const userAddress = addressData.data.find((address) => address.id_direccion === currentUser.id_direccion);

      if (!userAddress) {
        console.error('Dirección no encontrada para el usuario');
        return;
      }

      setAddressData([userAddress]);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchUserAddress(user.rut);
    fetchUserData(user.rut);
  }, [user.rut]);
  

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const updatedUserData = {
      id_usuario: userDetails.id_usuario,
      rut: userDetails.rut,
      name: userDetails.nombre,
      lastname_1: userDetails.apellido_p,
      lastname_2: userDetails.apellido_m,
      email: userDetails.correo,
      id_address: userDetails.id_direccion,
      phone_number: userDetails.num_telefono,
    };

  try {
    const response = await fetch('https://entreraices-production.up.railway.app/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUserData),
    });

    if (response.ok) {
      setIsEditingData(false);
    } else {
      console.error('Error al actualizar los datos:', response.statusText);
    }
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
  }
};
  

  const handleSaveEditedAddress = async (e) => {
    e.preventDefault();
  
    const updatedAddress = {
      address_id: addressData[0].id_direccion,
      number_house: parseInt(addressData[0].numero_casa) || 0,
      street: addressData[0].calle || null,
      town: addressData[0].poblacion || null,
      description: addressData[0].descripcion || null,
      sector: addressData[0].sector || null,
    };
  
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/address/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAddress),
      });
  
      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Error al actualizar la dirección:', response.statusText);
      } 
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (newPassword === confirmNewPassword) {
      const requestData = {
        email: user.correo,
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

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?');
  
    if (confirmDelete) {
      const requestData = {
        id_cuenta: user.id_cuenta,
      };
  
      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/account/deletestate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        if (response.ok) {
          console.log('Cuenta eliminada exitosamente');
          window.location.href = '/';
        } else {
          console.error('Error al eliminar la cuenta:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
      }
    } else {
      console.log('Cancelado');
    }
  };
  

  return (
    <div className="user-profile-container">
      <Link to="/" className="back">
        <i className="fas fa-arrow-left"></i> Ir a inicio
      </Link>
      <h2>Mi Perfil</h2>
      <div className="info-section">
        <h3 className='address-header'>
          Información Personal{''}
          <span className='modify-link'>
            <button onClick={() => setIsEditingData(true)} className="modify-button">(Modificar datos )</button>
          </span>
        </h3>
        {isEditingData ? (
          <form onSubmit={handleSaveChanges}>
            <div>
              <p><strong>RUT:</strong> {user.rut}</p>
              <p><strong>Nombre:</strong> <input type="text" value={userDetails.nombre || ''} onChange={(e) => setUserDetails({ ...userDetails, nombre: e.target.value })} /></p>
              <p><strong>Apellido Paterno:</strong> <input type="text" value={userDetails.apellido_p || ''} onChange={(e) => setUserDetails({ ...userDetails, apellido_p: e.target.value })} /></p>
              <p><strong>Apellido Materno:</strong> <input type="text" value={userDetails.apellido_m || ''} onChange={(e) => setUserDetails({ ...userDetails, apellido_m: e.target.value })} /></p>
              <p><strong>Correo:</strong> <input type="text" value={userDetails.correo || ''} onChange={(e) => setUserDetails({ ...userDetails, correo: e.target.value })} /></p>
              <p><strong>Celular:</strong> <input type="text" value={userDetails.num_telefono || ''} onChange={(e) => setUserDetails({ ...userDetails, num_telefono: e.target.value })} /></p>
            </div>
            <div className="edit-buttons">
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setIsEditingData(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>RUT:</strong> {user.rut}</p>
            <p><strong>Nombre:</strong> {userDetails.nombre}</p>
            <p><strong>Apellido Paterno:</strong> {userDetails.apellido_p}</p>
            <p><strong>Apellido Materno:</strong> {userDetails.apellido_m}</p>
            <p><strong>Correo:</strong> {userDetails.correo}</p>
            <p><strong>Celular:</strong> {userDetails.num_telefono}</p>
          </div>
        )}
      </div>
      <div className='address-section'>
        <h3 className='address-header'>
          Dirección{''}
          <span className='modify-link'>
            <button onClick={() => setIsEditing(true)} className="modify-button">(Modificar datos)</button>
          </span>
        </h3>
        {isEditing ? (
          <form onSubmit={handleSaveEditedAddress}>
            <div>
              <p><strong>Calle:</strong> <input type="text" value={addressData[0]?.calle || ''} onChange={(e) => setAddressData([{ ...addressData[0], calle: e.target.value }])} /></p>
              <p><strong>Número:</strong> <input type="text" value={addressData[0]?.numero_casa || ''} onChange={(e) => setAddressData([{ ...addressData[0], numero_casa: e.target.value }])} /></p>
              <p><strong>Población:</strong> <input type="text" value={addressData[0]?.poblacion || ''} onChange={(e) => setAddressData([{ ...addressData[0], poblacion: e.target.value }])} /></p>
              <p><strong>Descripción:</strong> <input type="text" value={addressData[0]?.descripcion || ''} onChange={(e) => setAddressData([{ ...addressData[0], descripcion: e.target.value }])} /></p>
              <p><strong>Sector:</strong> <input type="text" value={addressData[0]?.sector || ''} onChange={(e) => setAddressData([{ ...addressData[0], sector: e.target.value }])} /></p>
            </div>
            <div className="edit-buttons">
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Calle:</strong> {addressData[0]?.calle}</p>
            <p><strong>Número:</strong> {addressData[0]?.numero_casa}</p>
            <p><strong>Población:</strong> {addressData[0]?.poblacion}</p>
            <p><strong>Descripción:</strong> {addressData[0]?.descripcion}</p>
            <p><strong>Sector:</strong> {addressData[0]?.sector}</p>
          </div>
        )}
      </div>

      <div className="password-section">
        <h3>Cambio de Contraseña</h3>
        <form onSubmit={handleSubmitPassword}>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="RUT sin dígito verificador"
            readOnly
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva Contraseña"
          />
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirmar Nueva Contraseña"
          />
          <button type="submit">
            Cambiar Contraseña
          </button>
        </form>
      </div>
      <div>
      <h3>Eliminar cuenta</h3>
      <button type="button" onClick={handleDeleteAccount} className="delete-account-button">
        Eliminar cuenta
      </button>
    </div>
    </div>
  );
}

export default UserProfile;
