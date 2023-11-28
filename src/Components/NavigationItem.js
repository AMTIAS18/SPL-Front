import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/NavigationItem.css';  

function NavigationItem({ to, exact, children, icon: Icon }) {
    return (
        <li className="navigation-item">
            <NavLink to={to} exact={exact} activeClassName="active-page">
                {Icon && <Icon />} {children}
            </NavLink>
        </li>
    );
}

export default NavigationItem;