const Machine = require('../models/Machine');

// @desc    عرض كل الماكينات وأوقات الفراغ
// @route   GET /api/machines
// @access  Public
const getMachines = async (req, res, next) => {
  try {
    const machines = await Machine.find();
    res.status(200).json({ success: true, count: machines.length, data: machines });
  } catch (error) {
    next(error);
  }
};

// @desc    حجز وقت على ماكينة معينة
// @route   POST /api/machines/:id/book
// @access  Public
const bookMachineSlot = async (req, res, next) => {
  try {
    const { slotId, clientName } = req.body;
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      res.status(404);
      throw new Error('الماكينة غير موجودة');
    }

    const slot = machine.availableSlots.id(slotId);
    if (!slot) {
      res.status(404);
      throw new Error('الموعد غير متوفر');
    }

    if (slot.isBooked) {
      res.status(400);
      throw new Error('هذا الموعد محجوز بالفعل');
    }

    slot.isBooked = true;
    slot.bookedByClient = clientName;

    await machine.save();

    res.status(200).json({
      success: true,
      message: 'تم حجز الماكينة بنجاح',
      data: machine,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMachines,
  bookMachineSlot,
};