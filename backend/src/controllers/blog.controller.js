const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slug');

// ==========================================
// BLOG CATEGORIES (ADMIN)
// ==========================================

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    });
    return success(res, 'Categorías de blog obtenidas correctamente.', { categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, active } = req.body;
    if (!name) {
      return error(res, 'El nombre de la categoría es obligatorio.', {}, 400);
    }
    const slug = await generateUniqueSlug('blogCategory', name);
    const category = await prisma.blogCategory.create({
      data: {
        name,
        slug,
        description,
        active: active !== undefined ? active : true
      }
    });
    return success(res, 'Categoría de blog creada correctamente.', { category }, 201);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, description, active } = req.body;

    const existing = await prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Categoría no encontrada.', {}, 404);
    }

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (active !== undefined) updateData.active = active;

    if (name !== undefined && name !== existing.name) {
      updateData.name = name;
      if (!slug) {
        updateData.slug = await generateUniqueSlug('blogCategory', name, id);
      }
    }

    if (slug !== undefined && slug !== existing.slug) {
      updateData.slug = await generateUniqueSlug('blogCategory', slug, id);
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: updateData
    });
    return success(res, 'Categoría de blog actualizada correctamente.', { category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Categoría no encontrada.', {}, 404);
    }
    await prisma.blogCategory.delete({ where: { id } });
    return success(res, 'Categoría de blog eliminada correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// BLOG POSTS (ADMIN & PUBLIC)
// ==========================================

/**
 * List blog posts for admin (pagination, search, category, status)
 */
exports.getPostsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // draft, published
    const categoryId = req.query.category;

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where: whereClause }),
      prisma.blogPost.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      })
    ]);

    return success(res, 'Entradas de blog (Admin) obtenidas correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      posts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get blog post by ID for admin
 */
exports.getPostById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!post) {
      return error(res, 'Entrada de blog no encontrada.', {}, 404);
    }

    return success(res, 'Entrada de blog obtenida correctamente.', { post });
  } catch (err) {
    next(err);
  }
};

/**
 * Create blog post
 */
exports.createPost = async (req, res, next) => {
  try {
    const {
      categoryId,
      title,
      excerpt,
      content,
      imageUrl,
      author,
      status
    } = req.body;

    if (!categoryId || !title) {
      return error(res, 'El ID de la categoría y el título son requeridos.', {}, 400);
    }

    const category = await prisma.blogCategory.findUnique({
      where: { id: parseInt(categoryId) }
    });
    if (!category) {
      return error(res, 'La categoría seleccionada no existe.', {}, 404);
    }

    const slug = await generateUniqueSlug('blogPost', title);
    const postStatus = status || 'draft';
    const publishedAt = postStatus === 'published' ? new Date() : null;

    const post = await prisma.blogPost.create({
      data: {
        categoryId: parseInt(categoryId),
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        author: author || 'Admin',
        status: postStatus,
        publishedAt
      }
    });

    return success(res, 'Entrada de blog creada correctamente.', { post }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update blog post
 */
exports.updatePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const {
      categoryId,
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      author,
      status
    } = req.body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Entrada de blog no encontrada.', {}, 404);
    }

    const updateData = {};
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (author !== undefined) updateData.author = author;

    if (categoryId !== undefined) {
      const category = await prisma.blogCategory.findUnique({
        where: { id: parseInt(categoryId) }
      });
      if (!category) {
        return error(res, 'La categoría seleccionada no existe.', {}, 404);
      }
      updateData.categoryId = parseInt(categoryId);
    }

    if (status !== undefined && status !== existing.status) {
      updateData.status = status;
      if (status === 'published') {
        updateData.publishedAt = existing.publishedAt || new Date();
      } else {
        updateData.publishedAt = null;
      }
    }

    if (title !== undefined && title !== existing.title) {
      updateData.title = title;
      if (!slug) {
        updateData.slug = await generateUniqueSlug('blogPost', title, id);
      }
    }

    if (slug !== undefined && slug !== existing.slug) {
      updateData.slug = await generateUniqueSlug('blogPost', slug, id);
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Entrada de blog actualizada correctamente.', { post: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete blog post
 */
exports.deletePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Entrada de blog no encontrada.', {}, 404);
    }

    await prisma.blogPost.delete({ where: { id } });
    return success(res, 'Entrada de blog eliminada correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get active/published posts (pagination, filters: ?category= (slug/ID), ?search=, ?page=, ?limit=)
 */
exports.getPublicPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category;

    const skip = (page - 1) * limit;

    const whereClause = {
      status: 'published'
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      if (/^\d+$/.test(category)) {
        whereClause.categoryId = parseInt(category);
      } else {
        whereClause.category = {
          slug: category,
          active: true
        };
      }
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where: whereClause }),
      prisma.blogPost.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { category: true }
      })
    ]);

    return success(res, 'Entradas de blog obtenidas correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      posts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get published blog post by slug (increases view counter)
 */
exports.getPublicPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Check post exists and is published
    const postExists = await prisma.blogPost.findFirst({
      where: { slug, status: 'published' }
    });

    if (!postExists) {
      return error(res, 'Entrada de blog no encontrada o no publicada.', {}, 404);
    }

    // Increment views and return
    const post = await prisma.blogPost.update({
      where: { id: postExists.id },
      data: {
        views: { increment: 1 }
      },
      include: { category: true }
    });

    return success(res, 'Detalle de entrada de blog obtenido correctamente.', { post });
  } catch (err) {
    next(err);
  }
};

/**
 * Get active blog categories for public website
 */
exports.getPublicCategories = async (req, res, next) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
    return success(res, 'Categorías de blog obtenidas correctamente.', { categories });
  } catch (err) {
    next(err);
  }
};
