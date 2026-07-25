const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    fasting: { type: String, enum: ['yes', 'no', ''], default: '' },
    ageGroup: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'both', ''], default: '' },
    vitalSystem: { type: String, default: '' },
    preventiveWellness: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    keyBenefits: { type: String, default: '' },
    whatsMeasured: { type: String, default: '' },
    relatedSymptoms: { type: String, default: '' },
    assignedTo: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
