

import React, { useState, useEffect } from 'react';
import { getVideos } from '../../Services/api';
import '../../styles/Video.css';
import VideoPlayer from '../VideoPlayer';

function Projects() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getVideos();
      setVideos(response.data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des vidéos:', err);
      setError('Impossible de charger les vidéos. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des projets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchVideos} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="projects-page section fade-in">
      <div className="container">
        <h1 className="section-title">Nos Projets</h1>
        {videos.length === 0 ? (
          <div className="empty-state">
            <p>Aucun projet pour le moment.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map(video => (
              <VideoPlayer key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;