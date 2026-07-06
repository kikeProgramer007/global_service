const prisma = require('../config/prisma');
const { success } = require('../utils/response');

/**
 * Get CMS admin dashboard analytics & metrics
 */
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalPages,
      totalServices,
      totalProjects,
      totalBlogs,
      totalMessages,
      totalQuotes,
      recentMessages,
      recentBlogs
    ] = await Promise.all([
      prisma.page.count(),
      prisma.service.count(),
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.contactMessage.count(),
      prisma.quoteRequest.count(),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true }
          }
        }
      })
    ]);

    return success(res, 'Métricas del panel obtenidas correctamente.', {
      totalPages,
      totalServices,
      totalProjects,
      totalBlogs,
      totalMessages,
      totalQuotes,
      recentMessages,
      recentContent: recentBlogs
    });
  } catch (err) {
    next(err);
  }
};
