const { error } = require('../utils/response');

/**
 * Middleware to restrict access to ADMIN only
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return error(res, 'No autenticado.', {}, 401);
  }

  if (req.user.role !== 'ADMIN') {
    return error(res, 'Acceso denegado. Se requieren privilegios de administrador.', {}, 403);
  }

  next();
};

/**
 * Middleware to restrict access based on roles array
 * @param {string[]} roles Array of allowed roles
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'No autenticado.', {}, 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Acceso denegado. Rol no autorizado.', {}, 403);
    }

    next();
  };
};

module.exports = {
  isAdmin,
  checkRole
};
