import React, { useState, useEffect } from 'react';
import ActorCard from '../ActorCard';
import { getActors } from '../../Services/api';
import '../../styles/Actors.css';

function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      setLoading(true);
      const response = await getActors();
      setActors(response.data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des acteurs:', err);
      setError('Impossible de charger les acteurs. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des acteurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchActors} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="actors-page section fade-in">
      <div className="container">
        <h1 className="section-title">Nos Acteurs</h1>
        {actors.length === 0 ? (
          <div className="empty-state">
            <p>Aucun acteur pour le moment.</p>
          </div>
        ) : (
          <div className="actors-grid">
            {actors.map(actor => (
              <ActorCard key={actor._id} actor={actor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Actors;