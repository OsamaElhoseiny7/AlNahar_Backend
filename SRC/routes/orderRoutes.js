const express = require('express');
const router = express.Router();
const {
  trackOrder,
  createOrder,
  updateOrderStage,
} = require('../controllers/orderController');
const { protectAdmin } = require('../middlewares/authMiddleware'); // استيراد حماية الأدمن

router.route('/').post(createOrder);
router.route('/track/:batchNumber').get(trackOrder);

// تم إضافة protectAdmin هنا عشان يكون محمي بكلمة مرور وصلاحية الأدمن
router.route('/:id/stage').put(protectAdmin, updateOrderStage);

module.exports = router;