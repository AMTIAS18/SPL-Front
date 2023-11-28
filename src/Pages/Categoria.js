import React, { useContext, useEffect, useState } from 'react';
import MenuCard from '../Components/MenuCard';
import CartButton from '../Components/CartButton';
import { CartContext } from '../Components/CartContext';
import { useParams } from 'react-router-dom';
import '../styles/HomePage.css';


const Categoria = () => {
    const { setCart } = useContext(CartContext); 
    const { categoriaId } = useParams();
    const [menuData, setMenuData] = useState([]);
    const [categoriaName, setCategoriaName] = useState('');
    const [CategoriaDescripcion, setCategoriaDescripcion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://entreraices-production.up.railway.app/api/products/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener datos');
                }
                return response.json();
            })
            .then(data => {
                const filteredProducts = data.filter(product => product.id_categoria === categoriaId);
                setMenuData(filteredProducts);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [categoriaId]);

    useEffect(() => {
        fetch('https://entreraices-production.up.railway.app/api/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener datos de las categorías');
                }
                return response.json();
            })
            .then(data => {
                const category = data.categories.find(cat => cat.id_categoria === categoriaId);
                if (category) {
                    setCategoriaName(category.nombre);
                    setCategoriaDescripcion(category.descripcion)
                }
            })
            .catch(err => {
                console.error("Hubo un problema con la petición fetch de las categorías:", err);
            });
    }, [categoriaId]);

    const handleAddToCart = (item) => {
        setCart(prevCart => [...prevCart, item]);
    };

    const leftMenuData = menuData.slice(0, 7);
    const rightMenuData = menuData.slice(7);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar datos: {error.message}</p>;

    return (
        <div className="menu-container">
            <h2>{categoriaName}</h2>
            <h2 className="categoria-descripcion">{CategoriaDescripcion}</h2>
            <div className="menu-columns">
                <div className="left-menu-column">
                    {leftMenuData.map((menu, index) => (
                        <div key={index} className="menu-item-container">
                            <MenuCard 
                                menu={menu} 
                                descripcion={menu.descripcion}
                                imagen={menu.ruta_imagen}
                            />
                            <div className="cart-button-container">
                                <CartButton item={menu} onAddToCart={handleAddToCart} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="right-menu-column">
                    {rightMenuData.map((menu, index) => (
                        <div key={index} className="menu-item-container">
                            <MenuCard 
                                menu={menu} 
                                descripcion={menu.descripcion}
                                imagen={menu.ruta_imagen}
                            />
                            <div className="cart-button-container">
                                <CartButton item={menu} onAddToCart={handleAddToCart} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categoria;