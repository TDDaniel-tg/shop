const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['price_request', 'samples', 'custom_order', 'catalog_request', 'quick_order'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'processing', 'completed', 'cancelled'],
    default: 'new'
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    company: String,
    position: String
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    size: String,
    color: String,
    customization: {
      type: String,
      method: String,
      description: String
    }
  }],
  calculatedPrice: {
    basePrice: Number,
    customizationPrice: Number,
    totalPrice: Number,
    currency: {
      type: String,
      default: 'RUB'
    }
  },
  message: String,
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'telegram', 'phone', 'email'],
    default: 'website'
  },
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema); 