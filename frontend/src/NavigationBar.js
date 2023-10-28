import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <nav className="navbar">
            <Link to="/static" className="nav-item">HOME</Link>
        </nav>
    );
}

export default NavigationBar;
