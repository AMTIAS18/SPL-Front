import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../styles/AdminCategories.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSaveCategory = async () => {
    if (editingCategory) {
      const updatedCategory = {
        category_id: editingCategory.id_categoria,
        category_name: editingCategory.nombre,
        image_link: editingCategory.ruta_imagen,
        description: editingCategory.descripcion,
        type: editingCategory.tipo,
      };

      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/categories/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCategory),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la categoría');
        }

        const updatedCategories = categories.map((category) =>
          category.id_categoria === updatedCategory.category_id ? editingCategory : category
        );
        setCategories(updatedCategories);

        setEditingCategory(null);

        console.log('Datos de la categoría actualizados:', updatedCategory);
      } catch (error) {
        console.error('Error al actualizar la categoría en la base de datos:', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        const data = {
          category_id: categoryId,
        };
  
        const response = await fetch('https://entreraices-production.up.railway.app/api/categories/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Error al eliminar la categoría');
        }
  
        const updatedCategories = categories.filter((category) => category.id_categoria !== categoryId);
        setCategories(updatedCategories);
  
        console.log('Categoría eliminada exitosamente:', categoryId);
      } catch (error) {
        console.error('Error al eliminar la categoría en la base de datos:', error);
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/categories');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error('Los datos de la API no son un array de categorías:', data);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="admin-categories-container">
      <div className="admin-header">
        <Link to="/AdminPage" className="back-to-admin-link-categories">
          <i className="fas fa-arrow-left"></i> Volver
        </Link>
        <h3 className="admin-categories-title">Categorías</h3>
        <Link to="/AdminCategoriesAdd" className="add-categories-link">Agregar Categoría</Link>
      </div>
      <table className="admin-categories-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ruta de Imagen</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id_categoria}>
              <td>
                {editingCategory && editingCategory.id_categoria === category.id_categoria ? (
                  <input
                    type="text"
                    value={editingCategory.nombre}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nombre: e.target.value })}
                  />
                ) : (
                  category.nombre
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id_categoria === category.id_categoria ? (
                  <input
                    type="text"
                    value={editingCategory.ruta_imagen}
                    onChange={(e) => setEditingCategory({ ...editingCategory, ruta_imagen: e.target.value })}
                  />
                ) : (
                  category.ruta_imagen
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id_categoria === category.id_categoria ? (
                  <input
                    type="text"
                    value={editingCategory.descripcion}
                    onChange={(e) => setEditingCategory({ ...editingCategory, descripcion: e.target.value })}
                  />
                ) : (
                  category.descripcion
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id_categoria === category.id_categoria ? (
                  <input
                    type="text"
                    value={editingCategory.tipo}
                    onChange={(e) => setEditingCategory({ ...editingCategory, tipo: e.target.value })}
                  />
                ) : (
                  category.tipo
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id_categoria === category.id_categoria ? (
                  <div classname="edit-buttons-categories">
                    <button onClick={handleSaveCategory}>Guardar</button>
                    <button onClick={handleCancelEdit}>Cancelar</button>
                  </div>
                ) : (
                  <div classname="edit-buttons-categories">
                    <button onClick={() => handleEditCategory(category)}>Editar</button>
                    <button onClick={() => handleDeleteCategory(category.id_categoria)}>Eliminar</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;
