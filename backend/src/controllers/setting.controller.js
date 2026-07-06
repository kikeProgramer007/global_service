const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * List all settings for admin
 */
exports.getSettingsAdmin = async (req, res, next) => {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' }
    });
    return success(res, 'Configuraciones obtenidas correctamente.', { settings });
  } catch (err) {
    next(err);
  }
};

/**
 * List settings by group (e.g. company, social, seo)
 */
exports.getSettingsByGroup = async (req, res, next) => {
  try {
    const { group } = req.params;
    const settings = await prisma.setting.findMany({
      where: { group },
      orderBy: { key: 'asc' }
    });
    return success(res, `Configuraciones del grupo '${group}' obtenidas correctamente.`, { settings });
  } catch (err) {
    next(err);
  }
};

/**
 * Update setting value by key
 */
exports.updateSettingByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return error(res, 'El valor de la configuración es obligatorio.', {}, 400);
    }

    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!setting) {
      return error(res, 'La configuración solicitada no existe.', {}, 404);
    }

    const updated = await prisma.setting.update({
      where: { key },
      data: { value } // Saved directly as JSON
    });

    return success(res, 'Configuración actualizada correctamente.', { setting: updated });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * List public settings as a simple key-value object map
 */
exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert to a dictionary for easier consumption by the frontend
    const configMap = {};
    settings.forEach((s) => {
      configMap[s.key] = s.value;
    });

    return success(res, 'Configuraciones públicas obtenidas correctamente.', { settings: configMap });
  } catch (err) {
    next(err);
  }
};
