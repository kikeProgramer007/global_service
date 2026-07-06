const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List gallery items for admin
 */
exports.getGalleryAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const active = req.query.active;
    const category = req.query.category;

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    if (category) {
      whereClause.category = category;
    }

    const [total, galleryItems] = await Promise.all([
      prisma.galleryItem.count({ where: whereClause }),
      prisma.galleryItem.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' }
      })
    ]);

    return success(res, 'Galería (Admin) obtenida correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      galleryItems
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get gallery item by ID
 */
exports.getGalleryItemById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.galleryItem.findUnique({
      where: { id }
    });

    if (!item) {
      return error(res, 'Elemento de galería no encontrado.', {}, 404);
    }

    return success(res, 'Elemento de galería obtenido correctamente.', { galleryItem: item });
  } catch (err) {
    next(err);
  }
};

/**
 * Create gallery item
 */
exports.createGalleryItem = async (req, res, next) => {
  try {
    const { title, description, imageUrl, category, active, order } = req.body;

    if (!imageUrl) {
      return error(res, 'La URL de la imagen es obligatoria.', {}, 400);
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        active: active !== undefined ? active : true,
        order: order !== undefined ? parseInt(order) : 0
      }
    });

    return success(res, 'Elemento de galería creado correctamente.', { galleryItem: item }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update gallery item
 */
exports.updateGalleryItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, imageUrl, category, active, order } = req.body;

    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Elemento de galería no encontrado.', {}, 404);
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (active !== undefined) updateData.active = active;
    if (order !== undefined) updateData.order = parseInt(order);

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Elemento de galería actualizado correctamente.', { galleryItem: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete gallery item
 */
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Elemento de galería no encontrado.', {}, 404);
    }

    await prisma.galleryItem.delete({ where: { id } });
    return success(res, 'Elemento de galería eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get active gallery items (filter: ?category=)
 */
exports.getPublicGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const whereClause = { active: true };

    if (category) {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    const galleryItems = await prisma.galleryItem.findMany({
      where: whereClause,
      orderBy: { order: 'asc' }
    });

    return success(res, 'Galería obtenida correctamente.', { galleryItems });
  } catch (err) {
    next(err);
  }
};
