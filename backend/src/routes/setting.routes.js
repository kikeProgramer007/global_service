const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');

router.get('/', settingController.getSettingsAdmin);
router.post('/upsert', settingController.upsertSetting);
router.get('/:group', settingController.getSettingsByGroup);
router.put('/:key', settingController.updateSettingByKey);

module.exports = router;
