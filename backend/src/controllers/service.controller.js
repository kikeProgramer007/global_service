const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slug');

// ==========================================
// SERVICE CATEGORIES (ADMIN)
// ==========================================

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' }
    });
    return success(res, 'Categorías de servicios obtenidas correctamente.', { categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.serviceCategory.findUnique({
      where: { id }
    });
    if (!category) {
      return error(res, 'Categoría no encontrada.', {}, 404);
    }
    return success(res, 'Categoría obtenida correctamente.', { category });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, order, active } = req.body;
    if (!name) {
      return error(res, 'El nombre de la categoría es requerido.', {}, 400);
    }
    const slug = await generateUniqueSlug('serviceCategory', name);
    const category = await prisma.serviceCategory.create({
      data: {
        name,
        slug,
        description,
        icon,
        order: order !== undefined ? parseInt(order) : 0,
        active: active !== undefined ? active : true
      }
    });
    return success(res, 'Categoría creada correctamente.', { category }, 201);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, description, icon, order, active } = req.body;

    const existing = await prisma.serviceCategory.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Categoría no encontrada.', {}, 404);
    }

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = parseInt(order);
    if (active !== undefined) updateData.active = active;

    if (name !== undefined && name !== existing.name) {
      updateData.name = name;
      if (!slug) {
        updateData.slug = await generateUniqueSlug('serviceCategory', name, id);
      }
    }

    if (slug !== undefined && slug !== existing.slug) {
      updateData.slug = await generateUniqueSlug('serviceCategory', slug, id);
    }

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: updateData
    });
    return success(res, 'Categoría actualizada correctamente.', { category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.serviceCategory.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Categoría no encontrada.', {}, 404);
    }
    await prisma.serviceCategory.delete({ where: { id } });
    return success(res, 'Categoría eliminada correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// SERVICES (ADMIN & PUBLIC)
// ==========================================

/**
 * List services for Admin (includes filters & pagination)
 */
exports.getServicesAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const active = req.query.active;
    const categoryId = req.query.category; // Category ID filtering

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    const [total, services] = await Promise.all([
      prisma.service.count({ where: whereClause }),
      prisma.service.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: { category: true }
      })
    ]);

    return success(res, 'Servicios (Admin) obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      services
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single service details for Admin
 */
exports.getServiceById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.service.findUnique({
      where: { id },
      include: { category: true }
    });
    if (!service) {
      return error(res, 'Servicio no encontrado.', {}, 404);
    }
    return success(res, 'Servicio obtenido correctamente.', { service });
  } catch (err) {
    next(err);
  }
};

/**
 * Create service
 */
exports.createService = async (req, res, next) => {
  try {
    const {
      categoryId,
      title,
      shortDesc,
      description,
      icon,
      imageUrl,
      gallery,
      benefits,
      process,
      faq,
      priceFrom,
      active,
      featured,
      order
    } = req.body;

    if (!categoryId || !title) {
      return error(res, 'El ID de categoría y el título son requeridos.', {}, 400);
    }

    // Verify category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(categoryId) }
    });
    if (!category) {
      return error(res, 'La categoría seleccionada no existe.', {}, 404);
    }

    const slug = await generateUniqueSlug('service', title);

    const service = await prisma.service.create({
      data: {
        categoryId: parseInt(categoryId),
        title,
        slug,
        shortDesc,
        description,
        icon,
        imageUrl,
        gallery: gallery || [],
        benefits: benefits || [],
        process: process || [],
        faq: faq || [],
        priceFrom: priceFrom !== undefined ? parseFloat(priceFrom) : null,
        active: active !== undefined ? active : true,
        featured: featured !== undefined ? featured : false,
        order: order !== undefined ? parseInt(order) : 0
      }
    });

    return success(res, 'Servicio creado correctamente.', { service }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update service
 */
exports.updateService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const {
      categoryId,
      title,
      slug,
      shortDesc,
      description,
      icon,
      imageUrl,
      gallery,
      benefits,
      process,
      faq,
      priceFrom,
      active,
      featured,
      order
    } = req.body;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Servicio no encontrado.', {}, 404);
    }

    const updateData = {};
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (gallery !== undefined) updateData.gallery = gallery;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (process !== undefined) updateData.process = process;
    if (faq !== undefined) updateData.faq = faq;
    if (priceFrom !== undefined) updateData.priceFrom = priceFrom !== null ? parseFloat(priceFrom) : null;
    if (active !== undefined) updateData.active = active;
    if (featured !== undefined) updateData.featured = featured;
    if (order !== undefined) updateData.order = parseInt(order);

    if (categoryId !== undefined) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: parseInt(categoryId) }
      });
      if (!category) {
        return error(res, 'La categoría seleccionada no existe.', {}, 404);
      }
      updateData.categoryId = parseInt(categoryId);
    }

    if (title !== undefined && title !== existing.title) {
      updateData.title = title;
      if (!slug) {
        updateData.slug = await generateUniqueSlug('service', title, id);
      }
    }

    if (slug !== undefined && slug !== existing.slug) {
      updateData.slug = await generateUniqueSlug('service', slug, id);
    }

    const updated = await prisma.service.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Servicio actualizado correctamente.', { service: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete service
 */
exports.deleteService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Servicio no encontrado.', {}, 404);
    }
    await prisma.service.delete({ where: { id } });
    return success(res, 'Servicio eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get active services for public website (filters: ?category= (slug/ID), ?featured=, ?search=)
 */
exports.getPublicServices = async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;
    const whereClause = { active: true };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    if (category) {
      // Check if it's an integer ID
      if (/^\d+$/.test(category)) {
        whereClause.categoryId = parseInt(category);
      } else {
        // Query by Category Slug
        whereClause.category = {
          slug: category
        };
      }
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
      include: { category: true }
    });

    return success(res, 'Servicios obtenidos correctamente.', { services });
  } catch (err) {
    next(err);
  }
};

/**
 * Get active service by slug for public website
 */
exports.getPublicServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findFirst({
      where: { slug, active: true },
      include: { category: true }
    });

    if (!service) {
      return error(res, 'Servicio no encontrado.', {}, 404);
    }

    return success(res, 'Detalle del servicio obtenido correctamente.', { service });
  } catch (err) {
    next(err);
  }
};

/**
 * Get active categories for public website
 */
exports.getPublicCategories = async (req, res, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    return success(res, 'Categorías de servicios obtenidas correctamente.', { categories });
  } catch (err) {
    next(err);
  }
};
