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
      setError('');
      
      console.log('🔍 Tentative de chargement des photocards...');
      const response = await getPhotocards();
      
      console.log('✅ Réponse reçue:', response);
      console.log('📦 Données:', response.data);
      
      if (!response.data) {
        throw new Error('Aucune donnée reçue du serveur');
      }
      
      setPhotocards(Array.isArray(response.data) ? response.data : []);
      console.log(`✅ ${response.data.length} photocard(s) chargée(s)`);
      
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      console.error('❌ Message:', err.message);
      console.error('❌ Response:', err.response);
      console.error('❌ Response data:', err.response?.data);
      console.error('❌ Status:', err.response?.status);
      
      let errorMessage = 'Impossible de charger les photocards.';
      
      if (err.response) {
        // Le serveur a répondu avec un code d'erreur
        errorMessage += ` Erreur ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        // La requête a été faite mais pas de réponse
        errorMessage += ' Le serveur ne répond pas. Vérifiez que le backend est démarré.';
      } else {
        // Erreur lors de la configuration de la requête
        errorMessage += ` ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openGallery = (photocard, photoIndex = 0) => {
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

  // Utiliser l'URL depuis les variables d'environnement
//   const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
//   const API_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000';
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

      {selectedPhotocard && selectedPhotocard.photos && (
        <div className="photo-gallery-modal" onClick={closeGallery}>
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-gallery" 
              onClick={closeGallery}
              aria-label="Fermer"
            >
              ×
            </button>

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

                  <div className="gallery-indicator">
                    {currentPhotoIndex + 1} / {selectedPhotocard.photos.length}
                  </div>
                </>
              )}
            </div>

            <div className="gallery-info">
              {selectedPhotocard.title && <h2>{selectedPhotocard.title}</h2>}
              {selectedPhotocard.description && <p className="photocard-description">{selectedPhotocard.description}</p>}
              {selectedPhotocard.date && (
                <p className="photocard-date">
                  {new Date(selectedPhotocard.date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

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
                         e.target.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.style.cssText = 'width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#999;';
                        placeholder.textContent = '📷 Photo indisponible';
                        e.target.parentElement.appendChild(placeholder);
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