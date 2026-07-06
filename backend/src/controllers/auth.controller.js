const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

/**
 * User Login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'El correo electrónico y la contraseña son obligatorios.', {}, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return error(res, 'Credenciales incorrectas.', {}, 401);
    }

    if (!user.active) {
      return error(res, 'El usuario se encuentra inactivo. Comuníquese con el administrador.', {}, 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Credenciales incorrectas.', {}, 401);
    }

    // Sign JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'CAMBIA_ESTA_CLAVE_SEGURA',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Omit sensitive data
    const userRes = { ...user };
    delete userRes.password;

    return success(res, 'Inicio de sesión correcto.', {
      token,
      user: userRes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user details
 */
exports.getMe = async (req, res, next) => {
  try {
    const userRes = { ...req.user };
    delete userRes.password;

    return success(res, 'Datos de usuario obtenidos correctamente.', {
      user: userRes
    });
  } catch (err) {
    next(err);
  }
};
