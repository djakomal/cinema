

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';

function Home() {
  return (
    <div className="home fade-in">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Bienvenue chez <span className="highlight">GRCT</span>
            </h1>
            <p className="hero-subtitle">
              Votre plateforme cinématique pour découvrir nos talents et nos créations
            </p>
            <div className="hero-buttons">
              <Link to="/actors" className="btn btn-primary">
                Découvrir nos acteurs
              </Link>
              <Link to="/projects" className="btn btn-secondary">
                Voir nos projets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section features">
        <div className="container">
          <h2 className="section-title">Ce que nous offrons</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Talents d'exception</h3>
              <p>Découvrez nos acteurs professionnels avec leurs portfolios complets</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Projets créatifs</h3>
              <p>Explorez nos réalisations et extraits de films</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Excellence cinématique</h3>
              <p>Une production de qualité professionnelle</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;