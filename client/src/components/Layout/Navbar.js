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
          <i className="bi bi-hospital me-2"></i>
          Equipment Tracker
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
                <i className="bi bi-house me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/equipment')} to="/equipment">
                <i className="bi bi-gear me-1"></i>
                Equipment
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/add-equipment')} to="/add-equipment">
                <i className="bi bi-plus-circle me-1"></i>
                Add Equipment
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/maintenance')} to="/maintenance">
                <i className="bi bi-tools me-1"></i>
                Maintenance
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/maintenance-chat')} to="/maintenance-chat">
                <i className="bi bi-robot me-1"></i>
                Maintenance Bot
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;