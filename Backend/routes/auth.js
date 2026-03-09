const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Member = require('../models/Member');
const { generateToken, protect } = require('../middleware/auth');
const { sendWelcomeEmail, sendAdminNotification } = require('../middleware/email');

// ── Validation rules ──
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('fitnessGoal').notEmpty().withMessage('Fitness goal is required'),
  body('membershipPlan')
    .isIn(['Starter', 'Elite', 'Pro'])
    .withMessage('Invalid membership plan'),
];

// ─────────────────────────────────────────────
//  POST /api/auth/register
//  Register a new gym member
// ─────────────────────────────────────────────
router.post('/register', registerValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const {
    firstName, lastName, email, password,
    phone, age, gender, fitnessGoal,
    membershipPlan, experienceLevel,
  } = req.body;

  try {
    // Check if email already exists
    const existing = await Member.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create member
    const member = await Member.create({
      firstName, lastName, email, password,
      phone, age, gender, fitnessGoal,
      membershipPlan, experienceLevel: experienceLevel || 'Beginner',
    });

    // Send emails (don't fail registration if email fails)
    try {
      await sendWelcomeEmail(member);
      await sendAdminNotification(member);
    } catch (emailErr) {
      console.warn('⚠️  Email sending failed:', emailErr.message);
    }

    const token = generateToken(member._id);

    res.status(201).json({
      success: true,
      message: `Welcome to IronForge, ${firstName}! Your membership application is pending activation.`,
      data: {
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        membershipPlan: member.membershipPlan,
        membershipStatus: member.membershipStatus,
        fitnessGoal: member.fitnessGoal,
        experienceLevel: member.experienceLevel,
        createdAt: member.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─────────────────────────────────────────────
//  POST /api/auth/login
//  Login an existing member
// ─────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const member = await Member.findOne({ email }).select('+password');
      if (!member || !(await member.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = generateToken(member._id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          memberId: member.memberId,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          role: member.role,
          membershipPlan: member.membershipPlan,
          membershipStatus: member.membershipStatus,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

// ─────────────────────────────────────────────
//  GET /api/auth/me
//  Get current logged-in member profile
// ─────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  const member = await Member.findById(req.member._id);
  res.json({ success: true, data: member });
});

module.exports = router;
