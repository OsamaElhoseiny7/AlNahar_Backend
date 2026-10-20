const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// استيراد كافة المسارات (Routes)
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const machineRoutes = require('./routes/machineRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات قبل كل طلب (مناسب لـ Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// جميع مسارات الـ API (API Endpoints)
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/products', productRoutes);

// Root Route للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send('API is running successfully on Vercel & Locally!');
});

// معالج الأخطاء لازم يكون بعد كل الـ routes
app.use(errorHandler);

// التشغيل المحلي (Development)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
  });
}

// تصدير الـ App لكي يعمل كـ Serverless Function على Vercel
module.exports = app;
