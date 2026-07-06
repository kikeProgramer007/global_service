/**
 * Standardize API success responses
 * @param {object} res Express response object
 * @param {string} message Description of the operation result
 * @param {object|array} data Data payload
 * @param {number} statusCode HTTP status code (default: 200)
 */
const success = (res, message = 'Operación realizada correctamente', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    ok: true,
    message,
    data
  });
};

/**
 * Standardize API error responses
 * @param {object} res Express response object
 * @param {string} message Error description
 * @param {object} errorDetails Additional error context/details (default: empty object)
 * @param {number} statusCode HTTP status code (default: 500)
 */
const error = (res, message = 'Ha ocurrido un error en el servidor', errorDetails = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    ok: false,
    message,
    error: errorDetails
  });
};

module.exports = {
  success,
  error
};
