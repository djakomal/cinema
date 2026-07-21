import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActors, getVideos, getPhotocards } from '../../../Services/api';
import '../../../styles/Dashboard.css';

function Dashboard() {
  const [counts, setCounts] = useState({ actors: null, videos: null, photos: null });

  useEffect(() => {
    Promise.all([
      getActors().then(r => r.data.length).catch(() => 0),
      getVideos().then(r => r.data.length).catch(() => 0),
      getPhotocards().then(r => r.data.length).catch(() => 0)
    ]).then(([actors, videos, photos]) => {
      setCounts({ actors, videos, photos });
    });
  }, []);

  const cards = [
    {
      path: '/admin/actors',
      icon: '🎭',
      title: 'Gérer les Acteurs',
      description: 'Ajouter, modifier ou supprimer des acteurs',
      count: counts.actors,
      label: 'acteur'
    },
    {
      path: '/admin/videos',
      icon: '🎬',
      title: 'Gérer les Vidéos',
      description: 'Ajouter, modifier ou supprimer des vidéos',
      count: counts.videos,
      label: 'vidéo'
    },
    {
      path: '/admin/photos',
      icon: '🖼️',
      title: 'Gérer les photos',
      description: 'Ajouter, modifier ou supprimer des photos',
      count: counts.photos,
      label: 'photo'
    }
  ];

  const pluralize = (n, word) => {
    if (n === null) return '…';
    if (n === 0) return '0 ' + word + (word.endsWith('s') ? '' : 's');
    return n + ' ' + word + (n > 1 ? (word.endsWith('s') ? '' : 's') : '');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tableau de bord Admin</h1>
        <p className="dashboard-subtitle">Bienvenue dans votre espace d'administration</p>
      </div>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-header">
              <div className="dashboard-icon-container">
                <div className="dashboard-icon">{card.icon}</div>
              </div>
              <div className="card-stats">{pluralize(card.count, card.label)}</div>
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
