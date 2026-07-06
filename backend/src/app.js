const express = require('express');
const cors = require('cors');
const path = require('path');
const errorMiddleware = require('./middlewares/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const pageRoutes = require('./routes/page.routes');
const sectionRoutes = require('./routes/section.routes');
const { serviceRouter, categoryRouter } = require('./routes/service.routes');
const projectRoutes = require('./routes/project.routes');
const { postRouter, categoryRouter: blogCategoryRouter } = require('./routes/blog.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const clientRoutes = require('./routes/client.routes');
const galleryRoutes = require('./routes/gallery.routes');
const mediaRoutes = require('./routes/media.routes');
const contactRoutes = require('./routes/contact.routes');
const quoteRoutes = require('./routes/quote.routes');
const settingRoutes = require('./routes/setting.routes');
const teamRoutes = require('./routes/team.routes');

// Import authentication check
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'GLOBAL SERVICE CMS API is running.'
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);

// Protected Admin Routes (Requires JWT Validation)
app.use('/api/admin/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/admin/users', authMiddleware, userRoutes);
app.use('/api/admin/pages', authMiddleware, pageRoutes);
app.use('/api/admin/sections', authMiddleware, sectionRoutes);
app.use('/api/admin/services', authMiddleware, serviceRouter);
app.use('/api/admin/service-categories', authMiddleware, categoryRouter);
app.use('/api/admin/projects', authMiddleware, projectRoutes);
app.use('/api/admin/blog', authMiddleware, postRouter);
app.use('/api/admin/blog-categories', authMiddleware, blogCategoryRouter);
app.use('/api/admin/testimonials', authMiddleware, testimonialRoutes);
app.use('/api/admin/clients', authMiddleware, clientRoutes);
app.use('/api/admin/gallery', authMiddleware, galleryRoutes);
app.use('/api/admin/media', authMiddleware, mediaRoutes);
app.use('/api/admin/contact-messages', authMiddleware, contactRoutes);
app.use('/api/admin/quotes', authMiddleware, quoteRoutes);
app.use('/api/admin/settings', authMiddleware, settingRoutes);
app.use('/api/admin/team', authMiddleware, teamRoutes);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
