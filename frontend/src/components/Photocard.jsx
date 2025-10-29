import React, { useState } from 'react';

function Photocard({ photocard, onPhotoClick }) {
  const API_URL = 'http://localhost:5000';
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extraire les données de photocard
  const { photos, description, title, date } = photocard;
  
  // Gérer le cas où photos peut être une seule photo ou un tableau
  const photoArray = Array.isArray(photos) ? photos : [photos];

  console.log('🖼️ URL de la photo:', `${API_URL}${photoArray[currentIndex]}`);

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photoArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photoArray.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="photo-card">
      {/* Titre optionnel */}
      {title && <h3 className="photo-title">{title}</h3>}
      
      <div className="photo-image">
        {/* Image principale */}
        <img
          src={`${API_URL}${photoArray[currentIndex]}`}
          alt={`${title || 'Photo'} ${currentIndex + 1}`}
          onClick={() => onPhotoClick && onPhotoClick(currentIndex)}
          onError={(e) => {
            e.target.style.display = 'none';
            if (!e.target.nextSibling || !e.target.nextSibling.classList?.contains('placeholder')) {
              const placeholder = document.createElement('div');
              placeholder.className = 'placeholder';
              placeholder.style.cssText = 'width:100%;height:300px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#999;border-radius:8px;';
              placeholder.textContent = '📷 Photo indisponible';
              e.target.parentElement.appendChild(placeholder);
            }
          }}
        />

        {/* Boutons de navigation (seulement si plusieurs photos) */}
        {photoArray.length > 1 && (
          <>
            <button 
              className="nav-button prev" 
              onClick={prevPhoto}
              aria-label="Photo précédente"
            >
              ‹
            </button>
            <button 
              className="nav-button next" 
              onClick={nextPhoto}
              aria-label="Photo suivante"
            >
              ›
            </button>

            {/* Indicateur de position */}
            <div className="photo-indicator">
              {currentIndex + 1} / {photoArray.length}
            </div>
          </>
        )}
      </div>

      {/* Miniatures (optionnel) */}
      {photoArray.length > 1 && (
        <div className="photo-thumbnails">
          {photoArray.map((photo, index) => (
            <img
              key={index}
              src={`${API_URL}${photo}`}
              alt={`miniature ${index + 1}`}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      <div className="photo-info">
        {description && <p className="photo-description">{description}</p>}
        {date && (
          <p className="photo-date">
            {new Date(date).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    </div>
  );
}

export default Photocard;
