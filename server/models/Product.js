const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['women', 'men', 'unisex']
  },
  fabric: {
    type: String,
    required: true,
    enum: ['cotton', 'polyester', 'cotton-polyester', 'viscose', 'lycra', 'other']
  },
  fabricComposition: {
    type: String,
    required: true
  },
  sizes: [{
    size: String,
    available: Boolean
  }],
  colors: [{
    name: String,
    hex: String,
    available: Boolean
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  videos: [{
    url: String,
    thumbnail: String,
    description: String
  }],
  minOrder: {
    type: Number,
    default: 50
  },
  features: [String],
  customizationOptions: {
    printing: {
      available: Boolean,
      methods: [String]
    },
    embroidery: {
      available: Boolean,
      positions: [String]
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from name
productSchema.pre('save', function(next) {
  if (!this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema); 