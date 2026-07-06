const { error } = require('../utils/response');

/**
 * Global Error Handler Middleware
 */
module.exports = (err, req, res, next) => {
  console.error('--- Global Error Intercepted ---');
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Ha ocurrido un error inesperado en el servidor';

  // Include stack details only in development
  const errorDetails = {};
  if (process.env.NODE_ENV === 'development') {
    errorDetails.stack = err.stack;
    errorDetails.details = err;
  }

  // Handle specific Prisma database errors
  if (err.code) {
    errorDetails.prismaCode = err.code;
    if (err.code === 'P2002') {
      return error(res, 'Existe un registro duplicado con ese valor único.', errorDetails, 400);
    }
    if (err.code === 'P2025') {
      return error(res, 'El registro solicitado no existe.', errorDetails, 404);
    }
  }

  return error(res, message, errorDetails, statusCode);
};
