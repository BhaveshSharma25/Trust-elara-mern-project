const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect('mongodb://127.0.0.1:27017/authdb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const loginRoutes = require('./routes/login');
app.use('/api', loginRoutes);

const categoryRoutes = require('./routes/category');
app.use('/api/categories', categoryRoutes);

const serviceRoutes = require('./routes/service');
app.use('/api/services', serviceRoutes);

const customerRoutes = require('./routes/customer');
app.use('/api/customers', customerRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
