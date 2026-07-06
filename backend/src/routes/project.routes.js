const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

router.route('/')
  .get(projectController.getProjectsAdmin)
  .post(projectController.createProject);

router.route('/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
