const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

/**
 * List users (Admin only, supports pagination and search)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const skip = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const sanitizedUsers = users.map((user) => {
      const u = { ...user };
      delete u.password;
      return u;
    });

    return success(res, 'Usuarios obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      users: sanitizedUsers
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return error(res, 'Usuario no encontrado.', {}, 404);
    }

    const sanitizedUser = { ...user };
    delete sanitizedUser.password;

    return success(res, 'Usuario obtenido correctamente.', { user: sanitizedUser });
  } catch (err) {
    next(err);
  }
};

/**
 * Create user
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, active, avatarUrl } = req.body;

    if (!name || !email || !password) {
      return error(res, 'Nombre, correo electrónico y contraseña son requeridos.', {}, 400);
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return error(res, 'El correo electrónico ya se encuentra registrado.', {}, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'EDITOR',
        active: active !== undefined ? active : true,
        avatarUrl: avatarUrl || ''
      }
    });

    const sanitizedUser = { ...newUser };
    delete sanitizedUser.password;

    return success(res, 'Usuario creado correctamente.', { user: sanitizedUser }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update user
 */
exports.updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password, role, active, avatarUrl } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return error(res, 'Usuario no encontrado.', {}, 404);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (active !== undefined) updateData.active = active;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (email !== undefined && email !== user.email) {
      const emailMatch = await prisma.user.findUnique({ where: { email } });
      if (emailMatch) {
        return error(res, 'El correo electrónico ya está registrado por otro usuario.', {}, 400);
      }
      updateData.email = email;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    const sanitizedUser = { ...updatedUser };
    delete sanitizedUser.password;

    return success(res, 'Usuario actualizado correctamente.', { user: sanitizedUser });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Prevent self-deletion
    if (req.user && req.user.id === id) {
      return error(res, 'No puedes eliminar tu propio usuario.', {}, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return error(res, 'Usuario no encontrado.', {}, 404);
    }

    await prisma.user.delete({ where: { id } });

    return success(res, 'Usuario eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};
