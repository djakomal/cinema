import React, { useState, useEffect } from 'react';
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
  const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
    animation: 'fadeInUp 0.6s ease forwards'
  },
  title: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #f4d03f, #d4af37, #b8941f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '700',
    marginBottom: '5px'
  },
  subtitle: {
    color: '#999',
    fontSize: '1rem'
  },
  btnAdd: {
    background: 'linear-gradient(135deg, #d4af37, #b8941f)',
    color: '#0a0a0a',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
  },
  btnIcon: {
    fontSize: '1.5rem'
  },
  searchBar: {
    position: 'relative',
    marginBottom: '30px',
    animation: 'fadeInUp 0.7s ease forwards'
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem'
  },
  searchInput: {
    width: '100%',
    padding: '15px 20px 15px 55px',
    background: '#1a1a1a',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  tableContainer: {
    background: '#1a1a1a',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    animation: 'fadeInUp 0.8s ease forwards'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '20px',
    textAlign: 'left',
    color: '#d4af37',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    background: 'rgba(212, 175, 55, 0.1)',
    borderBottom: '2px solid rgba(212, 175, 55, 0.3)'
  },
  tr: {
    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.5s ease forwards'
  },
  td: {
    padding: '20px',
    color: 'white'
  },
  actorName: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontWeight: '500'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4af37, #b8941f)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0a0a0a',
    fontWeight: '700',
    fontSize: '1.1rem'
  },
  badge: {
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: '#d4af37',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  btnEdit: {
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
  },
  btnDelete: {
    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease forwards',
    backdropFilter: 'blur(5px)'
  },
  modal: {
    background: '#1a1a1a',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
    animation: 'slideUp 0.4s ease forwards'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px 30px',
    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
  },
  modalTitle: {
    fontSize: '1.8rem',
    color: '#d4af37',
    fontWeight: '600'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#999',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '40px',
    height: '40px',
    borderRadius: '50%'
  },
  form: {
    padding: '30px'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    color: '#d4af37',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    background: '#0a0a0a',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  },
  btnCancel: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    color: '#d4af37',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnSubmit: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #d4af37, #b8941f)',
    border: 'none',
    color: '#0a0a0a',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
  }
};

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
  
  console.log('=== SUBMIT FORM ===');
  console.log('EditingActor:', editingActor);
  console.log('FormData:', formData);
  
  // Validation pour la création
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
      console.log('Ajout photo:', formData.photo.name);
      formDataToSend.append('photo', formData.photo);
    }
    if (formData.cv) {
      console.log('Ajout CV:', formData.cv.name);
      formDataToSend.append('cv', formData.cv);
    }

    // Debug FormData
    console.log('FormData entries:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    if (editingActor) {
      console.log('Mode EDITION - ID:', editingActor._id);
      const response = await updateActor(editingActor._id, formDataToSend);
      console.log('Réponse update:', response);
      setMessage('Acteur modifié avec succès!');
    } else {
      console.log('Mode CREATION');
      const response = await createActor(formDataToSend);
      console.log('Réponse create:', response);
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
    console.error('=== ERREUR COMPLETE ===');
    console.error('Error:', error);
    console.error('Response:', error.response);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    
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
        console.error('Erreur:', error);
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
        <div className="header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h1 className="section-title">Gérer les Acteurs</h1>
          <button className="btn btn-primary" onClick={() => { 
            setEditingActor(null); 
            setFormData({ name:'', bio:'', photo:null, cv:null }); 
            setShowModal(true); 
          }}>
            + Ajouter un acteur
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher un acteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{marginBottom:'20px', padding:'10px 15px', borderRadius:'10px', width:'100%', border:'1px solid rgba(212,175,55,0.2)'}}
        />
    {/* {filteredActors.map(actor => (
            <div key={actor._id} className="actor-card">
              <div style={{display:'flex', justifyContent:'center', marginBottom:'10px'}}>
                <div className="avatar">{actor.name.charAt(0)}</div>
              </div>
              <h3>{actor.name}</h3>
              <p>{actor.bio}</p>
              <div style={{display:'flex', gap:'10px', justifyContent:'center', marginTop:'10px'}}>
                <button className="btn btn-primary" onClick={() => handleEdit(actor)}>✏️</button>
                <button className="btn btn-danger" onClick={() => handleDelete(actor._id)}>🗑️</button>
              </div>
            </div>
          ))} */}
      <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>BIO</th>
                <th style={styles.th}>Photo</th>
                <th style={styles.th}>CV</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActors.map((actor, index) => (
                <tr 
                  key={actor.id} 
                  style={{
                    ...styles.tr,
                    animationDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={styles.td}>
                    <div style={styles.actorName}>
                      <div style={styles.avatar}>{actor.name.charAt(0)}</div>
                      {actor.name}
                    </div>
                  </td>
                  <td style={styles.td}>{actor.bio}</td>
                  <td style={styles.td}><img src={process.env.REACT_APP_UPLOADS_URL+actor.photo} alt="" srcset=""    style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}/></td>
                  <td style={styles.td}>
                    <a 
                      href={process.env.REACT_APP_UPLOADS_URL+actor.cv} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.badge}
                    >
                      Voir CV
                    </a>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.btnEdit}
                        onClick={() => handleEdit(actor)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        style={styles.btnDelete}
                        onClick={() => handleDelete(actor.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
                        }}
                      >
                        🗑️
                      </button>
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
                <h2>{editingActor ? 'Modifier l\'acteur' : 'Ajouter un acteur'}</h2>
                <button className="close-btn" onClick={handleCloseModal}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Nom</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name:e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Biographie</label>
                  <textarea 
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio:e.target.value})} 
                    rows="4" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Photo {editingActor && '(laisser vide pour conserver l\'actuelle)'}</label>
                  <input 
                    id="photo-input" 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setFormData({...formData, photo:e.target.files[0]})} 
                    required={!editingActor}
                  />
                </div>
                <div className="form-group">
                  <label>CV (PDF) {editingActor && '(laisser vide pour conserver l\'actuel)'}</label>
                  <input 
                    id="cv-input" 
                    type="file" 
                    accept=".pdf" 
                    onChange={e => setFormData({...formData, cv:e.target.files[0]})} 
                    required={!editingActor}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-cancel" onClick={handleCloseModal}>Annuler</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
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