import React, { useState, useEffect } from 'react';
import './../styles/Welcomepage.css';

function WelcomePage() {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const [backgroundIndex, setBackgroundIndex] = useState(1);

    useEffect(() => {
        fetch('https://entreraices-production.up.railway.app/api/products') 
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProductos(data);
                } else {
                    console.error("Respuesta inesperada del servidor:", data);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Hubo un error al obtener los productos:", error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
       const changeBackground = () => {
           setBackgroundIndex(prevIndex => {
               return prevIndex === 3 ? 1 : prevIndex + 1;
           });
       };

       
       const intervalId = setInterval(changeBackground, 5000);

       
       return () => {
           clearInterval(intervalId);
       };
   }, []); 

    if (isLoading) {
        return <div>Cargando productos...</div>;
    }

    const filteredProducts = hasSearched ? productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setHasSearched(false);
        } else {
            setHasSearched(true);
        }
    }

    return (
        <div className={`welcome-page background${backgroundIndex}`}>
            <img src="./logo.png" className="logo-image"/>
            <input 
                type="text" 
                placeholder="¿Qué piensas comer hoy?" 
                onChange={handleSearchChange}
                value={searchTerm}
                className="search-bar"
            />

            <div className="product-cards-container">
                {filteredProducts.length ? 
                    filteredProducts.map(producto => (
                        <div key={producto.id_producto} className="product-card">
                            <img src={producto.imagen} alt={producto.nombre}/>
                            <h2>{producto.nombre}</h2>
                            <p>Ingredientes: {producto.ingredientes.join(', ')}</p>
                            <p>Valor: ${producto.valor_unitario}</p>
                            <button>Agregar al Carrito</button>
                        </div>
                    ))
                    :
                    hasSearched && <p>No encontramos lo que buscas.</p>
                }
            </div>
        </div>
    );
}

export default WelcomePage;