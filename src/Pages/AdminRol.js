import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../styles/AdminRol.css';

function AdminRol() {
  const [rol, setRol] = useState([]);
  const [newRol, setNewRol] = useState("");
  const [editedRoles, setEditedRoles] = useState({});
  const [editedRol, setEditedRol] = useState("");
  const [editedRoleId, setEditedRoleId] = useState("");

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/rol');
        if (!response.ok) {
          throw new Error('Error al obtener los roles');
        }
        const data = await response.json();
        setRol(data.roles);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchRol();
  }, []);

  const handleNewRolSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/rol/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: newRol }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar un nuevo rol');
      }

      const updatedRol = await response.json();
      if (updatedRol && updatedRol.categories) {
        const updatedCategoriesArray = Object.values(updatedRol.categories);

        setRol((prevRol) => [...prevRol, ...updatedCategoriesArray]);

        console.log('Nuevo rol agregado con éxito');
        setNewRol("");
      } else {
        console.error('La respuesta no contiene datos de categorías válidos.');
      }
    } catch (error) {
      console.error('Error al agregar un nuevo rol:', error);
    }
  };

  const handleEditClick = (rolId, rolName) => {
    setEditedRoles({ ...editedRoles, [rolId]: true });
    setEditedRol(rolName);
    setEditedRoleId(rolId);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/rol/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol_id: editedRoleId, rol: editedRol }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el rol');
      }

      setRol((prevRol) =>
        prevRol.map((rol) =>
          rol.id_rol === editedRoleId ? { ...rol, rol: editedRol } : rol
        )
      );

      setEditedRoles({});
      setEditedRol("");
      setEditedRoleId("");
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
    }
  };

  const handleCancelEdit = (rolId) => {
    const updatedEditedRoles = { ...editedRoles };
    delete updatedEditedRoles[rolId];
    setEditedRoles(updatedEditedRoles);
    setEditedRol("");
    setEditedRoleId("");
  };

 
const handleDeleteClick = async (rolId) => {
  try {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este rol?");
    
    if (confirmDelete) {
      const response = await fetch('https://entreraices-production.up.railway.app/api/rol/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol_id: rolId }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      const rolToDelete = rol.find((rol) => rol.id_rol === rolId);
      console.log('Datos a eliminar:', rolToDelete);

      setRol((prevRol) => prevRol.filter((rol) => rol.id_rol !== rolId));
      console.log('Rol eliminado con éxito:', rolId);
    }
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
  }
};

  return (
    <div className="admin-rol-container">
      <Link to="/AdminPage" className="back-to-admin-link-rol">
        <i className="fas fa-arrow-left"></i> Volver
      </Link>
      <h1 className="admin-rol-title">Gestión de roles</h1>
      <form className="admin-rol-form" onSubmit={handleNewRolSubmit}>
        <label className="admin-rol-label" htmlFor="rol">
          ¿Quieres ingresar un nuevo rol?:
        </label>
        <input
          className="admin-rol-input"
          type="text"
          id="rol"
          name="rol"
          value={newRol}
          onChange={(e) => setNewRol(e.target.value)}
          required
        />
        <button className="admin-rol-button" type="submit">
          Agregar
        </button>
      </form>
      <table className="admin-rol-table">
        <thead>
          <tr>
            <th className="admin-rol-th">Nombre de Rol</th>
            <th className="admin-rol-th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rol.map((rolItem) => (
            <tr key={rolItem.id_rol} className="admin-rol-even-row">
              <td className="admin-rol-cell">
                {editedRoles[rolItem.id_rol] ? (
                  <input
                    type="text"
                    value={editedRol}
                    onChange={(e) => setEditedRol(e.target.value)}
                  />
                ) : (
                  rolItem.rol
                )}
              </td>
              <td className="admin-rol-cell">
                {editedRoles[rolItem.id_rol] ? (
                  <>
                    <button
                      className="admin-rol-action-button"
                      onClick={handleSaveEdit}
                    >
                      Guardar
                    </button>
                    <button
                      className="admin-rol-action-button"
                      onClick={() => handleCancelEdit(rolItem.id_rol)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-rol-action-button"
                      onClick={() => handleEditClick(rolItem.id_rol, rolItem.rol)}
                    >
                      Modificar
                    </button>
                    <button
                      className="admin-rol-action-button"
                      onClick={() => handleDeleteClick(rolItem.id_rol)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRol;
