const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/items — get all active items with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'active' };

    if (type && ['lost', 'found'].includes(type)) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ items, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/items/:id — get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email phone');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/items — create new item (protected)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, category, location, date, contactEmail, contactPhone } = req.body;

    if (!type || !title || !description || !category || !location || !date) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      date,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      reportedBy: req.user._id,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone
    });

    await item.populate('reportedBy', 'name email phone');
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/items/:id — update item (owner only)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (item.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item.' });
    }

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updated = await Item.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('reportedBy', 'name email phone');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/items/:id — delete item (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (item.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/items/user/my-items — get logged-in user's items
router.get('/user/my-items', protect, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
