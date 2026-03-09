const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/contact — Submit a contact form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const contact = await Contact.create(req.body);
      res.status(201).json({
        success: true,
        message: "Thanks for reaching out! We'll get back to you within 24 hours.",
        data: { id: contact._id },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

// GET /api/contact — Admin: get all inquiries
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
