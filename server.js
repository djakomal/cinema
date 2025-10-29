
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// config db 
const connectDB = require('./Config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// ⚠️ Servir les fichiers statiques - DOIT ÊTRE AVANT LES ROUTES API
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/actors', require('./routes/actors'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/photo', require('./routes/photo'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API GRCT Cinema 🎬' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});