
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers s'ils n'existent pas
const createUploadDirs = () => {
  const dirs = ['uploads/actors', 'uploads/cvs', 'uploads/videos', 'uploads/thumbnails'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configuration du stockage pour les photos d'acteurs
// const actorStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/actors/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'actor-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Configuration du stockage pour les CVs
// const cvStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/cvs/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Configuration combinée pour acteurs (photo + CV)
const actorCombinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      cb(null, 'uploads/actors/');
    } else if (file.fieldname === 'cv') {
      cb(null, 'uploads/cvs/');
    } else {
      cb(new Error('Champ non autorisé'), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    if (file.fieldname === 'photo') {
      cb(null, 'actor-' + uniqueSuffix + path.extname(file.originalname));
    } else if (file.fieldname === 'cv') {
      cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
    }
  }
});

// Filtre combiné
const actorCombinedFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées pour la photo!'), false);
    }
  } else if (file.fieldname === 'cv') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés pour le CV!'), false);
    }
  } else {
    cb(new Error('Champ non autorisé!'), false);
  }
};

// Upload combiné pour acteurs
const uploadActorComplete = multer({
  storage: actorCombinedStorage,
  fileFilter: actorCombinedFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});


// Configuration du stockage pour les vidéos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'video' ? 'video-' : 'thumb-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtres de fichiers
// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Seules les images sont autorisées!'), false);
//   }
// };

// const pdfFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Seuls les fichiers PDF sont autorisés!'), false);
//   }
// };

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les vidéos et images sont autorisées!'), false);
  }
};

//Exports des uploads
const uploadActorPhoto = multer({
  storage: actorCombinedStorage,
  fileFilter: actorCombinedFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

const uploadCV = multer({
  storage: actorCombinedStorage,
  fileFilter: actorCombinedFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

module.exports = {
  uploadActorPhoto,
  uploadCV,
  uploadVideo,
  uploadActorComplete  // NOUVEAU
};