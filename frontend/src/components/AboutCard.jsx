import React from 'react';
import '../styles/AboutCard.css'; // Importez le fichier CSS

function AboutCard() {
    return (
        <div className="about-card">   
            <h2 className="about-title">Groupe Révolutionnaire Cinématographique du Togo (GRCT)</h2>
            
            <div className="about-content">
                <p className="about-description">
                    Fondé en 2014, le GRCT est une association dédiée à la promotion du cinéma au Togo.
                    Nous organisons des projections, ateliers et événements pour sensibiliser et éduquer le public.
                </p>
                <p className="about-description">
                    Notre mission est de valoriser le cinéma local, soutenir les talents émergents et offrir une plateforme aux cinéastes togolais.
                </p>
                <p className="about-description">
                    Rejoignez-nous pour célébrer le cinéma et découvrir les histoires uniques du Togo à travers notre passion commune.
                </p>
            </div>

            <div className="about-location">
                <h3 className="location-title">📍 Notre Localisation</h3>
                <div className="location-content">
                    <p><strong>Adresse :</strong> Lomé, Togo</p>
                    <p><strong>Email :</strong> contact@grct-togo.org</p>
                    <p><strong>Téléphone :</strong> +228 90556591 / 70542896 / 97453586</p>
                </div>
                
                {/* Option: Intégrer Google Maps */}
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126846.99374588194!2d1.1626287!3d6.1256261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c1a8b9b5e5%3A0x4c8a1e2b3e8f4f4e!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2s!4v1234567890"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localisation GRCT"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default AboutCard;
