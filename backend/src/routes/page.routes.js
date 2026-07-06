const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page.controller');
const sectionController = require('../controllers/section.controller');

router.route('/')
  .get(pageController.getPages)
  .post(pageController.createPage);

router.route('/:id')
  .get(pageController.getPageById)
  .put(pageController.updatePage)
  .delete(pageController.deletePage);

// Nested sections endpoint
router.get('/:pageId/sections', sectionController.getSectionsByPage);

module.exports = router;
