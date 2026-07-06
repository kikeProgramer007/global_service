const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');

router.get('/', teamController.getTeamAdmin);
router.post('/', teamController.createTeamMember);
router.get('/:id', teamController.getTeamMemberById);
router.put('/:id', teamController.updateTeamMember);
router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;
