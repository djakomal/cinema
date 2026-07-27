
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../../../Services/api';
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
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      if (!editingId && !formData.video) {
        setError('Veuillez sélectionner une vidéo');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      if (formData.video) formDataToSend.append('video', formData.video);
      if (formData.thumbnail) formDataToSend.append('thumbnail', formData.thumbnail);

      if (editingId) {
        await updateVideo(editingId, formDataToSend);
        setMessage('Vidéo mise à jour avec succès!');
      } else {
        await createVideo(formDataToSend);
        setMessage('Vidéo ajoutée avec succès!');
      }
      
      handleCloseModal();
      fetchVideos();
    } catch (error) {
      console.error('Erreur:', error);
      const msg = error.response?.data?.message || 'Erreur lors de l\'opération';
      setError(msg);
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

  const handleEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      duration: video.duration.toString(),
      video: null,
      thumbnail: null
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', duration: '', video: null, thumbnail: null });
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', description: '', duration: '', video: null, thumbnail: null });
    setError('');
    const videoInput = document.getElementById('video-input');
    const thumbInput = document.getElementById('thumbnail-input');
    if (videoInput) videoInput.value = '';
    if (thumbInput) thumbInput.value = '';
  };

  return (
    <div className="admin-page section">
      <div className="container">
        <Link to="/admin/dashboard" className="back-link">← Retour au tableau de bord</Link>

        <div className="header">
          <div>
            <h1 className="section-title">Gérer les Vidéos</h1>
            <p className="subtitle">Gérez les vidéos des projets du GRCT</p>
          </div>
          <button className="btn-add" onClick={handleOpenModal}>
            <span className="btn-icon">+</span>
            Ajouter une vidéo
          </button>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingId ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</h2>
                <button className="close-btn" onClick={handleCloseModal}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="form" style={{ padding: '30px' }}>
                <div className="form-group">
                  <label className="label">Titre du projet</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    disabled={loading}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    required
                    disabled={loading}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Vidéo {editingId && <small style={{ color: '#999', fontWeight: 'normal' }}>(laisser vide pour garder l'actuelle)</small>}</label>
                  <input
                    id="video-input"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    required={!editingId}
                    disabled={loading}
                    className="input"
                  />
                  <small style={{ color: '#999', fontSize: '0.85rem' }}>La vidéo ne doit pas dépasser 60 secondes</small>
                  {formData.duration && (
                    <small style={{ color: 'var(--accent-orange)', display: 'block', marginTop: '5px' }}>
                      Durée détectée: {formData.duration}s
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label className="label">Miniature {editingId && <small style={{ color: '#999', fontWeight: 'normal' }}>(laisser vide pour garder l'actuelle)</small>}</label>
                  <input
                    id="thumbnail-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
                    required={!editingId}
                    disabled={loading}
                    className="input"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>Annuler</button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : editingId ? 'Enregistrer les modifications' : 'Ajouter la vidéo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="videos-list" style={{ marginTop: '40px' }}>
          <h2>Liste des vidéos</h2>
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card">
                <img src={`${process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000'}${video.thumbnail}`} alt={video.title} />
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <small>Durée: {video.duration}s</small>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleEdit(video)} className="btn btn-primary" style={{ flex: 1 }}>
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(video.id)} className="btn btn-danger" style={{ backgroundColor: '#e74c3c', flex: 1 }}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageVideos;
