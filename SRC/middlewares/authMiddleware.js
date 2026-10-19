const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elnahar_secret_key');

      if (decoded.role !== 'admin') {
        res.status(403);
        throw new Error('غير مسموح لك بالوصول لشرائح الإدارة');
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('التوكن غير صالح أو منتهي الصلاحية');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('غير مصرح لك، يرجى تسجيل الدخول أولاً');
  }
};

module.exports = { protectAdmin };