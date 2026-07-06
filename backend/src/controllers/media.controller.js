const path = require('path');
const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const deleteFile = require('../utils/deleteFile');

/**
 * List media files (Admin only, with pagination, search, and type filters)
 */
exports.getMediaFiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const type = req.query.type; // image, document, video

    const skip = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      whereClause.type = type;
    }

    const [total, mediaFiles] = await Promise.all([
      prisma.mediaFile.count({ where: whereClause }),
      prisma.mediaFile.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return success(res, 'Archivos multimedia obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      mediaFiles
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle Single File Upload
 */
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'No se proporcionó ningún archivo para subir.', {}, 400);
    }

    const appUrl = process.env.APP_URL || 'http://localhost:4000';
    
    // Normalize path to relative, Unix style (e.g. 'uploads/images/file.jpg')
    const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
    const fileUrl = `${appUrl}/${relativePath}`;

    // Insert into database
    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: relativePath,
        url: fileUrl,
        type: req.file.categoryType
      }
    });

    return res.status(201).json({
      ok: true,
      message: 'Archivo subido correctamente.',
      data: {
        id: mediaFile.id,
        filename: mediaFile.filename,
        originalName: mediaFile.originalName,
        mimeType: mediaFile.mimeType,
        size: mediaFile.size,
        url: mediaFile.url,
        path: mediaFile.path,
        type: mediaFile.type,
        createdAt: mediaFile.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a media file registry (removes DB record and unlinks physical file)
 */
exports.deleteMediaFile = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id }
    });

    if (!mediaFile) {
      return error(res, 'Archivo no encontrado.', {}, 404);
    }

    // 1. Delete registry from DB
    await prisma.mediaFile.delete({ where: { id } });

    // 2. Physically remove the file from storage
    deleteFile(mediaFile.path);

    return success(res, 'Archivo eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};
