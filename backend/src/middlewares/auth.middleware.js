const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { error } = require('../utils/response');

/**
 * JWT Authentication Middleware
 */
module.exports = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return error(res, 'Acceso denegado. No se proporcionó un token de autenticación.', {}, 401);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'CAMBIA_ESTA_CLAVE_SEGURA');
    } catch (err) {
      return error(res, 'Token inválido o expirado.', {}, 401);
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return error(res, 'El usuario asociado a este token ya no existe.', {}, 401);
    }

    if (!user.active) {
      return error(res, 'El usuario se encuentra inactivo.', {}, 403);
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
