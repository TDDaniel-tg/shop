const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Get dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Get statistics
    const [
      totalOrders,
      todayOrders,
      monthOrders,
      newOrders,
      totalProducts,
      activeProducts
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.countDocuments({ status: 'new' }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' })
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('products.product', 'name');

    // Get order types distribution
    const orderTypes = await Order.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statistics: {
        totalOrders,
        todayOrders,
        monthOrders,
        newOrders,
        totalProducts,
        activeProducts
      },
      recentOrders,
      orderTypes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    // Check if requesting user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new user (admin only)
router.post('/users', adminAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user (admin only)
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics data
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    // Orders by date
    const ordersByDate = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Orders by source
    const ordersBySource = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    // Popular products
    const popularProducts = await Order.aggregate([
      { $match: filter },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          count: { $sum: '$products.quantity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          count: 1
        }
      }
    ]);

    res.json({
      ordersByDate,
      ordersBySource,
      popularProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // In a real app, you'd store these in a database
    const settings = {
      companyName: 'RUBOLKA',
      email: process.env.ADMIN_EMAIL,
      phone: process.env.WHATSAPP_NUMBER,
      telegram: process.env.TELEGRAM_CHANNEL,
      minOrder: 50,
      deliveryInfo: 'Доставка по всей России',
      paymentInfo: 'Безналичный расчет, НДС включен'
    };
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 