const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAdmin } = require('../middlewares/role.middleware');

// All user management routes require admin role
router.use(isAdmin);

router.route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
