const express = require('express');
const serviceController = require('../controllers/service.controller');

const serviceRouter = express.Router();
serviceRouter.route('/')
  .get(serviceController.getServicesAdmin)
  .post(serviceController.createService);

serviceRouter.route('/:id')
  .get(serviceController.getServiceById)
  .put(serviceController.updateService)
  .delete(serviceController.deleteService);

const categoryRouter = express.Router();
categoryRouter.route('/')
  .get(serviceController.getCategories)
  .post(serviceController.createCategory);

categoryRouter.route('/:id')
  .get(serviceController.getCategoryById)
  .put(serviceController.updateCategory)
  .delete(serviceController.deleteCategory);

module.exports = {
  serviceRouter,
  categoryRouter
};
