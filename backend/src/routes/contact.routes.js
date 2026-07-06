const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

router.get('/', contactController.getMessagesAdmin);

router.route('/:id')
  .get(contactController.getMessageById)
  .delete(contactController.deleteMessage);

router.put('/:id/status', contactController.updateMessageStatus);

module.exports = router;
