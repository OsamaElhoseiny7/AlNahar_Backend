const Order = require('../models/Orders');

// @desc    البحث عن طلبية برقم التشغيلة (للـ Tracker في الواجهة)
// @route   GET /api/orders/track/:batchNumber
// @access  Public
const trackOrder = async (req, res, next) => {
  try {
    const { batchNumber } = req.params;
    const order = await Order.findOne({ batchNumber });

    if (!order) {
      res.status(404);
      throw new Error('رقم التشغيلة غير موجود، تأكد من الرقم المدخل');
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    إنشاء طلبية جديدة (من سلة المشتريات / حجز الماكينات)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const {
      batchNumber,
      clientName,
      specifications,
      colorOrDesign,
      deliveryDate,
      totalAmount,
      paymentMethod,
    } = req.body;

    // تجهيز المراحل الـ 6 الافتراضية
    const defaultStages = [
      { stageNumber: 1, stageName: 'استلام القماش الخام' },
      { stageNumber: 2, stageName: 'الفحص المبدئي والمعالجة' },
      { stageNumber: 3, stageName: 'مرحلة الصباغة أو الطباعة' },
      { stageNumber: 4, stageName: 'التجهيز والحرارة (الرمات)' },
      { stageNumber: 5, stageName: 'الفحص النهائي للجودة' },
      { stageNumber: 6, stageName: 'التعبئة والشحن' },
    ];

    const order = await Order.create({
      batchNumber,
      clientName,
      specifications,
      colorOrDesign,
      deliveryDate,
      totalAmount,
      paymentMethod,
      currentStage: 1,
      stagesStatus: defaultStages,
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلبية وتسجيلها بنجاح',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    تحديث مرحلة الطلبية (من لوحة تحكم الإدارة)
// @route   PUT /api/orders/:id/stage
// @access  Private
const updateOrderStage = async (req, res, next) => {
  try {
    const { currentStage } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('الطلبية غير موجودة');
    }

    order.currentStage = currentStage;
    
    // تحديث حالة المراحل بناءً على المرحلة الحالية
    order.stagesStatus = order.stagesStatus.map((stage) => {
      if (stage.stageNumber <= currentStage) {
        return { ...stage, isCompleted: true, completedAt: stage.completedAt || new Date() };
      }
      return { ...stage, isCompleted: false, completedAt: null };
    });

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث مرحلة الطلبية بنجاح',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  trackOrder,
  createOrder,
  updateOrderStage,
};