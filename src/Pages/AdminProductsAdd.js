import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './../styles/AdminProductsAdd.css';

function AdminProductsAdd() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isRetreat, setIsRetreat] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [stock, setStock] = useState(0);
  const [portion, setPortion] = useState('');
  const [imageRoute, setImageRoute] = useState('');
  const [value, setValue] = useState(0);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim());
  
    const formattedData = {
      category_id: selectedCategory,
      product_name: productName,
      ingredients: ingredientsArray,
      retreat: isRetreat,
      limited: isLimited,
      stock: parseInt(stock, 10),
      portion: portion,
      image_route: imageRoute,
      value: parseInt(value, 10),
    };
  
    console.log('Datos a enviar:', formattedData);
  
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        console.log('Los datos se enviaron correctamente.');
        setSelectedCategory('');
        setSelectedCategoryName('');
        setProductName('');
        setIngredients('');
        setIsRetreat(false);
        setIsLimited(false);
        setStock(0);
        setPortion('');
        setImageRoute('');
        setValue(0);
      } else {
        console.error('Error al enviar los datos.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('https://entreraices-production.up.railway.app/api/categories');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error('Los datos no están en el formato esperado.');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="admin-products-add-container">
      <h1 className="admin-products-add-title">Agregar Productos</h1>
      <div className='admin-products-add-form-container'>
        <form className='admin-products-add-form' onSubmit={handleFormSubmit}>
          <div className="category-select">
            <label>Categoría:</label>
            <select
              value={selectedCategoryName}
              onChange={(e) => {
                const selectedCategory = e.target.value;
                setSelectedCategoryName(selectedCategory);
                const selectedCategoryId = categories.find((category) => category.nombre === selectedCategory).id_categoria;
                setSelectedCategory(selectedCategoryId);
              }}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category, index) => (
                <option key={index} value={category.nombre}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-products">
            <label>Nombre del producto:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej: Cheeseburger"
            />
          </div>
  
          <div className="form-group-products">
            <label>Ingredientes:</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Ej: Queso,Palta,Tomate"
            />
          </div>

          <div className="form-group-radio-group">
            <label>Retiro:</label>
            <label>
              <input
                type="radio"
                name="retreat"
                value="true"
                checked={isRetreat === true}
                onChange={() => setIsRetreat(true)}
              />
              True
            </label>
            <label>
              <input
                type="radio"
                name="retreat"
                value="false"
                checked={isRetreat === false}
                onChange={() => setIsRetreat(false)}
              />
              False
            </label>
          </div>

          <div className="form-group radio-group">
            <label>Limitado:</label>
            <label>
              <input
                type="radio"
                name="limited"
                value="true"
                checked={isLimited === true}
                onChange={() => setIsLimited(true)}
              />
              True
            </label>
            <label>
              <input
                type="radio"
                name="limited"
                value="false"
                checked={isLimited === false}
                onChange={() => setIsLimited(false)}
              />
              False
            </label>
          </div>


          <div className="form-group-products">
            <label>Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="100"
            />
          </div>

          <div className="form-group-products">
            <label>Porción:</label>
            <input
              type="text"
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              placeholder="Porción"
            />
          </div>

          <div className="form-group-products">
            <label>Ruta de imagen:</label>
            <input
              type="text"
              value={imageRoute}
              onChange={(e) => setImageRoute(e.target.value)}
              placeholder="Ej: cheeseburger.png"
            />
          </div>

          <div className="form-group-products">
            <label>Precio:</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ej: 6490"
            />
          </div>
          <button type="submit" className="product-button">Guardar</button>
          <Link to="/AdminProducts" className="back-link-products">
            Volver
          </Link>
        </form>
      </div>
    </div>
  );
}
export default AdminProductsAdd;
