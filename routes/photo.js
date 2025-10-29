const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Photocard = require('../models/photo');
const auth = require('../middleware/auth');
const { uploadPhoto } = require('../middleware/upload'); // ⚠️ Import

console.log('✅ Route photo.js chargée !');

// GET - Récupérer toutes les photocards
router.get('/', async (req, res) => {
  try {
    console.log('📸 Récupération de toutes les photocards...');
    const photocards = await Photocard.find().sort({ date: -1 });
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
    console.log(`📸 Récupération de la photocard ID: ${req.params.id}`);
    const photocard = await Photocard.findById(req.params.id);
    
    if (!photocard) {
      console.log('❌ Photocard non trouvée');
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }
    
    console.log('✅ Photocard trouvée:', photocard.title);
    res.json(photocard);
  } catch (error) {
    console.error('❌ Erreur GET /photo/:id:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST - Créer une nouvelle photocard (protégé par auth)
router.post('/', auth, uploadPhoto.array('photos', 10), async (req, res) => {
  try {
    console.log('📤 Création d\'une nouvelle photocard...');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      console.log('❌ Aucune photo fournie');
      return res.status(400).json({ message: 'Au moins une photo est requise' });
    }

    const photos = req.files.map(file => `/uploads/photo/${file.filename}`);
    console.log('📸 Photos uploadées:', photos);

    const photocard = new Photocard({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || Date.now(),
      photos: photos
    });

    await photocard.save();
    console.log('✅ Photocard créée avec succès:', photocard._id);
    res.status(201).json(photocard);
  } catch (error) {
    console.error('❌ Erreur création photocard:', error);
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// PUT - Mettre à jour une photocard (protégé par auth)
router.put('/:id', auth, uploadPhoto.array('photos', 10), async (req, res) => {
  try {
    console.log(`📝 Mise à jour de la photocard ID: ${req.params.id}`);
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const photocard = await Photocard.findById(req.params.id);
    
    if (!photocard) {
      console.log('❌ Photocard non trouvée');
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }

    photocard.title = req.body.title || photocard.title;
    photocard.description = req.body.description || photocard.description;
    photocard.date = req.body.date || photocard.date;

    if (req.files && req.files.length > 0) {
      console.log('🗑️ Suppression des anciennes photos...');
      
      photocard.photos.forEach(photo => {
        const oldPath = path.join(__dirname, '..', photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log(`✅ Photo supprimée: ${photo}`);
        }
      });

      photocard.photos = req.files.map(file => `/uploads/photo/${file.filename}`);
      console.log('📸 Nouvelles photos:', photocard.photos);
    }

    await photocard.save();
    console.log('✅ Photocard mise à jour avec succès');
    res.json(photocard);
  } catch (error) {
    console.error('❌ Erreur mise à jour:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// DELETE - Supprimer une photocard (protégé par auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log(`🗑️ Suppression de la photocard ID: ${req.params.id}`);
    
    const photocard = await Photocard.findById(req.params.id);
    
    if (!photocard) {
      console.log('❌ Photocard non trouvée');
      return res.status(404).json({ message: 'Photocard non trouvée' });
    }

    photocard.photos.forEach(photo => {
      const filePath = path.join(__dirname, '..', photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Photo supprimée: ${photo}`);
      }
    });

    await Photocard.findByIdAndDelete(req.params.id);
    console.log('✅ Photocard supprimée avec succès');
    res.json({ message: 'Photocard supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

module.exports = router;