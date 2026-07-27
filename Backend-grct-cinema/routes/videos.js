

const express = require('express');
const router = express.Router();
// ANCIEN: MongoDB/Mongoose
// const Video = require('../models/video');
const prisma = require('../Config/prisma');
const auth = require('../middleware/auth');
const { uploadVideo } = require('../middleware/upload');

// @route   GET /api/videos
// @desc    Obtenir toutes les vidéos
// @access  Public
router.get('/', async (req, res) => {
  try {
    // ANCIEN: const videos = await Video.find().sort({ createdAt: -1 });
    const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/videos/:id
// @desc    Obtenir une vidéo par ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // ANCIEN: const video = await Video.findById(req.params.id);
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    
    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }
    
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/videos
// @desc    Créer une nouvelle vidéo
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  const upload = uploadVideo.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]);

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, description, duration } = req.body;

      if (!title || !description || !duration) {
        return res.status(400).json({ message: 'Titre, description et durée requis' });
      }

      // Vérifier que la durée ne dépasse pas 60 secondes
      if (parseInt(duration) > 60) {
        return res.status(400).json({ message: 'La vidéo ne doit pas dépasser 60 secondes' });
      }

      if (!req.files || !req.files.video || !req.files.thumbnail) {
        return res.status(400).json({ message: 'Vidéo et miniature requises' });
      }

      // ANCIEN: MongoDB
      // const video = new Video({ title, description, duration, url: ..., thumbnail: ... });
      // await video.save();
      const video = await prisma.video.create({
        data: {
          title,
          description,
          duration: parseInt(duration),
          url: `/uploads/videos/${req.files.video[0].filename}`,
          thumbnail: `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
        }
      });

      res.status(201).json({
        message: 'Vidéo créée avec succès',
        video
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
});

// @route   PUT /api/videos/:id
// @desc    Mettre à jour une vidéo
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  const upload = uploadVideo.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]);

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const video = await prisma.video.findUnique({ where: { id: req.params.id } });
      
      if (!video) {
        return res.status(404).json({ message: 'Vidéo non trouvée' });
      }

      const { title, description, duration } = req.body;

      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (duration) {
        if (parseInt(duration) > 60) {
          return res.status(400).json({ message: 'La vidéo ne doit pas dépasser 60 secondes' });
        }
        updateData.duration = parseInt(duration);
      }
      if (req.files?.video) {
        updateData.url = `/uploads/videos/${req.files.video[0].filename}`;
      }
      if (req.files?.thumbnail) {
        updateData.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
      }

      const updatedVideo = await prisma.video.update({
        where: { id: req.params.id },
        data: updateData
      });

      res.json({
        message: 'Vidéo mise à jour avec succès',
        video: updatedVideo
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
});

// @route   DELETE /api/videos/:id
// @desc    Supprimer une vidéo
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // ANCIEN: const video = await Video.findById(req.params.id);
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    
    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }

    // ANCIEN: await video.deleteOne();
    await prisma.video.delete({ where: { id: req.params.id } });

    res.json({ message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
