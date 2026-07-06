const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Submit contact message
 */
exports.submitContactMessage = async (req, res, next) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !email || !message) {
      return error(res, 'El nombre, correo electrónico y mensaje son obligatorios.', {}, 400);
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        email,
        service,
        message,
        status: 'new'
      }
    });

    return success(res, 'Mensaje de contacto enviado correctamente.', { message: newMessage }, 201);
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List contact messages for admin
 */
exports.getMessagesAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // new, read, contacted, closed

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const [total, messages] = await Promise.all([
      prisma.contactMessage.count({ where: whereClause }),
      prisma.contactMessage.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return success(res, 'Mensajes de contacto obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      messages
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get contact message details
 */
exports.getMessageById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!contactMessage) {
      return error(res, 'Mensaje no encontrado.', {}, 404);
    }

    // Auto update status to 'read' if it was 'new' when fetched
    if (contactMessage.status === 'new') {
      const updated = await prisma.contactMessage.update({
        where: { id },
        data: { status: 'read' }
      });
      return success(res, 'Mensaje obtenido y marcado como leído.', { message: updated });
    }

    return success(res, 'Mensaje obtenido correctamente.', { message: contactMessage });
  } catch (err) {
    next(err);
  }
};

/**
 * Update message status (new, read, contacted, closed)
 */
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return error(res, 'El nuevo estado es obligatorio.', {}, 400);
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Mensaje no encontrado.', {}, 404);
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });

    return success(res, 'Estado del mensaje actualizado correctamente.', { message: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete message
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Mensaje no encontrado.', {}, 404);
    }

    await prisma.contactMessage.delete({ where: { id } });
    return success(res, 'Mensaje eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};
