const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

router.route('/')
  .get(clientController.getClientsAdmin)
  .post(clientController.createClient);

router.route('/:id')
  .get(clientController.getClientById)
  .put(clientController.updateClient)
  .delete(clientController.deleteClient);

module.exports = router;
