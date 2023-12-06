import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './../styles/AdminProducts.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/products');
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/categories');
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error en la solicitud de categorías:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    const updatedProductInEnglish = {
      product_id: updatedProduct.id_producto,
      category_id: updatedProduct.id_categoria,
      product_name: updatedProduct.nombre,
      ingredients: updatedProduct.ingredientes,
      retreat: updatedProduct.retiro_local,
      limited: updatedProduct.limitado,
      stock: updatedProduct.stock,
      portion: updatedProduct.porcion,
      image_route: updatedProduct.ruta_imagen,
      value: updatedProduct.valor_unitario,
    };

    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/products/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductInEnglish),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud de actualización: ${response.status} ${response.statusText}`);
      }

      fetchProducts();

      setSelectedProduct(null);
      setUpdatedProduct({});

      console.log('Producto actualizado en la base de datos');
    } catch (error) {
      console.error('Error al actualizar el producto en la base de datos:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/products/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud de eliminación: ${response.status} ${response.statusText}`);
      }

      fetchProducts();

      console.log('Producto eliminado de la base de datos');
    } catch (error) {
      console.error('Error al eliminar el producto en la base de datos:', error);
    }
  };

  const getProductsByCategory = () => {
    if (selectedCategory === '') {
      return products;
    }
    return products.filter((product) => product.id_categoria === selectedCategory);
  };

  const filteredProducts = getProductsByCategory();

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <Link to="/AdminPage" className="back-to-admin-link-products">
          <i className="fas fa-arrow-left"></i> Volver
        </Link>
        <h1 className="admin-products-title">Gestión de Productos</h1>
        <Link to="/AdminProductsAdd" className="add-products-link">
          Agregar Productos
        </Link>
      </div>
      <div className="category-filter">
        <label htmlFor="category-filter">Filtrar por Categoría:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id_categoria} value={category.id_categoria}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="table-products-container">
        <table>
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Ingredientes</th>
              <th>Retiro Local</th>
              <th>Limitado</th>
              <th>Stock</th>
              <th>Porción</th>
              <th>Precio</th>
              <th>Ruta imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id_producto}>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="text"
                      value={updatedProduct.nombre}
                      onChange={(e) => setUpdatedProduct({ ...updatedProduct, nombre: e.target.value })}
                    />
                  ) : (
                    product.nombre
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="text"
                      value={updatedProduct.ingredientes}
                      onChange={(e) => {
                        const ingredientsArray = e.target.value.split(',');
                        setUpdatedProduct({ ...updatedProduct, ingredientes: ingredientsArray });
                      }}
                    />
                  ) : (
                    product.ingredientes.join(', ')
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="checkbox"
                      checked={updatedProduct.retiro_local}
                      onChange={(e) => setUpdatedProduct({ ...updatedProduct, retiro_local: e.target.checked })}
                    />
                  ) : (
                    product.retiro_local ? 'Sí' : 'No'
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="checkbox"
                      checked={updatedProduct.limitado}
                      onChange={(e) => setUpdatedProduct({ ...updatedProduct, limitado: e.target.checked })}
                    />
                  ) : (
                    product.limitado ? 'Sí' : 'No'
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="number"
                      value={updatedProduct.stock}
                      onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock: parseInt(e.target.value) })}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="text"
                      value={updatedProduct.porcion}
                      onChange={(e) => setUpdatedProduct({ ...updatedProduct, porcion: e.target.value })}
                    />
                  ) : (
                    product.porcion
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="number"
                      value={updatedProduct.valor_unitario || ''}
                      onChange={(e) =>
                        setUpdatedProduct({ ...updatedProduct, valor_unitario: parseFloat(e.target.value) })
                      }
                    />
                  ) : (
                    product.valor_unitario !== undefined ? `$${product.valor_unitario.toFixed(2)}` : 'N/A'
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <input
                      type="text"
                      value={updatedProduct.ruta_imagen}
                      onChange={(e) => setUpdatedProduct({ ...updatedProduct, ruta_imagen: e.target.value })}
                    />
                  ) : (
                    product.ruta_imagen
                  )}
                </td>
                <td>
                  {selectedProduct && selectedProduct.id_producto === product.id_producto ? (
                    <div>
                      <button onClick={handleUpdateProduct}>Guardar</button>
                      <button onClick={() => setSelectedProduct(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => handleEditProduct(product)}>Editar</button>
                      <button onClick={() => handleDeleteProduct(product.id_producto)}>Eliminar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
