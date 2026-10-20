const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'غير مصرح لك، يرجى تسجيل الدخول أولاً' });
  }

  let decoded;
  try {
    const token = header.split(' ')[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'elnahar_secret_key');
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'التوكن غير صالح أو منتهي الصلاحية' });
  }

  if (decoded.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'غير مسموح لك بالوصول لشرائح الإدارة' });
  }

  req.user = decoded;
  next();
};

module.exports = { protectAdmin };
