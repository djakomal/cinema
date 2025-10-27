

import React from 'react';

function ActorCard({ actor }) {
  const API_URL = 'http://localhost:5000';
  
  return (
    <div className="actor-card">
      <div className="actor-image">
        <img 
          src={`${API_URL}${actor.photo}`} 
          alt={actor.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=Photo+Non+Disponible';
          }}
        />
        <div className="actor-overlay">
          <a 
            href={`${API_URL}${actor.cv}`} 
            download 
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Télécharger CV
          </a>
        </div>
      </div>
      <div className="actor-info">
        <h3>{actor.name}</h3>
        <p>{actor.bio}</p>
      </div>
    </div>
  );
}

export default ActorCard;