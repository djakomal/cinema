import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const handleLogoClick = (e) => {
    e.preventDefault();
    setClickCount(prev => prev + 1);
    setTimeout(() => setClickCount(0), 1000);

    if (clickCount === 2) {
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
            <Link to="/photo" onClick={() => setIsOpen(false)}>Activité</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>À propos</Link>

            <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer le thème" title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}>
              <span className="theme-toggle-icon">{theme === 'dark' ? '☀' : '☾'}</span>
            </button>

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
