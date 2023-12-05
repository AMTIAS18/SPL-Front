
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';
import { UserProvider } from './Components/UserContext';
import WelcomePage from './Pages/WelcomePage';
import Container from 'react-bootstrap/Container';
import NavigationItem from './Components/NavigationItem';
import Footer from './Components/Footer';
import Header from './Components/Header';
import SobreNosotros from './Pages/SobreNosotros';
import Carrito from './Pages/Carrito';
import Categoria from './Pages/Categoria';
import Login from './Pages/Login';
import Registro from './Pages/Registro';
import CambioContrasena from './Pages/CambioContrasena';
import Sidebar from './Components/Sidebar';
import AdminPage from './Pages/AdminPage';
import UserProfile from './Pages/UserProfile';
import Users from './Pages/Users';
import AdminRol from './Pages/AdminRol';
import AdminProductsAdd from './Pages/AdminProductsAdd';
import AdminProducts from './Pages/AdminProducts';
import AdminCategories from './Pages/AdminCategories';
import AdminCategoriesAdd from './Pages/AdminCategoriesAdd';
import Pago from './Pages/Pago';
import Compra from './Pages/Compra';
import Direccion from './Pages/Direccion';
import './App.css';

function App() {
    const [categorias, setCategorias] = useState([]);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetch('https://entreraices-production.up.railway.app/api/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener datos');
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data.categories)) {
                    setCategorias(data.categories);
                } else {
                    console.error('Formato de datos inesperado:', data);
                }
            })
            .catch(error => {
                console.error('Error al obtener las categorías:', error);
            });
    }, []);

    return (
        <CartProvider>
            <UserProvider>
                <Router>
                    <Container fluid>
                        <Header />
                        <Sidebar categorias={categorias} user={user} isAdmin={isAdmin} />
                        <div id="content">
                            <Routes>
                                <Route path="/" element={<WelcomePage />} />
                                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                                <Route path="/carrito" element={<Carrito />} />
                                <Route path="/volver" element={<Categoria />} />
                                <Route path="/categoria/:categoriaId" element={<Categoria />} />
                                <Route path="/login" element={<Login setIsAdmin={setIsAdmin} setUser={setUser} />} />
                                <Route path="/registro" element={<Registro />} />
                                <Route path="/cambiocontrasena" element={<CambioContrasena />} />
                                <Route path="/UserProfile" element={<UserProfile user={user} />} />
                                <Route path="/adminpage" element={<AdminPage />} />
                                <Route path="/Users" element={<Users />} />
                                <Route path="/adminrol" element={<AdminRol />} />
                                <Route path="/adminproductsadd" element={<AdminProductsAdd />} />
                                <Route path="/adminproducts" element={<AdminProducts />} />
                                <Route path="/admincategories" element={<AdminCategories />} />
                                <Route path="/admincategoriesadd" element={<AdminCategoriesAdd />} />
                                <Route path="/pago" element={<Pago />} />
                                <Route path="/compra" element={<Compra />} />
                                <Route path="/direccion" element={<Direccion />} />
                            </Routes>
                        </div>
                        <Footer />
                    </Container>
                </Router>
            </UserProvider>
        </CartProvider>
    );
}

export default App;