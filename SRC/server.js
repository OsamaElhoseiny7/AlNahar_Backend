const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// المسارات الأساسية
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// مسار المصادقة الجديد (أدمن ومستخدمين)
app.use('/api/auth', require('./routes/authRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('Al-Nahar Factory API is running...');
});

// Error Handler Middleware
app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});