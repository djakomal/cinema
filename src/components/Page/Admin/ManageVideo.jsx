
import React, { useState, useEffect } from 'react';
import { getVideos, createVideo, deleteVideo } from '../../../Services/api';
import '../../../styles/Admin.css';

function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    video: null,
    thumbnail: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.floor(video.duration);
        
        if (duration > 60) {
          reject('La vidéo ne doit pas dépasser 1 minute (60 secondes)');
        } else {
          resolve(duration);
        }
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const duration = await validateVideoDuration(file);
        setFormData({...formData, video: file, duration: duration.toString()});
        setError('');
      } catch (err) {
        setError(err);
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      if (!formData.video) {
        setError('Veuillez sélectionner une vidéo');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('video', formData.video);
      formDataToSend.append('thumbnail', formData.thumbnail);

      await createVideo(formDataToSend);
      
      setMessage('Vidéo ajoutée avec succès!');
      setFormData({ title: '', description: '', duration: '', video: null, thumbnail: null });
      
      // Réinitialiser les inputs
      document.getElementById('video-input').value = '';
      document.getElementById('thumbnail-input').value = '';
      
      // Recharger la liste
      fetchVideos();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'ajout de la vidéo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        await deleteVideo(id);
        setMessage('Vidéo supprimée avec succès!');
        fetchVideos();
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="admin-page section">
      <div className="container">
        <h1 className="section-title">Gérer les Vidéos</h1>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="admin-form-container">
          <h2>Ajouter une vidéo</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Titre du projet</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Vidéo (max 1 minute)</label>
              <input
                id="video-input"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                required
                disabled={loading}
              />
              <small>La vidéo ne doit pas dépasser 60 secondes</small>
              {formData.duration && (
                <small style={{ color: 'var(--accent-orange)' }}>
                  Durée détectée: {formData.duration}s
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Miniature</label>
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter la vidéo'}
            </button>
          </form>
        </div>

        <div className="videos-list" style={{ marginTop: '40px' }}>
          <h2>Liste des vidéos</h2>
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video._id} className="video-card">
                <img src={`http://localhost:5000${video.thumbnail}`} alt={video.title} />
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <small>Durée: {video.duration}s</small>
                <button 
                  onClick={() => handleDelete(video._id)} 
                  className="btn btn-danger"
                  style={{ backgroundColor: '#e74c3c', marginTop: '10px' }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageVideos;