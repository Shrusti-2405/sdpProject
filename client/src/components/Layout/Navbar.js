import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-house-heart me-2"></i>
          RecipeMate
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActive('/')} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/inventory')} to="/inventory">
                Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/add-item')} to="/add-item">
                Add Item
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/recipe-suggestions')} to="/recipe-suggestions">
                Recipe Suggestions
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/recipe-chat')} to="/recipe-chat">
                Recipe Chat
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;