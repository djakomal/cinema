import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2>Page non trouvée</h2>
        <p>Désolé, la page que vous recherchez n'existe pas.</p>
        <Link to="/" className="notfound-btn">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;