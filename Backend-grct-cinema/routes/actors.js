const express = require('express');
const router = express.Router();
// ANCIEN: MongoDB/Mongoose
// const Actor = require('../models/actors');
const prisma = require('../Config/prisma');
const auth = require('../middleware/auth');
const { uploadActorComplete } = require('../middleware/upload');


// @route   GET /api/actors
router.get('/', async (req, res) => {
  try {
    // ANCIEN: const actors = await Actor.find().sort({ createdAt: -1 });
    const actors = await prisma.actor.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(actors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   GET /api/actors/:id
router.get('/:id', async (req, res) => {
  try {
    // ANCIEN: const actor = await Actor.findById(req.params.id);
    const actor = await prisma.actor.findUnique({ where: { id: req.params.id } });
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
    
    // ANCIEN: MongoDB
    // const actor = new Actor({ name, bio, photo: ..., cv: ... });
    // await actor.save();
    const actor = await prisma.actor.create({
      data: {
        name,
        bio,
        photo: `/uploads/actors/${req.files.photo[0].filename}`,
        cv: `/uploads/cvs/${req.files.cv[0].filename}`
      }
    });
    
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
    
    // ANCIEN: const actor = await Actor.findById(req.params.id);
    const actor = await prisma.actor.findUnique({ where: { id: req.params.id } });
    
    if (!actor) {
      return res.status(404).json({ message: 'Acteur non trouvé' });
    }
    
    // ANCIEN: MongoDB - mutation + save()
    // if (name) actor.name = name;
    // if (bio) actor.bio = bio;
    // if (req.files?.photo?.[0]) actor.photo = ...;
    // if (req.files?.cv?.[0]) actor.cv = ...;
    // await actor.save();
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (req.files && req.files.photo && req.files.photo[0]) {
      updateData.photo = `/uploads/actors/${req.files.photo[0].filename}`;
    }
    if (req.files && req.files.cv && req.files.cv[0]) {
      updateData.cv = `/uploads/cvs/${req.files.cv[0].filename}`;
    }
    
    const updatedActor = await prisma.actor.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json({ message: 'Acteur mis à jour avec succès', actor: updatedActor });
  } catch (error) {
    console.error('Erreur PUT:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   DELETE /api/actors/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // ANCIEN: const actor = await Actor.findById(req.params.id);
    const actor = await prisma.actor.findUnique({ where: { id: req.params.id } });
    if (!actor) return res.status(404).json({ message: 'Acteur non trouvé' });
    
    // ANCIEN: await actor.deleteOne();
    await prisma.actor.delete({ where: { id: req.params.id } });
    
    res.json({ message: 'Acteur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
