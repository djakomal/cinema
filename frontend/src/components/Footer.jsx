import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h4>GRCT</h4>
          <p>Groupe Révolutionnaire Cinématographique du Togo</p>
          <p>Lomé, Togo</p>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <p>Email: <a href="mailto:grct228@gmail.com">grct228@gmail.com</a></p>
          <p>Tél: 90556591 / 70542896 / 97453586</p>
        </div>
        <div className="footer-column">
          <h4>Réseaux</h4>
          <p>YouTube: <a href="https://www.youtube.com/@GRCT-m8u" target="_blank" rel="noopener noreferrer">@GRCT-m8u</a></p>
        </div>
      </div>
      <div className="footer-copy">
        <p>© 2025 GRCT. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
