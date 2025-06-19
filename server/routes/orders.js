const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send notification email
const sendNotificationEmail = async (order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Новая заявка #${order.orderNumber}`,
    html: `
      <h2>Новая заявка на сайте RUBOLKA</h2>
      <p><strong>Номер заявки:</strong> ${order.orderNumber}</p>
      <p><strong>Тип:</strong> ${order.type}</p>
      <p><strong>Имя:</strong> ${order.customer.name}</p>
      <p><strong>Email:</strong> ${order.customer.email}</p>
      <p><strong>Телефон:</strong> ${order.customer.phone}</p>
      ${order.customer.company ? `<p><strong>Компания:</strong> ${order.customer.company}</p>` : ''}
      ${order.message ? `<p><strong>Сообщение:</strong> ${order.message}</p>` : ''}
      <p><strong>Дата:</strong> ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Create new order/request
router.post('/',
  [
    body('type').isIn(['price_request', 'samples', 'custom_order', 'catalog_request', 'quick_order']),
    body('customer.name').trim().notEmpty().withMessage('Name is required'),
    body('customer.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('customer.phone').trim().notEmpty().withMessage('Phone is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = new Order(req.body);
      await order.save();

      // Send notification email
      await sendNotificationEmail(order);

      res.status(201).json({
        message: 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
        orderNumber: order.orderNumber
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      status,
      type,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const orders = await Order.find(filter)
      .populate('products.product', 'name')
      .populate('assignedTo', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product')
      .populate('assignedTo', 'name email')
      .populate('notes.author', 'name');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', adminAuth,
  [
    body('status').isIn(['new', 'processing', 'completed', 'cancelled'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, updatedAt: Date.now() },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Add note to order (admin only)
router.post('/:id/notes', adminAuth,
  [
    body('text').trim().notEmpty().withMessage('Note text is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      order.notes.push({
        text: req.body.text,
        author: req.user._id
      });
      order.updatedAt = Date.now();
      await order.save();

      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Calculate price endpoint
router.post('/calculate-price',
  [
    body('productId').notEmpty(),
    body('quantity').isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId, quantity, customization } = req.body;

      // Price calculation logic
      // This is a simplified example - adjust based on your pricing model
      let basePrice = 500; // Base price per unit
      let customizationPrice = 0;

      if (customization) {
        if (customization.type === 'printing') customizationPrice = 50;
        if (customization.type === 'embroidery') customizationPrice = 100;
      }

      // Quantity discounts
      if (quantity >= 1000) basePrice *= 0.7;
      else if (quantity >= 500) basePrice *= 0.8;
      else if (quantity >= 100) basePrice *= 0.9;

      const totalPrice = (basePrice + customizationPrice) * quantity;

      res.json({
        basePrice,
        customizationPrice,
        totalPrice,
        pricePerUnit: basePrice + customizationPrice,
        currency: 'RUB'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router; 