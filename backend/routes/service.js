const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Service = require('../models/Service');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('categoryId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch services', error: err.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('categoryId', 'name');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch service', error: err.message });
  }
});

// POST create service
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      name, categoryId, fasting, ageGroup, gender,
      vitalSystem, preventiveWellness, shortDescription,
      longDescription, keyBenefits, whatsMeasured, relatedSymptoms,
      assignedTo, duration, amount
    } = req.body;

    if (!name) return res.status(400).json({ success: false, message: 'Service name is required' });

    const sanitizedCategoryId = categoryId && categoryId !== '' ? categoryId : null;
    const sanitizedAmount = amount !== undefined && amount !== null && amount !== '' ? Number(amount) : 0;
    const sanitizedDuration = duration !== undefined && duration !== null && duration !== '' ? Number(duration) : 0;

    const newService = new Service({
      name,
      categoryId: sanitizedCategoryId,
      fasting,
      ageGroup,
      gender,
      vitalSystem,
      preventiveWellness,
      shortDescription,
      longDescription,
      keyBenefits,
      whatsMeasured,
      relatedSymptoms,
      assignedTo,
      duration: sanitizedDuration,
      amount: sanitizedAmount,
      image: req.file ? req.file.filename : '',
    });
    await newService.save();
    res.status(201).json({ success: true, service: newService });
  } catch (err) {
    console.error('Create service error:', err);
    res.status(500).json({ success: false, message: 'Failed to create service', error: err.message });
  }
});

// PUT update service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const {
      name, categoryId, fasting, ageGroup, gender,
      vitalSystem, preventiveWellness, shortDescription,
      longDescription, keyBenefits, whatsMeasured, relatedSymptoms,
      assignedTo, duration, amount
    } = req.body;

    const sanitizedCategoryId = categoryId && categoryId !== '' ? categoryId : null;
    const sanitizedAmount = amount !== undefined && amount !== null && amount !== '' ? Number(amount) : 0;
    const sanitizedDuration = duration !== undefined && duration !== null && duration !== '' ? Number(duration) : 0;

    const updateData = {
      name,
      categoryId: sanitizedCategoryId,
      fasting,
      ageGroup,
      gender,
      vitalSystem,
      preventiveWellness,
      shortDescription,
      longDescription,
      keyBenefits,
      whatsMeasured,
      relatedSymptoms,
      assignedTo,
      duration: sanitizedDuration,
      amount: sanitizedAmount,
    };
    if (req.file) updateData.image = req.file.filename;

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ success: false, message: 'Failed to update service', error: err.message });
  }
});

// PATCH toggle status
router.patch('/:id/status', async (req, res) => {
  try {
    const { active } = req.body;
    const service = await Service.findByIdAndUpdate(req.params.id, { active }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete service', error: err.message });
  }
});

module.exports = router;
