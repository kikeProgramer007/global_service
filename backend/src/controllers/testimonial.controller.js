const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List testimonials for admin (pagination, search, active)
 */
exports.getTestimonialsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const active = req.query.active;

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    const [total, testimonials] = await Promise.all([
      prisma.testimonial.count({ where: whereClause }),
      prisma.testimonial.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' }
      })
    ]);

    return success(res, 'Testimonios (Admin) obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      testimonials
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get testimonial details by ID for admin
 */
exports.getTestimonialById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return error(res, 'Testimonio no encontrado.', {}, 404);
    }

    return success(res, 'Testimonio obtenido correctamente.', { testimonial });
  } catch (err) {
    next(err);
  }
};

/**
 * Create testimonial
 */
exports.createTestimonial = async (req, res, next) => {
  try {
    const { name, role, city, comment, rating, imageUrl, active, order } = req.body;

    if (!name || !comment) {
      return error(res, 'El nombre y el comentario son requeridos.', {}, 400);
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        city,
        comment,
        rating: rating !== undefined ? parseInt(rating) : 5,
        imageUrl,
        active: active !== undefined ? active : true,
        order: order !== undefined ? parseInt(order) : 0
      }
    });

    return success(res, 'Testimonio creado correctamente.', { testimonial }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update testimonial
 */
exports.updateTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, city, comment, rating, imageUrl, active, order } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Testimonio no encontrado.', {}, 404);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (city !== undefined) updateData.city = city;
    if (comment !== undefined) updateData.comment = comment;
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (active !== undefined) updateData.active = active;
    if (order !== undefined) updateData.order = parseInt(order);

    const updated = await prisma.testimonial.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Testimonio actualizado correctamente.', { testimonial: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete testimonial
 */
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Testimonio no encontrado.', {}, 404);
    }

    await prisma.testimonial.delete({ where: { id } });
    return success(res, 'Testimonio eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get active testimonials for public site
 */
exports.getPublicTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    return success(res, 'Testimonios obtenidos correctamente.', { testimonials });
  } catch (err) {
    next(err);
  }
};
