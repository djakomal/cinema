

import React, { useState } from 'react';
 function VideoPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const API_URL = 'http://localhost:5000';

  return (
    <div className="video-card">
      <div className="video-container">
        {!isPlaying ? (
          <div className="video-thumbnail" onClick={() => setIsPlaying(true)}>
            <img 
              src={`${API_URL}${video.thumbnail}`} 
              alt={video.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/640x360?text=Miniature+Non+Disponible';
              }}
            />
            <div className="play-button">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="rgba(243, 156, 18, 0.9)" />
                <polygon points="24,18 24,42 42,30" fill="black" />
              </svg>
            </div>
          </div>
        ) : (
          <video controls autoPlay className="video-player">
            <source src={`${API_URL}${video.url}`} type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        )}
      </div>
      <div className="video-info">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <small className="video-duration">Durée: {video.duration}s</small>
      </div>
    </div>
  );
}

export default VideoPlayer;