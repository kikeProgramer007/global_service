const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');

router.route('/')
  .get(testimonialController.getTestimonialsAdmin)
  .post(testimonialController.createTestimonial);

router.route('/:id')
  .get(testimonialController.getTestimonialById)
  .put(testimonialController.updateTestimonial)
  .delete(testimonialController.deleteTestimonial);

module.exports = router;
