import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['women', 'men', 'unisex']
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/assets/catalog/placeholder.svg'
  },
  colors: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    required: true
  }],
  material: {
    type: String,
    default: 'Хлопок 100%'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema) 