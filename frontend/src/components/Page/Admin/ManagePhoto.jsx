import React, { useState, useEffect } from 'react';
import { getPhotocards, createPhotocard, updatePhotocard, deletePhotocard } from '../../../Services/api';

function ManagePhotocards() {
  const [photocards, setPhotocards] = useState([]);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    photos: [] 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPhotocard, setEditingPhotocard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  const API_URL = 'http://localhost:5000';

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
    searchInput: {
      width: '100%',
      padding: '15px 20px',
      background: '#1a1a1a',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '10px',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      marginBottom: '30px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '25px',
      marginTop: '30px'
    },
    card: {
      background: '#1a1a1a',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '15px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      background: '#0a0a0a'
    },
    cardContent: {
      padding: '20px'
    },
    cardTitle: {
      color: '#d4af37',
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '10px'
    },
    cardDescription: {
      color: '#999',
      fontSize: '0.9rem',
      marginBottom: '10px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    cardDate: {
      color: '#666',
      fontSize: '0.85rem',
      marginBottom: '15px'
    },
    photoBadge: {
      display: 'inline-block',
      background: 'rgba(212, 175, 55, 0.1)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      color: '#d4af37',
      padding: '5px 12px',
      borderRadius: '15px',
      fontSize: '0.8rem',
      marginBottom: '15px'
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px'
    },
    btnEdit: {
      flex: 1,
      background: 'linear-gradient(135deg, #3498db, #2980b9)',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    btnDelete: {
      flex: 1,
      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
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
      backdropFilter: 'blur(5px)'
    },
    modal: {
      background: '#1a1a1a',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto'
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
      width: '40px',
      height: '40px'
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
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      background: '#0a0a0a',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
      minHeight: '100px',
      resize: 'vertical'
    },
    fileInput: {
      width: '100%',
      padding: '12px 15px',
      background: '#0a0a0a',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      cursor: 'pointer'
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '10px',
      marginTop: '15px'
    },
    previewImage: {
      width: '100%',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '2px solid rgba(212, 175, 55, 0.3)'
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
      cursor: 'pointer'
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
      cursor: 'pointer'
    },
    message: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 25px',
      borderRadius: '10px',
      fontWeight: '600',
      zIndex: 2000,
      animation: 'slideInRight 0.3s ease'
    },
    successMessage: {
      background: 'linear-gradient(135deg, #27ae60, #229954)',
      color: 'white'
    },
    errorMessage: {
      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      color: 'white'
    }
  };

  useEffect(() => {
    fetchPhotocards();
  }, []);

  const fetchPhotocards = async () => {
    try {
      const response = await getPhotocards();
      setPhotocards(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des photocards');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({...formData, photos: files});

    // Créer les aperçus
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingPhotocard && formData.photos.length === 0) {
      setMessage('Au moins une photo est requise');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      
      formData.photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      if (editingPhotocard) {
        await updatePhotocard(editingPhotocard._id, formDataToSend);
        setMessage('Photocard modifiée avec succès!');
      } else {
        await createPhotocard(formDataToSend);
        setMessage('Photocard ajoutée avec succès!');
      }
      
      setFormData({ title: '', description: '', date: '', photos: [] });
      setPreviewImages([]);
      const photoInput = document.getElementById('photos-input');
      if (photoInput) photoInput.value = '';
      
      fetchPhotocards();
      setShowModal(false);
      setEditingPhotocard(null);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(error.response?.data?.message || `Erreur lors de l'opération: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette photocard ?')) {
      try {
        await deletePhotocard(id);
        setMessage('Photocard supprimée avec succès!');
        fetchPhotocards();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erreur:', error);
        setMessage('Erreur lors de la suppression');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleEdit = (photocard) => {
    setEditingPhotocard(photocard);
    setFormData({ 
      title: photocard.title, 
      description: photocard.description, 
      date: photocard.date ? new Date(photocard.date).toISOString().split('T')[0] : '',
      photos: [] 
    });
    setPreviewImages([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPhotocard(null);
    setFormData({ title: '', description: '', date: '', photos: [] });
    setPreviewImages([]);
    setMessage('');
  };

  const filteredPhotocards = photocards.filter(photocard =>
    photocard.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photocard.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Gérer les Photocards</h1>
            <p style={{color: '#999', fontSize: '1rem'}}>
              {photocards.length} photocard{photocards.length > 1 ? 's' : ''}
            </p>
          </div>
          <button 
            style={styles.btnAdd}
            onClick={() => { 
              setEditingPhotocard(null); 
              setFormData({ title: '', description: '', date: '', photos: [] }); 
              setPreviewImages([]);
              setShowModal(true); 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{fontSize: '1.5rem'}}>+</span>
            Ajouter une photocard
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Rechercher une photocard..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.grid}>
          {filteredPhotocards.map((photocard) => {
            const photoArray = Array.isArray(photocard.photos) ? photocard.photos : [photocard.photos];
            return (
              <div 
                key={photocard._id} 
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={`${API_URL}${photoArray[0]}`}
                  alt={photocard.title}
                  style={styles.cardImage}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Photo+Indisponible';
                  }}
                />
                <div style={styles.cardContent}>
                  <span style={styles.photoBadge}>
                    📸 {photoArray.length} photo{photoArray.length > 1 ? 's' : ''}
                  </span>
                  <h3 style={styles.cardTitle}>{photocard.title}</h3>
                  <p style={styles.cardDescription}>{photocard.description}</p>
                  {photocard.date && (
                    <p style={styles.cardDate}>
                      📅 {new Date(photocard.date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  <div style={styles.actions}>
                    <button
                      style={styles.btnEdit}
                      onClick={() => handleEdit(photocard)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      style={styles.btnDelete}
                      onClick={() => handleDelete(photocard._id)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPhotocards.length === 0 && (
          <div style={{textAlign: 'center', padding: '60px 20px', color: '#666'}}>
            <p style={{fontSize: '1.2rem'}}>Aucune photocard trouvée</p>
          </div>
        )}

        {showModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingPhotocard ? 'Modifier la photocard' : 'Ajouter une photocard'}
                </h2>
                <button 
                  style={styles.closeBtn} 
                  onClick={handleCloseModal}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Titre *</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    style={styles.input}
                    placeholder="Ex: Sortie au parc"
                    required 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description *</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    style={styles.textarea}
                    placeholder="Décrivez l'activité..."
                    required 
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Date</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Photos * {editingPhotocard && '(laisser vide pour conserver les actuelles)'}
                  </label>
                  <input 
                    id="photos-input" 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleFileChange} 
                    style={styles.fileInput}
                    required={!editingPhotocard}
                  />
                  {previewImages.length > 0 && (
                    <div style={styles.previewGrid}>
                      {previewImages.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Aperçu ${index + 1}`}
                          style={styles.previewImage}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    style={styles.btnCancel} 
                    onClick={handleCloseModal}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    style={styles.btnSubmit} 
                    disabled={loading}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {loading ? 'Chargement...' : (editingPhotocard ? 'Mettre à jour' : 'Ajouter')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('succès') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePhotocards;