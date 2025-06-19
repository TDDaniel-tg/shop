const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      fabric,
      minPrice,
      maxPrice,
      sizes,
      colors,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build filter
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (fabric) filter.fabric = fabric;
    if (sizes) {
      filter['sizes.size'] = { $in: sizes.split(',') };
      filter['sizes.available'] = true;
    }
    if (colors) {
      filter['colors.name'] = { $in: colors.split(',') };
      filter['colors.available'] = true;
    }

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      'seo.slug': req.params.slug,
      status: 'active'
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new product (admin only)
router.post('/', adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['women', 'men', 'unisex']).withMessage('Invalid category'),
    body('fabric').isIn(['cotton', 'polyester', 'cotton-polyester', 'viscose', 'lycra', 'other']),
    body('fabricComposition').trim().notEmpty().withMessage('Fabric composition is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = new Product(req.body);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = [
      { value: 'women', label: 'Женские' },
      { value: 'men', label: 'Мужские' },
      { value: 'unisex', label: 'Унисекс' }
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get fabric types
router.get('/meta/fabrics', async (req, res) => {
  try {
    const fabrics = [
      { value: 'cotton', label: '100% хлопок' },
      { value: 'polyester', label: '100% полиэстер' },
      { value: 'cotton-polyester', label: 'Хлопок + полиэстер' },
      { value: 'viscose', label: 'Вискоза' },
      { value: 'lycra', label: 'С добавлением лайкры' },
      { value: 'other', label: 'Другое' }
    ];
    res.json(fabrics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 