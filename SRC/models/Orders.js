const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: [true, 'رقم التشغيلة مطلوب'],
      unique: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'اسم العميل مطلوب'],
    },
    specifications: {
      type: String,
      required: [true, 'المواصفات والكمية مطلوبة'],
    },
    colorOrDesign: {
      type: String,
      required: [true, 'اللون أو التصميم مطلوب'],
    },
    deliveryDate: {
      type: String,
      required: [true, 'موعد التسليم مطلوب'],
    },
    // المراحل الـ 6 لتتبع الطلبية داخل المصنع
    currentStage: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      default: 1, // المرحلة الأولى افتراضياً
    },
    stagesStatus: [
      {
        stageNumber: Number,
        stageName: String,
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['vodafone_cash', 'instapay', 'bank_card', 'factory_cash'],
      default: 'factory_cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);