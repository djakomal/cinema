import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActors, createActor, updateActor, deleteActor } from '../../../Services/api';
import '../../../styles/ManageActors.css';

function ManageActors() {
  const [actors, setActors] = useState([]);
  const [formData, setFormData] = useState({ name: '', bio: '', photo: null, cv: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const response = await getActors();
      setActors(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingActor && (!formData.photo || !formData.cv)) {
      setMessage('Photo et CV requis pour créer un acteur');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);

      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      if (editingActor) {
        await updateActor(editingActor.id, formDataToSend);
        setMessage('Acteur modifié avec succès!');
      } else {
        await createActor(formDataToSend);
        setMessage('Acteur ajouté avec succès!');
      }

      setFormData({ name: '', bio: '', photo: null, cv: null });
      const photoInput = document.getElementById('photo-input');
      const cvInput = document.getElementById('cv-input');
      if (photoInput) photoInput.value = '';
      if (cvInput) cvInput.value = '';

      fetchActors();
      setShowModal(false);
      setEditingActor(null);
    } catch (error) {
      setMessage(error.response?.data?.message || `Erreur lors de l'opération: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet acteur ?')) {
      try {
        await deleteActor(id);
        setMessage('Acteur supprimé avec succès!');
        fetchActors();
      } catch (error) {
        setMessage('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (actor) => {
    setEditingActor(actor);
    setFormData({ name: actor.name, bio: actor.bio, photo: null, cv: null });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActor(null);
    setFormData({ name: '', bio: '', photo: null, cv: null });
    setMessage('');
  };

  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page section">
      <div className="container">
        <Link to="/admin/dashboard" className="back-link">← Retour au tableau de bord</Link>
        <div className="header">
          <div>
            <h1 className="title">Gérer les Acteurs</h1>
            <p className="subtitle">Gérez la liste des acteurs du GRCT</p>
          </div>
          <button className="btn-add" onClick={() => {
            setEditingActor(null);
            setFormData({ name: '', bio: '', photo: null, cv: null });
            setShowModal(true);
          }}>
            <span className="btn-icon">+</span>
            Ajouter un acteur
          </button>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un acteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Bio</th>
                <th>Photo</th>
                <th>CV</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActors.map(actor => (
                <tr key={actor.id}>
                  <td>
                    <div className="actor-name">
                      <div className="avatar">{actor.name.charAt(0)}</div>
                      {actor.name}
                    </div>
                  </td>
                  <td>{actor.bio}</td>
                  <td>
                    <img
                      src={process.env.REACT_APP_UPLOADS_URL + actor.photo}
                      alt={actor.name}
                      className="actor-photo"
                    />
                  </td>
                  <td>
                    <a
                      href={process.env.REACT_APP_UPLOADS_URL + actor.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge"
                    >
                      Voir CV
                    </a>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn-edit" onClick={() => handleEdit(actor)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(actor.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingActor ? "Modifier l'acteur" : 'Ajouter un acteur'}</h2>
                <button className="close-btn" onClick={handleCloseModal}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label className="label">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Biographie</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    required
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Photo {editingActor && '(laisser vide pour conserver l\'actuelle)'}</label>
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={e => setFormData({ ...formData, photo: e.target.files[0] })}
                    required={!editingActor}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">CV (PDF) {editingActor && '(laisser vide pour conserver l\'actuel)'}</label>
                  <input
                    id="cv-input"
                    type="file"
                    accept=".pdf"
                    onChange={e => setFormData({ ...formData, cv: e.target.files[0] })}
                    required={!editingActor}
                    className="input"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>Annuler</button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Chargement...' : (editingActor ? 'Mettre à jour' : 'Ajouter')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {message && (
          <div className={message.includes('succès') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageActors;
