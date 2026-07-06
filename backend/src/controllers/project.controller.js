const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slug');

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List projects for admin (pagination, search, category, active)
 */
exports.getProjectsAdmin = async (req, res, next) => {
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
        { client: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    if (category) {
      whereClause.category = category; // E.g., Software, Web
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where: whereClause }),
      prisma.project.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' }
      })
    ]);

    return success(res, 'Proyectos (Admin) obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      projects
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get project details by ID for admin
 */
exports.getProjectById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return error(res, 'Proyecto no encontrado.', {}, 404);
    }

    return success(res, 'Proyecto obtenido correctamente.', { project });
  } catch (err) {
    next(err);
  }
};

/**
 * Create project
 */
exports.createProject = async (req, res, next) => {
  try {
    const {
      title,
      category,
      client,
      shortDesc,
      description,
      imageUrl,
      gallery,
      techStack,
      demoUrl,
      videoUrl,
      active,
      featured,
      order
    } = req.body;

    if (!title || !category) {
      return error(res, 'El título y la categoría del proyecto son obligatorios.', {}, 400);
    }

    const slug = await generateUniqueSlug('project', title);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        category,
        client,
        shortDesc,
        description,
        imageUrl,
        gallery: gallery || [],
        techStack: techStack || [],
        demoUrl,
        videoUrl,
        active: active !== undefined ? active : true,
        featured: featured !== undefined ? featured : false,
        order: order !== undefined ? parseInt(order) : 0
      }
    });

    return success(res, 'Proyecto creado correctamente.', { project }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update project
 */
exports.updateProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      slug,
      category,
      client,
      shortDesc,
      description,
      imageUrl,
      gallery,
      techStack,
      demoUrl,
      videoUrl,
      active,
      featured,
      order
    } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Proyecto no encontrado.', {}, 404);
    }

    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (client !== undefined) updateData.client = client;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (gallery !== undefined) updateData.gallery = gallery;
    if (techStack !== undefined) updateData.techStack = techStack;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (active !== undefined) updateData.active = active;
    if (featured !== undefined) updateData.featured = featured;
    if (order !== undefined) updateData.order = parseInt(order);

    if (title !== undefined && title !== existing.title) {
      updateData.title = title;
      if (!slug) {
        updateData.slug = await generateUniqueSlug('project', title, id);
      }
    }

    if (slug !== undefined && slug !== existing.slug) {
      updateData.slug = await generateUniqueSlug('project', slug, id);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Proyecto actualizado correctamente.', { project: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete project
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Proyecto no encontrado.', {}, 404);
    }

    await prisma.project.delete({ where: { id } });
    return success(res, 'Proyecto eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get active projects (filters: ?category=, ?featured=, ?search=)
 */
exports.getPublicProjects = async (req, res, next) => {
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
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { order: 'asc' }
    });

    return success(res, 'Proyectos obtenidos correctamente.', { projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Get project details by slug for public website
 */
exports.getPublicProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findFirst({
      where: { slug, active: true }
    });

    if (!project) {
      return error(res, 'Proyecto no encontrado.', {}, 404);
    }

    return success(res, 'Detalle del proyecto obtenido correctamente.', { project });
  } catch (err) {
    next(err);
  }
};
