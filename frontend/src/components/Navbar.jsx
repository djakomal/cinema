import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = (e) => {
    e.preventDefault();
    
    setClickCount(prev => prev + 1);
    
    setTimeout(() => setClickCount(0), 1000); // Reset après 1 seconde
    
    if (clickCount === 2) { // 3ème clic
      setShowAdmin(true);
      setClickCount(0);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo" onClick={handleLogoClick}>
            <img src="/logo-grct.jpg" alt="GRCT Logo" />
          </Link>
          
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link>
            <Link to="/actors" onClick={() => setIsOpen(false)}>Acteurs</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)}>Projets</Link>
            <Link to="/photo"onClick={()=> setIsOpen(false)}>Activité</Link>
            
            {showAdmin && (
              <Link 
                to="/admin/login" 
                className="admin-link" 
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
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