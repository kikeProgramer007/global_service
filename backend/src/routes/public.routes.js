const express = require('express');
const router = express.Router();

const pageController = require('../controllers/page.controller');
const serviceController = require('../controllers/service.controller');
const projectController = require('../controllers/project.controller');
const blogController = require('../controllers/blog.controller');
const testimonialController = require('../controllers/testimonial.controller');
const clientController = require('../controllers/client.controller');
const galleryController = require('../controllers/gallery.controller');
const settingController = require('../controllers/setting.controller');
const contactController = require('../controllers/contact.controller');
const quoteController = require('../controllers/quote.controller');
const teamController = require('../controllers/team.controller');

// 1. Home Page Info
router.get('/home', pageController.getPublicHome);

// 2. Page details by Slug
router.get('/pages/:slug', pageController.getPublicPageBySlug);

// 3. Services public endpoints
router.get('/services', serviceController.getPublicServices);
router.get('/services/:slug', serviceController.getPublicServiceBySlug);
router.get('/service-categories', serviceController.getPublicCategories);

// 4. Projects public endpoints
router.get('/projects', projectController.getPublicProjects);
router.get('/projects/:slug', projectController.getPublicProjectBySlug);

// 5. Blog public endpoints
router.get('/blog', blogController.getPublicPosts);
router.get('/blog/:slug', blogController.getPublicPostBySlug);
router.get('/blog-categories', blogController.getPublicCategories);

// 6. Testimonials public endpoint
router.get('/testimonials', testimonialController.getPublicTestimonials);

// 7. Clients public endpoint
router.get('/clients', clientController.getPublicClients);

// 8. Gallery public endpoint
router.get('/gallery', galleryController.getPublicGallery);

// 9. Settings public endpoint
router.get('/settings', settingController.getPublicSettings);

// 11. Team public endpoint
router.get('/team', teamController.getPublicTeam);

// 10. Forms public submissions
router.post('/contact', contactController.submitContactMessage);
router.post('/quote', quoteController.submitQuoteRequest);

module.exports = router;
