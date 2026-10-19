const Product = require('../models/Product');

// @desc    عرض جميع المنتجات والأقمشة
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
};