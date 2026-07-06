const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

exports.getTeamAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { roleEs: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, members] = await Promise.all([
      prisma.teamMember.count({ where: whereClause }),
      prisma.teamMember.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' }
      })
    ]);

    return success(res, 'Miembros del equipo obtenidos correctamente.', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      members
    });
  } catch (err) {
    next(err);
  }
};

exports.getTeamMemberById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) return error(res, 'Miembro no encontrado.', {}, 404);
    return success(res, 'Miembro obtenido correctamente.', { member });
  } catch (err) {
    next(err);
  }
};

exports.createTeamMember = async (req, res, next) => {
  try {
    const { name, roleEs, roleEn, bioEs, bioEn, imageUrl, active, order } = req.body;
    if (!name) return error(res, 'El nombre es obligatorio.', {}, 400);

    const member = await prisma.teamMember.create({
      data: {
        name,
        roleEs,
        roleEn,
        bioEs,
        bioEn,
        imageUrl,
        active: active !== undefined ? active : true,
        order: order !== undefined ? parseInt(order) : 0
      }
    });

    return success(res, 'Miembro creado correctamente.', { member }, 201);
  } catch (err) {
    next(err);
  }
};

exports.updateTeamMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, roleEs, roleEn, bioEs, bioEn, imageUrl, active, order } = req.body;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return error(res, 'Miembro no encontrado.', {}, 404);

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (roleEs !== undefined) updateData.roleEs = roleEs;
    if (roleEn !== undefined) updateData.roleEn = roleEn;
    if (bioEs !== undefined) updateData.bioEs = bioEs;
    if (bioEn !== undefined) updateData.bioEn = bioEn;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (active !== undefined) updateData.active = active;
    if (order !== undefined) updateData.order = parseInt(order);

    const member = await prisma.teamMember.update({ where: { id }, data: updateData });
    return success(res, 'Miembro actualizado correctamente.', { member });
  } catch (err) {
    next(err);
  }
};

exports.deleteTeamMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return error(res, 'Miembro no encontrado.', {}, 404);
    await prisma.teamMember.delete({ where: { id } });
    return success(res, 'Miembro eliminado correctamente.');
  } catch (err) {
    next(err);
  }
};

exports.getPublicTeam = async (req, res, next) => {
  try {
    const members = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    return success(res, 'Equipo obtenido correctamente.', { members });
  } catch (err) {
    next(err);
  }
};
