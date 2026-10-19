const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'اسم القماش مطلوب'],
      trim: true,
    },
    fabricType: {
      type: String,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    availableColors: [
      {
        colorName: String,
        hexCode: String,
        pantoneCode: String,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);