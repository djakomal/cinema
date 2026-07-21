import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CinematicIntro from './components/CinematicIntro';

import Home from './components/Page/Home';
import Actors from './components/Page/Actors';
import Projects from './components/Page/Projects';
import Photo from './components/Page/Photo';

import Login from './components/Page/Admin/Login';
import Dashboard from './components/Page/Admin/Dashboard';
import ManageActors from './components/Page/Admin/ManageActors';
import ManageVideos from './components/Page/Admin/ManageVideo';
import ManagePhoto from './components/Page/Admin/ManagePhoto';

import ProtectedRoute from './components/ProtectedRoute';

import './styles/App.css';
import './styles/Navbar.css';
import './styles/Admin.css';
import './styles/Actors.css';
import './styles/photocard.css';
import AboutCard from './components/AboutCard';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introDone, setIntroDone] = useState(false);

  if (showIntro) {
    return (
      <ThemeProvider>
        <CinematicIntro onFinish={() => { setShowIntro(false); setIntroDone(true); }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className={`App${introDone ? ' intro-complete' : ''}`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<AboutCard />} />
            <Route path="/photo" element={<Photo />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/actors"
              element={
                <ProtectedRoute>
                  <ManageActors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/videos"
              element={
                <ProtectedRoute>
                  <ManageVideos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/photos"
              element={
                <ProtectedRoute>
                  <ManagePhoto />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
