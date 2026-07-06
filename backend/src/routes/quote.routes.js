const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');

router.get('/', quoteController.getQuotesAdmin);

router.route('/:id')
  .get(quoteController.getQuoteById)
  .delete(quoteController.deleteQuote);

router.put('/:id/status', quoteController.updateQuoteStatus);

module.exports = router;
