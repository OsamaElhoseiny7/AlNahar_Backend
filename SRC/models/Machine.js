const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم الماكينة مطلوب'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['dyeing', 'rotary_print', 'stenter_finishing', 'circular_knitting'],
      required: [true, 'نوع الماكينة مطلوب'],
    },
    capacity: {
      type: String, // مثال: "+40 طن/يوم" أو "70,000 متر/يوم"
      required: true,
    },
    manufacturingFeePerKgOrMeter: {
      type: Number,
      required: true,
    },
    availableSlots: [
      {
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true }, // مثال: "08:00 AM - 04:00 PM"
        isBooked: { type: Boolean, default: false },
        bookedByClient: { type: String, default: null },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Machine', machineSchema);