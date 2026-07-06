const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Submit a quote request
 */
exports.submitQuoteRequest = async (req, res, next) => {
  try {
    const { name, phone, email, company, serviceType, budget, description, attachmentUrl } = req.body;

    if (!name || !email || !description) {
      return error(res, 'El nombre, correo electrónico y descripción del requerimiento son obligatorios.', {}, 400);
    }

    const newQuote = await prisma.quoteRequest.create({
      data: {
        name,
        phone,
        email,
        company,
        serviceType,
        budget,
        description,
        attachmentUrl,
        status: 'new'
      }
    });

    return success(res, 'Solicitud de cotización enviada correctamente.', { quote: newQuote }, 201);
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List quote requests for admin
 */
exports.getQuotesAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // new, reviewed, contacted, closed

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const [total, quotes] = await Promise.all([
      prisma.quoteRequest.count({ where: whereClause }),
      prisma.quoteRequest.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return success(res, 'Solicitudes de cotización obtenidas correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      quotes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get quote request by ID
 */
exports.getQuoteById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const quote = await prisma.quoteRequest.findUnique({
      where: { id }
    });

    if (!quote) {
      return error(res, 'Solicitud de cotización no encontrada.', {}, 404);
    }

    // Auto mark as 'reviewed' if it was 'new' when viewed
    if (quote.status === 'new') {
      const updated = await prisma.quoteRequest.update({
        where: { id },
        data: { status: 'reviewed' }
      });
      return success(res, 'Solicitud de cotización obtenida y marcada como revisada.', { quote: updated });
    }

    return success(res, 'Solicitud de cotización obtenida correctamente.', { quote });
  } catch (err) {
    next(err);
  }
};

/**
 * Update quote status (new, reviewed, contacted, closed)
 */
exports.updateQuoteStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return error(res, 'El nuevo estado es obligatorio.', {}, 400);
    }

    const existing = await prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Solicitud de cotización no encontrada.', {}, 404);
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status }
    });

    return success(res, 'Estado de la cotización actualizado correctamente.', { quote: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete quote request
 */
exports.deleteQuote = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Solicitud de cotización no encontrada.', {}, 404);
    }

    await prisma.quoteRequest.delete({ where: { id } });
    return success(res, 'Solicitud de cotización eliminada correctamente.');
  } catch (err) {
    next(err);
  }
};
