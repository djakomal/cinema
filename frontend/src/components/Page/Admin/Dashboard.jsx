import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Dashboard.css';

function Dashboard() {
  const cards = [
    {
      path: '/admin/actors',
      icon: '🎭',
      title: 'Gérer les Acteurs',
      description: 'Ajouter, modifier ou supprimer des acteurs',
      stats: '12 acteurs'
    },
    {
      path: '/admin/videos',
      icon: '🎬',
      title: 'Gérer les Vidéos',
      description: 'Ajouter, modifier ou supprimer des vidéos',
      stats: '24 vidéos'
    },

    {
      path: '/admin/photos',
      icon: '🎬',
      title: 'Gérer les photos',
      description: 'Ajouter, modifier ou supprimer des photo',
      stats: '250 Photo'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tableau de bord Admin</h1>
        <p className="dashboard-subtitle">Bienvenue dans votre espace d'administration</p>
      </div>
      
      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-header">
              <div className="dashboard-icon-container">
                <div className="dashboard-icon">{card.icon}</div>
              </div>
              <div className="card-stats">{card.stats}</div>
            </div>
            
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            
            <div className="card-actions">
              <Link to={`${card.path}`} className="btn btn-add">
                <span className="btn-icon">+</span>
                Ajouter
              </Link>
              <Link to={card.path} className="btn btn-view">
               
                <span className="btn-icon">👁</span>
                Voir tout
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;