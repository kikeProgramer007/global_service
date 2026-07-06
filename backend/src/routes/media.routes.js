const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.get('/', mediaController.getMediaFiles);
router.post('/upload', uploadMiddleware, mediaController.uploadFile);
router.delete('/:id', mediaController.deleteMediaFile);

module.exports = router;
