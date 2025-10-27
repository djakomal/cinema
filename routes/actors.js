const express = require('express');
const router = express.Router();
const Actor = require('../models/actors');
const auth = require('../middleware/auth');
const { uploadActorComplete } = require('../middleware/upload');

// @route   GET /api/actors
router.get('/', async (req, res) => {
  try {
    const actors = await Actor.find().sort({ createdAt: -1 });
    res.json(actors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/actors/:id
router.get('/:id', async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ message: 'Acteur non trouvé' });
    res.json(actor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/actors
router.post('/', auth, uploadActorComplete.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const { name, bio } = req.body;
    
    if (!name || !bio) {
      return res.status(400).json({ message: 'Nom et biographie requis' });
    }
    
    if (!req.files || !req.files.photo || !req.files.cv) {
      return res.status(400).json({ 
        message: 'Photo et CV requis',
        receivedFiles: req.files ? Object.keys(req.files) : []
      });
    }
    
    const actor = new Actor({
      name,
      bio,
      photo: `/uploads/actors/${req.files.photo[0].filename}`,
      cv: `/uploads/cvs/${req.files.cv[0].filename}`
    });
    
    await actor.save();
    res.status(201).json({ message: 'Acteur créé avec succès', actor });
  } catch (error) {
    console.error('Erreur POST:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   PUT /api/actors/:id
router.put('/:id', auth, uploadActorComplete.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('PUT - Body:', req.body);
    console.log('PUT - Files:', req.files);
    
    const { name, bio } = req.body;
    const actor = await Actor.findById(req.params.id);
    
    if (!actor) {
      return res.status(404).json({ message: 'Acteur non trouvé' });
    }
    
    if (name) actor.name = name;
    if (bio) actor.bio = bio;
    
    // Mettre à jour la photo si fournie
    if (req.files && req.files.photo && req.files.photo[0]) {
      actor.photo = `/uploads/actors/${req.files.photo[0].filename}`;
    }
    
    // Mettre à jour le CV si fourni
    if (req.files && req.files.cv && req.files.cv[0]) {
      actor.cv = `/uploads/cvs/${req.files.cv[0].filename}`;
    }
    
    await actor.save();
    res.json({ message: 'Acteur mis à jour avec succès', actor });
  } catch (error) {
    console.error('Erreur PUT:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   DELETE /api/actors/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ message: 'Acteur non trouvé' });
    await actor.deleteOne();
    res.json({ message: 'Acteur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;