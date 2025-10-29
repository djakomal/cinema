import React, { useState, useEffect } from 'react';
import Photocard from '../Photocard';
import { getPhotocards } from '../../Services/api';
import '../../styles/PhotocardGallery.css';

function Photo() {
  const [photocards, setPhotocards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhotocard, setSelectedPhotocard] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchPhotocards();
  }, []);

  const fetchPhotocards = async () => {
    try {
      setLoading(true);
      const response = await getPhotocards();
      console.log('Photocards reçues:', response.data); // Debug
      setPhotocards(response.data || []); // Assurer un tableau vide par défaut
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des photocards:', err);
      setError('Impossible de charger les photocards. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const openGallery = (photocard, photoIndex = 0) => {
    // Vérifier que photocard existe et a des photos
    if (!photocard || !photocard.photos) {
      console.error('Photocard invalide:', photocard);
      return;
    }
    setSelectedPhotocard(photocard);
    setCurrentPhotoIndex(photoIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedPhotocard(null);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    if (selectedPhotocard && selectedPhotocard.photos) {
      const photoArray = Array.isArray(selectedPhotocard.photos) 
        ? selectedPhotocard.photos 
        : [selectedPhotocard.photos];
      setCurrentPhotoIndex((prev) => 
        prev === photoArray.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedPhotocard && selectedPhotocard.photos) {
      const photoArray = Array.isArray(selectedPhotocard.photos) 
        ? selectedPhotocard.photos 
        : [selectedPhotocard.photos];
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? photoArray.length - 1 : prev - 1
      );
    }
  };

  const handleKeyDown = (e) => {
    if (!selectedPhotocard) return;
    
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'Escape') closeGallery();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotocard, currentPhotoIndex]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des photocards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchPhotocards} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  const API_URL = 'http://localhost:5000';

  return (
    <div className="photocard-gallery-page section fade-in">
      <div className="container">
        <h1 className="section-title">Galerie Photos</h1>
        <p className="section-subtitle">Découvrez nos moments marquants en images</p>
        
        {photocards.length === 0 ? (
          <div className="empty-state">
            <p>Aucune photocard pour le moment.</p>
          </div>
        ) : (
          <div className="photocards-grid">
            {photocards.map(photocard => {
              // Vérifier que photocard et photos existent
              if (!photocard || !photocard.photos) {
                console.warn('Photocard invalide:', photocard);
                return null;
              }
              
              return (
                <Photocard 
                  key={photocard._id} 
                  photocard={photocard}
                  onPhotoClick={(photoIndex) => openGallery(photocard, photoIndex)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de galerie photo */}
      {selectedPhotocard && selectedPhotocard.photos && (
        <div className="photo-gallery-modal" onClick={closeGallery}>
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            {/* Bouton fermer */}
            <button 
              className="close-gallery" 
              onClick={closeGallery}
              aria-label="Fermer"
            >
              ×
            </button>

            {/* Image principale */}
            <div className="gallery-image-container">
              <img
                src={`${API_URL}${
                  Array.isArray(selectedPhotocard.photos)
                    ? selectedPhotocard.photos[currentPhotoIndex]
                    : selectedPhotocard.photos
                }`}
                alt={`${selectedPhotocard.title || 'Photocard'} - Photo ${currentPhotoIndex + 1}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Photo+Indisponible';
                }}
              />

              {/* Boutons de navigation */}
              {Array.isArray(selectedPhotocard.photos) && selectedPhotocard.photos.length > 1 && (
                <>
                  <button 
                    className="gallery-nav prev" 
                    onClick={prevPhoto}
                    aria-label="Photo précédente"
                  >
                    ‹
                  </button>
                  <button 
                    className="gallery-nav next" 
                    onClick={nextPhoto}
                    aria-label="Photo suivante"
                  >
                    ›
                  </button>

                  {/* Indicateur */}
                  <div className="gallery-indicator">
                    {currentPhotoIndex + 1} / {selectedPhotocard.photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Informations de la photocard */}
            <div className="gallery-info">
              {selectedPhotocard.title && <h2>{selectedPhotocard.title}</h2>}
              {selectedPhotocard.description && <p className="photocard-description">{selectedPhotocard.description}</p>}
              {selectedPhotocard.date && (
                <p className="photocard-date">
                  {new Date(selectedPhotocard.date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            {/* Miniatures */}
            {Array.isArray(selectedPhotocard.photos) && selectedPhotocard.photos.length > 1 && (
              <div className="gallery-thumbnails">
                {selectedPhotocard.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${API_URL}${photo}`}
                    alt={`Miniature ${index + 1}`}
                    className={`thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                    onClick={() => setCurrentPhotoIndex(index)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=N/A';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Photo;