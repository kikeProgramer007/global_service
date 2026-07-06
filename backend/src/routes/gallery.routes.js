const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');

router.route('/')
  .get(galleryController.getGalleryAdmin)
  .post(galleryController.createGalleryItem);

router.route('/:id')
  .get(galleryController.getGalleryItemById)
  .put(galleryController.updateGalleryItem)
  .delete(galleryController.deleteGalleryItem);

module.exports = router;
