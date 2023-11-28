import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../styles/AdminCategoriesAdd.css';

function AdminCategoriesAdd() {
  const [newCategory, setNewCategory] = useState({
    category_name: '',
    image_link: '',
    description: '',
    type: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Error al agregar una nueva categoría');
      }

      setNewCategory({
        category_name: '',
        image_link: '',
        description: '',
        type: '',
      });


      console.log('Nueva categoría agregada con éxito:', newCategory);
    } catch (error) {
      console.error('Error al agregar la categoría en la base de datos:', error);
    }
  };

  return (
    <div className="admin-categories-add-container">
      <h1 className="admin-categories-add-title">Agregar Categoría</h1>
      <div className="admin-categories-add-form-container">
        <form className="admin-categories-add-form">
          <div className="form-group-categories">
            <label>Nombre de la Categoría:</label>
            <input
              type="text"
              name="category_name"
              value={newCategory.category_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-categories">
            <label>Ruta de Imagen:</label>
            <input
              type="text"
              name="image_link"
              value={newCategory.image_link}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-categories">
            <label>Descripción:</label>
            <input
              type="text"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-categories">
            <label>Tipo:</label>
            <input
              type="text"
              name="type"
              value={newCategory.type}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" onClick={handleAddCategory}>
            Agregar Categoría
          </button>
          <Link to="/AdminCategories" className="back-link">
            Volver
          </Link>
        </form>
      </div>
    </div>
  );
}

export default AdminCategoriesAdd;
