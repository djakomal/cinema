const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// ANCIEN: MongoDB/Mongoose
// const Photocard = require('../models/photo');
const prisma = require('../Config/prisma');
const auth = require('../middleware/auth');

console.log('✅ Route photo.js chargée !');

// Créer le dossier d'upload s'il n'existe pas
const uploadDir = 'uploads/photo';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Dossier créé : ${uploadDir}`);
}

// Configuration de multer DIRECTEMENT dans ce fichier
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
    console.log('📸 GET /api/photo - Récupération des photocards...');
    // ANCIEN: const photocards = await Photocard.find().sort({ date: -1 });
    const photocards = await prisma.photocard.findMany({ orderBy: { date: 'desc' } });
    console.log(`✅ ${photocards.length} photocard(s) trouvée(s)`);
    res.json(photocards);
  } catch (error) {
    console.error('❌ Erreur GET /photo:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET - Récupérer une photocard par ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`📸 GET /api/photo/${req.params.id}`);
    // ANCIEN: const photocard = await Photocard.findById(req.params.id);
    const photocard = await prisma.photocard.findUnique({ where: { id: req.params.id } });
    
    if (!photocard) {
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }
    
    res.json(photocard);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST - Créer une photocard
router.post('/', auth, upload.array('photos', 10), async (req, res) => {
  try {
    console.log('📤 POST /api/photo - Création...');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Au moins une photo est requise' });
    }

    const photos = req.files.map(file => `/uploads/photo/${file.filename}`);

    // ANCIEN: MongoDB
    // const photocard = new Photocard({ title, description, date, photos });
    // await photocard.save();
    const photocard = await prisma.photocard.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        photos: photos
      }
    });

    console.log('✅ Photocard créée:', photocard.id);
    res.status(201).json(photocard);
  } catch (error) {
    console.error('❌ Erreur création:', error);
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// PUT - Mettre à jour une photocard
router.put('/:id', auth, upload.array('photos', 10), async (req, res) => {
  try {
    console.log(`📝 PUT /api/photo/${req.params.id}`);
    
    // ANCIEN: const photocard = await Photocard.findById(req.params.id);
    const photocard = await prisma.photocard.findUnique({ where: { id: req.params.id } });
    if (!photocard) {
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }

    // ANCIEN: MongoDB - mutation + save()
    // photocard.title = req.body.title || photocard.title;
    // photocard.description = req.body.description || photocard.description;
    // photocard.date = req.body.date || photocard.date;
    // if (req.files?.length > 0) { ... supprimer anciens fichiers ... photocard.photos = newPhotos; }
    // await photocard.save();
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.date) updateData.date = new Date(req.body.date);

    if (req.files && req.files.length > 0) {
      photocard.photos.forEach(photo => {
        const oldPath = path.join(__dirname, '..', photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      });
      updateData.photos = req.files.map(file => `/uploads/photo/${file.filename}`);
    }

    const updatedPhotocard = await prisma.photocard.update({
      where: { id: req.params.id },
      data: updateData
    });

    console.log('✅ Photocard mise à jour');
    res.json(updatedPhotocard);
  } catch (error) {
    console.error('❌ Erreur mise à jour:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// DELETE - Supprimer une photocard
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log(`🗑️ DELETE /api/photo/${req.params.id}`);
    
    // ANCIEN: const photocard = await Photocard.findById(req.params.id);
    const photocard = await prisma.photocard.findUnique({ where: { id: req.params.id } });
    if (!photocard) {
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }

    photocard.photos.forEach(photo => {
      const filePath = path.join(__dirname, '..', photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // ANCIEN: await Photocard.findByIdAndDelete(req.params.id);
    await prisma.photocard.delete({ where: { id: req.params.id } });
    console.log('✅ Photocard supprimée');
    res.json({ message: 'Photocard supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

module.exports = router;
