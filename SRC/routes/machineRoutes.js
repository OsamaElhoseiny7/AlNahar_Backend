const express = require('express');
const router = express.Router();
const { getMachines, bookMachineSlot } = require('../controllers/machineController');

router.route('/').get(getMachines);
router.route('/:id/book').post(bookMachineSlot);

module.exports = router;