const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

/**
 * Get sections of a page
 */
exports.getSectionsByPage = async (req, res, next) => {
  try {
    const pageId = parseInt(req.params.pageId);

    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' }
    });

    return success(res, 'Secciones obtenidas correctamente.', { sections });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single section details
 */
exports.getSectionById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const section = await prisma.section.findUnique({
      where: { id }
    });

    if (!section) {
      return error(res, 'Sección no encontrada.', {}, 404);
    }

    return success(res, 'Sección obtenida correctamente.', { section });
  } catch (err) {
    next(err);
  }
};

/**
 * Create section
 */
exports.createSection = async (req, res, next) => {
  try {
    const { pageId, type, title, subtitle, content, imageUrl, buttonText, buttonUrl, order, active } = req.body;

    if (!pageId || !type) {
      return error(res, 'El ID de la página y el tipo de sección son obligatorios.', {}, 400);
    }

    const pageExists = await prisma.page.findUnique({
      where: { id: parseInt(pageId) }
    });

    if (!pageExists) {
      return error(res, 'La página asociada no existe.', {}, 404);
    }

    const newSection = await prisma.section.create({
      data: {
        pageId: parseInt(pageId),
        type,
        title,
        subtitle,
        content: content || {},
        imageUrl,
        buttonText,
        buttonUrl,
        order: order !== undefined ? parseInt(order) : 0,
        active: active !== undefined ? active : true
      }
    });

    return success(res, 'Sección creada correctamente.', { section: newSection }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update section
 */
exports.updateSection = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { type, title, subtitle, content, imageUrl, buttonText, buttonUrl, order, active } = req.body;

    const existing = await prisma.section.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Sección no encontrada.', {}, 404);
    }

    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (buttonUrl !== undefined) updateData.buttonUrl = buttonUrl;
    if (order !== undefined) updateData.order = parseInt(order);
    if (active !== undefined) updateData.active = active;

    const updated = await prisma.section.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Sección actualizada correctamente.', { section: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Update section order
 */
exports.updateSectionOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { order } = req.body;

    if (order === undefined) {
      return error(res, 'El valor de orden es obligatorio.', {}, 400);
    }

    const existing = await prisma.section.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Sección no encontrada.', {}, 404);
    }

    const updated = await prisma.section.update({
      where: { id },
      data: { order: parseInt(order) }
    });

    return success(res, 'Orden de sección actualizado correctamente.', { section: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete section
 */
exports.deleteSection = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.section.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Sección no encontrada.', {}, 404);
    }

    await prisma.section.delete({ where: { id } });

    return success(res, 'Sección eliminada correctamente.');
  } catch (err) {
    next(err);
  }
};
