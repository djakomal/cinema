// React et Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Composants de navigation
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages publiques
import Home from './components/Page/Home';
import Actors from './components/Page/Actors';
import Projects from './components/Page/Projects';
import Photo from './components/Page/Photo';

// Pages Admin
import Login from './components/Page/Admin/Login';
import Dashboard from './components/Page/Admin/Dashboard';
import ManageActors from './components/Page/Admin/ManageActors';
import ManageVideos from './components/Page/Admin/ManageVideo';
import ManagePhoto from './components/Page/Admin/ManagePhoto';

// Utilitaires
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './styles/App.css';
import './styles/Navbar.css';
import './styles/Admin.css';
import './styles/Actors.css';
import './styles/photocard.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/projects" element={<Projects />} />
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
                <ManagePhoto/>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;