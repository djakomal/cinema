

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <img src="/logo-grct.jpg" alt="GRCT Logo" />
          </Link>
          
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link>
            <Link to="/actors" onClick={() => setIsOpen(false)}>Acteurs</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)}>Projets</Link>
            <Link to="/admin/login" className="admin-link" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
          </div>

          <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;