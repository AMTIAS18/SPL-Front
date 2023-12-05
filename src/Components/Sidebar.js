import React, { useContext, useEffect } from 'react';
import logo from './negro.png';
import NavigationItem from '../Components/NavigationItem';
import { CartContext } from '../Components/CartContext';
import { useUser } from '../Components/UserContext';
import { useNavigate } from 'react-router-dom';

function Sidebar({ categorias, isAdmin }) {
  const { cart } = useContext(CartContext);
  const { user, setUser, setIsAdmin } = useUser();
  const navigate = useNavigate();
  const esCajera = user && user.rol === 'cajera';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedIsAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
      setUser(storedUser);
    }

    if (storedIsAdmin !== null && storedIsAdmin !== isAdmin) {
      setIsAdmin(storedIsAdmin);
    }
  }, [user, isAdmin, setUser, setIsAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('carrito');
    setUser(null);
    setIsAdmin(false);
    navigate('/Login');
    window.location.reload();
  };


    return (
        <nav id="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Logo de la empresa" />
            </div>
            <ul className="list-unstyled">
                {user && (
                  <>
                    <li>
                        <span>Bienvenido, {user.nombre}</span>
                    </li>
                    <li>
                        <NavigationItem to="/carrito" exact activeClassName="active-page">
                            Carrito {cart.length > 0 && <span>({cart.length})</span>}
                        </NavigationItem>
                    </li>
                    <li>
                        <NavigationItem to="/UserOrderStatus" exact activeClassName="active-page">
                            Pedido activo
                        </NavigationItem>
                    </li>
                  </>
                )}
                {isAdmin && (
                  <>
                    <li>
                        <NavigationItem to="/Adminpage" exact activeClassName="active-page">
                            Panel de Administración
                        </NavigationItem>
                    </li>
                    <li>
                        <NavigationItem to="/CajeraPage" exact activeClassName="active-page">
                        Panel de Cajera
                        </NavigationItem>
                    </li>
                  </>
                )}

                {esCajera && (
                    <li>
                        <NavigationItem to="/CajeraPage" exact activeClassName="active-page">
                            Panel de Cajera
                        </NavigationItem>
                    </li>
                )}

                <li>
                    <NavigationItem to="/" exact activeClassName="active-page">
                        Inicio
                    </NavigationItem>
                </li>

                {categorias.map(categoria => (
                    <li key={categoria.id_categoria}>
                        <NavigationItem
                            to={`/categoria/${categoria.id_categoria}`}
                            exact
                            activeClassName="active-page"
                        >
                            {categoria.nombre}
                        </NavigationItem>
                    </li>
                ))}

                {user && (
                    <>
                        <li>
                            <NavigationItem to="/UserProfile" exact activeClassName="active-page">
                                Mi Perfil
                            </NavigationItem>
                        </li>
                        <li className='logout-container'>
                        <button class="logout" onClick={handleLogout}>
                            <i class="fas fa-sign-out-alt"></i> Cerrar sesión
                        </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Sidebar;