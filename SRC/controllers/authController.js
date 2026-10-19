const User = require('../models/User');
const jwt = require('jsonwebtoken');

// توليد توكن JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'elnahar_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    تسجيل حساب جديد للعملاء (User Register)
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }

    const user = await User.create({ name, email, password, role: 'user' });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    تسجيل دخول العملاء (User Login)
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      res.status(401);
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    تسجيل دخول بوابة إدارة المصنع (Admin Portal Login)
// @route   POST /api/auth/admin-login
const adminLogin = async (req, res, next) => {
  try {
    const { password } = req.body;

    // كلمة مرور الأدمن المحددة للمصنع (أو يتم جلبها من البيئة)
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'elnahar2026';

    if (password === ADMIN_PASS) {
      const adminToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'elnahar_secret_key', {
        expiresIn: '1d',
      });

      res.status(200).json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح لإدارة المصنع',
        token: adminToken,
      });
    } else {
      res.status(401);
      throw new Error('كلمة المرور غير صحيحة');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
};