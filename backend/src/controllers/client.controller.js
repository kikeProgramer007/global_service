const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List clients for admin (pagination, search, active)
 */
exports.getClientsAdmin = async (req, res, next) => {
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
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    const [total, clients] = await Promise.all([
      prisma.client.count({ where: whereClause }),
      prisma.client.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' }
      })
    ]);

    return success(res, 'Clientes (Admin) obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      clients
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get client details by ID
 */
exports.getClientById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return error(res, 'Cliente no encontrado.', {}, 404);
    }

    return success(res, 'Cliente obtenido correctamente.', { client });
  } catch (err) {
    next(err);
  }
};

/**
 * Create client
 */
exports.createClient = async (req, res, next) => {
  try {
    const { name, logoUrl, websiteUrl, category, active, order } = req.body;

    if (!name) {
      return error(res, 'El nombre del cliente es obligatorio.', {}, 400);
    }

    const client = await prisma.client.create({
      data: {
        name,
        logoUrl,
        websiteUrl,
        category,
        active: active !== undefined ? active : true,
        order: order !== undefined ? parseInt(order) : 0
      }
    });

    return success(res, 'Cliente creado correctamente.', { client }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update client
 */
exports.updateClient = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, logoUrl, websiteUrl, category, active, order } = req.body;

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Cliente no encontrado.', {}, 404);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (category !== undefined) updateData.category = category;
    if (active !== undefined) updateData.active = active;
    if (order !== undefined) updateData.order = parseInt(order);

    const updated = await prisma.client.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Cliente actualizado correctamente.', { client: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete client
 */
exports.deleteClient = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Cliente no encontrado.', {}, 404);
    }

    await prisma.client.delete({ where: { id } });
    return success(res, 'Cliente eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get active clients for public website
 */
exports.getPublicClients = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    return success(res, 'Clientes obtenidos correctamente.', { clients });
  } catch (err) {
    next(err);
  }
};
