const slugify = require('slugify');
const prisma = require('../config/prisma');

/**
 * Generates a unique slug for a given Prisma model
 * @param {string} modelName Name of the Prisma model (e.g., 'page', 'service', 'project', 'blogPost', 'serviceCategory', 'blogCategory')
 * @param {string} text The text to slugify
 * @param {number|null} excludeId Optional ID to exclude from the lookup (for updates)
 * @returns {Promise<string>} The unique slug
 */
async function generateUniqueSlug(modelName, text, excludeId = null) {
  if (!text) return '';

  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });

  let slug = baseSlug;
  let exists = true;
  let counter = 0;

  while (exists) {
    const whereClause = { slug };

    // If updating, exclude current record from check
    if (excludeId !== null) {
      whereClause.id = { not: excludeId };
    }

    const match = await prisma[modelName].findFirst({
      where: whereClause
    });

    if (!match) {
      exists = false;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
}

module.exports = {
  generateUniqueSlug
};
