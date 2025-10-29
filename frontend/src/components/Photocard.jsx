import React from 'react';
import '../styles/photocard.css';

function Photocard({ photo, description }) {
  const API_URL = 'http://localhost:5000';

  return (
    <div className="photo-card">
      <div className="photo-image">
        <img
          src={`${API_URL}${photo}`}
          alt="photo"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Photo+Indisponible';
          }}
        />
      </div>
      <div className="photo-description">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Photocard;
