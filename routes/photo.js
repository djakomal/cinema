const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Photocard = require('../models/Photocard');
const auth = require('../middleware/auth'); // Middleware d'authentification

// Configuration de multer pour l'upload de plusieurs photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/photo';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photocard-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max par fichier
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées!'));
    }
  }
});

// GET - Récupérer toutes les photocards
router.get('/', async (req, res) => {
  try {
    const photocards = await Photocard.find().sort({ date: -1 });
    res.json(photocards);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET - Récupérer une photocard par ID
router.get('/:id', async (req, res) => {
  try {
    const photocard = await Photocard.findById(req.params.id);
    if (!photocard) {
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }
    res.json(photocard);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST - Créer une nouvelle photocard (protégé par auth)
router.post('/', auth, upload.array('photos', 10), async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Au moins une photo est requise' });
    }

    const photos = req.files.map(file => `/uploads/photo/${file.filename}`);

    const photocard = new Photocard({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || Date.now(),
      photos: photos
    });

    await photocard.save();
    res.status(201).json(photocard);
  } catch (error) {
    console.error('Erreur création photocard:', error);
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// PUT - Mettre à jour une photocard (protégé par auth)
router.put('/:id', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const photocard = await Photocard.findById(req.params.id);
    if (!photocard) {
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }

    // Mettre à jour les champs texte
    photocard.title = req.body.title || photocard.title;
    photocard.description = req.body.description || photocard.description;
    photocard.date = req.body.date || photocard.date;

    // Si de nouvelles photos sont uploadées
    if (req.files && req.files.length > 0) {
      // Supprimer les anciennes photos
      photocard.photos.forEach(photo => {
        const oldPath = path.join(__dirname, '..', photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      });

      // Ajouter les nouvelles photos
      photocard.photos = req.files.map(file => `/uploads/photo/${file.filename}`);
    }

    await photocard.save();
    res.json(photocard);
  } catch (error) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// DELETE - Supprimer une photocard (protégé par auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const photocard = await Photocard.findById(req.params.id);
    if (!photocard) {
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }

    // Supprimer les fichiers photos
    photocard.photos.forEach(photo => {
      const filePath = path.join(__dirname, '..', photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Photocard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photocard supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

module.exports = router;