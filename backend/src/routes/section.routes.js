const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section.controller');

router.post('/', sectionController.createSection);

router.route('/:id')
  .get(sectionController.getSectionById)
  .put(sectionController.updateSection)
  .delete(sectionController.deleteSection);

router.put('/:id/order', sectionController.updateSectionOrder);

module.exports = router;
