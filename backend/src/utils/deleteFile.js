const fs = require('fs');
const path = require('path');

/**
 * Delete a file from local storage
 * @param {string} filePath Relative or absolute path to the file
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`File deleted: ${absolutePath}`);
    } else {
      console.warn(`File not found, could not delete: ${absolutePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete file at ${filePath}:`, err);
  }
};

module.exports = deleteFile;
