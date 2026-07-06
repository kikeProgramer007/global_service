const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure folders exist
const uploadDirBase = path.join(process.cwd(), 'uploads');
const subdirs = ['images', 'documents', 'videos'];
subdirs.forEach((dir) => {
  const dirPath = path.join(uploadDirBase, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mimeType = file.mimetype;
    let subDir = 'images';

    if (mimeType.startsWith('video/')) {
      subDir = 'videos';
    } else if (
      mimeType === 'application/pdf' ||
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      subDir = 'documents';
    }

    cb(null, path.join(uploadDirBase, subDir));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filter allowed files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  const allowedImages = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  const allowedDocs = ['.pdf', '.doc', '.docx'];
  const allowedVideos = ['.mp4', '.webm'];

  if (mimeType.startsWith('image/')) {
    if (allowedImages.includes(ext)) return cb(null, true);
  } else if (mimeType.startsWith('video/')) {
    if (allowedVideos.includes(ext)) return cb(null, true);
  } else if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    if (allowedDocs.includes(ext)) return cb(null, true);
  }

  return cb(
    new Error(`Formato no permitido para extensión: ${ext} o mimetype: ${mimeType}`),
    false
  );
};

// Initialize multer with max 50MB (largest category limit)
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max limit physically processed
  }
}).single('file');

/**
 * Upload Middleware with dynamic category size checks
 */
const uploadMiddleware = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'Error al subir el archivo.',
        error: { message: err.message }
      });
    }

    if (!req.file) {
      return next(); // No file was uploaded, which is fine if optional
    }

    const size = req.file.size;
    const mimeType = req.file.mimetype;

    let maxSize = 0;
    let category = '';

    if (mimeType.startsWith('image/')) {
      maxSize = 10 * 1024 * 1024; // 10MB
      category = 'image';
    } else if (mimeType.startsWith('video/')) {
      maxSize = 50 * 1024 * 1024; // 50MB
      category = 'video';
    } else {
      maxSize = 20 * 1024 * 1024; // 20MB
      category = 'document';
    }

    if (size > maxSize) {
      // Remove file if it exceeds category limits
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to remove oversized file:', unlinkErr);
      }

      return res.status(400).json({
        ok: false,
        message: `El archivo excede el límite para la categoría '${category}'. Máximo: ${maxSize / (1024 * 1024)}MB.`,
        error: { message: 'File size limit exceeded' }
      });
    }

    // Attach categorized type to request file object for later DB insertion
    req.file.categoryType = category;
    next();
  });
};

module.exports = uploadMiddleware;
