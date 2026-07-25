const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders -> list all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email phone')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: err.message });
  }
});

// GET /api/orders/customer/:customerId -> list orders for one customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId })
      .populate('customerId', 'name email phone')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer orders', error: err.message });
  }
});

// GET /api/orders/:id -> single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('serviceId', 'name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: err.message });
  }
});

// POST /api/orders -> create order (called from customer checkout)
router.post('/', async (req, res) => {
  try {
    const { customerId, serviceId, amount, notes, fullName, email, phone, address, city } = req.body;
    // allow amount = 0 — check for null/undefined instead of falsy
    if (!customerId || !serviceId || amount === undefined || amount === null) {
      const missing = [];
      if (!customerId) missing.push('customerId');
      if (!serviceId) missing.push('serviceId');
      if (amount === undefined || amount === null) missing.push('amount');
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    // Log minimal debug info when running locally
    if (process.env.NODE_ENV !== 'production') {
      console.log('Creating order:', { customerId, serviceId, amount });
    }

    const order = new Order({
      customerId,
      serviceId,
      amount,
      notes,
      fullName,
      email,
      phone,
      address,
      city,
    });
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message });
  }
});

// PATCH /api/orders/:id/status -> update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('customerId', 'name email')
      .populate('serviceId', 'name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: err.message });
  }
});

// DELETE /api/orders/:id -> delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete order', error: err.message });
  }
});

module.exports = router;
