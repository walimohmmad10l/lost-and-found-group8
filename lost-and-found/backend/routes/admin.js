const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'lost', status: 'active' });
    const foundItems = await Item.countDocuments({ type: 'found', status: 'active' });
    const resolvedItems = await Item.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingVerification = await Item.countDocuments({ isVerified: false, status: 'active' });

    res.json({ totalItems, lostItems, foundItems, resolvedItems, totalUsers, pendingVerification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/items — get all items (including removed)
router.get('/items', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ items, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/items/:id/verify — verify an item
router.patch('/items/:id/verify', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate('reportedBy', 'name email');

    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/items/:id/status — change item status
router.patch('/items/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'resolved', 'removed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('reportedBy', 'name email');

    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/items/:id — permanently delete
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Item permanently deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users — list all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/create-admin — create admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists.' });

    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ message: 'Admin created.', id: admin._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
