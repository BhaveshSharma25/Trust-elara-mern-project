const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Category = require('../models/Category');

// --- Multer setup for image uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// GET /api/categories -> list all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: err.message });
  }
});

// GET /api/categories/:id -> get single category (used by Edit page)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch category', error: err.message });
  }
});

// POST /api/categories -> create a new category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const newCategory = new Category({
      name,
      description,
      image: req.file ? req.file.filename : '',
    });
    await newCategory.save();
    res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: err.message });
  }
});

// PUT /api/categories/:id -> update a category (used by Edit page)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: err.message });
  }
});

// PATCH /api/categories/:id/status -> toggle active status
router.patch('/:id/status', async (req, res) => {
  try {
    const { active } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

// DELETE /api/categories/:id -> delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: err.message });
  }
});

module.exports = router;
