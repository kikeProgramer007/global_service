const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slug');

/**
 * Get pages (Admin only, with pagination, search, status filters)
 */
exports.getPages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const skip = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const [total, pages] = await Promise.all([
      prisma.page.count({ where: whereClause }),
      prisma.page.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: {
          sections: {
            orderBy: { order: 'asc' }
          }
        }
      })
    ]);

    return success(res, 'Páginas obtenidas correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      pages
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get page by ID
 */
exports.getPageById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const pageObj = await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!pageObj) {
      return error(res, 'Página no encontrada.', {}, 404);
    }

    return success(res, 'Página obtenida correctamente.', { page: pageObj });
  } catch (err) {
    next(err);
  }
};

/**
 * Create page
 */
exports.createPage = async (req, res, next) => {
  try {
    const { title, description, metaTitle, metaDescription, status, order, active } = req.body;

    if (!title) {
      return error(res, 'El título es requerido.', {}, 400);
    }

    const slug = await generateUniqueSlug('page', title);

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        description,
        metaTitle,
        metaDescription,
        status: status || 'draft',
        order: order !== undefined ? parseInt(order) : 0,
        active: active !== undefined ? active : true
      }
    });

    return success(res, 'Página creada correctamente.', { page: newPage }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update page
 */
exports.updatePage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, slug, description, metaTitle, metaDescription, status, order, active } = req.body;

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return error(res, 'Página no encontrada.', {}, 404);
    }

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (status !== undefined) updateData.status = status;
    if (order !== undefined) updateData.order = parseInt(order);
    if (active !== undefined) updateData.active = active;

    if (title !== undefined && title !== existingPage.title) {
      updateData.title = title;
      if (!slug) {
        updateData.slug = await generateUniqueSlug('page', title, id);
      }
    }

    if (slug !== undefined && slug !== existingPage.slug) {
      updateData.slug = await generateUniqueSlug('page', slug, id);
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Página actualizada correctamente.', { page: updatedPage });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete page
 */
exports.deletePage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return error(res, 'Página no encontrada.', {}, 404);
    }

    await prisma.page.delete({ where: { id } });

    return success(res, 'Página eliminada correctamente.');
  } catch (err) {
    next(err);
  }
};

/**
 * Get public home page data (Page, Sections, Services, Projects, Testimonials, Clients, Settings)
 */
exports.getPublicHome = async (req, res, next) => {
  try {
    const [page, featuredServices, featuredProjects, testimonials, clients, settings] = await Promise.all([
      prisma.page.findUnique({
        where: { slug: 'home' },
        include: {
          sections: {
            where: { active: true },
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.service.findMany({
        where: { active: true, featured: true },
        orderBy: { order: 'asc' },
        include: { category: true }
      }),
      prisma.project.findMany({
        where: { active: true, featured: true },
        orderBy: { order: 'asc' }
      }),
      prisma.testimonial.findMany({
        where: { active: true },
        orderBy: { order: 'asc' }
      }),
      prisma.client.findMany({
        where: { active: true },
        orderBy: { order: 'asc' }
      }),
      prisma.setting.findMany()
    ]);

    // Format settings as a clean dictionary map
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return success(res, 'Datos de la página de inicio pública obtenidos correctamente.', {
      page,
      sections: page ? page.sections : [],
      featuredServices,
      featuredProjects,
      testimonials,
      clients,
      settings: settingsMap
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get active page by slug for public website
 */
exports.getPublicPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pageObj = await prisma.page.findFirst({
      where: { slug, active: true },
      include: {
        sections: {
          where: { active: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!pageObj) {
      return error(res, 'Página no encontrada o inactiva.', {}, 404);
    }

    return success(res, 'Página pública obtenida correctamente.', { page: pageObj });
  } catch (err) {
    next(err);
  }
};

