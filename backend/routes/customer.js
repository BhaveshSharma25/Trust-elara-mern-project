const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET /api/customers -> list all customers (admin)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: err.message });
  }
});

// GET /api/customers/:id -> get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer', error: err.message });
  }
});

// POST /api/customers/register -> customer signup
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, phone, password: hashed });
    await customer.save();
    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

// POST /api/customers/login -> customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!customer.active)
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' });

    res.json({ success: true, message: 'Login successful', customerId: customer._id, name: customer.name });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

// PATCH /api/customers/:id/status -> toggle active/inactive
router.patch('/:id/status', async (req, res) => {
  try {
    const { active } = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, { active }, { new: true }).select('-password');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

// DELETE /api/customers/:id -> delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete customer', error: err.message });
  }
});

module.exports = router;
