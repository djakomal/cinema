import React, { useEffect, useRef, useState } from 'react';
import '../styles/CinematicIntro.css';

const TITLE_TEXT = 'GRCT CINÉMA';

function CinematicIntro({ onFinish }) {
  const overlayRef = useRef(null);
  const onFinishRef = useRef(onFinish);
  const [shownLetters, setShownLetters] = useState(0);

  useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);

  useEffect(() => {
    TITLE_TEXT.split('').forEach((_, i) => {
      setTimeout(() => setShownLetters(i + 1), 7600 + i * 120);
    });
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => overlayRef.current?.classList.add('fade-out'), 10500),
      setTimeout(() => onFinishRef.current(), 11800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const skip = () => {
    overlayRef.current?.classList.add('fade-out');
    setTimeout(() => onFinishRef.current(), 1200);
  };

  return (
    <div className="cinematic-overlay" ref={overlayRef} onClick={skip}>
      <div className="cinematic-grain" />
      <div className="cinematic-vignette" />
      <div className="cinematic-scanlines" />
      <div className="cinematic-shutter" />

      <div className="cinematic-flicker" />
      <div className="cinematic-beam" />

      <div className="cinematic-countdown">
        <span className="countdown-number n1">3</span>
        <span className="countdown-number n2">2</span>
        <span className="countdown-number n3">1</span>
      </div>

      <div className="cinematic-clap">
        <div className="clap-board">
          <div className="clap-top">
            <div className="clap-stripe" />
          </div>
          <div className="clap-bottom">
            <div className="clap-text">GRCT</div>
            <div className="clap-detail">PRISE 1 — SCÈNE 1</div>
          </div>
        </div>
      </div>
      <div className="cinematic-flash" />

      <div className="cinematic-intertitle">
        <div className="intertitle-card">
          <span>Et maintenant...</span>
        </div>
      </div>

      <div className="cinematic-title fade-title">
        <div className="cinematic-title-label">Présente</div>
        <div className="title-letters">
          {TITLE_TEXT.split('').map((char, i) => (
            <span
              key={i}
              className={`title-letter${i < shownLetters ? ' show' : ''}`}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
        <div className="cinematic-title-line" />
        <div className="cinematic-title-sub">
          Groupe Révolutionnaire Cinématographique du Togo
        </div>
      </div>

      <div className="title-particles">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={`gp-${i}`}
            className="title-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDuration: `${6 + Math.random() * 10}s`,
              animationDelay: `${7.5 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <button className="cinematic-skip" onClick={(e) => { e.stopPropagation(); skip(); }}>
        Passer l'intro
      </button>
    </div>
  );
}

export default CinematicIntro;
