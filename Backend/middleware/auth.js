const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

// ── Protect routes: require valid JWT ──
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Member.findById(decoded.id);

    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Token is no longer valid.',
      });
    }

    req.member = member;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// ── Restrict to admin only ──
exports.adminOnly = (req, res, next) => {
  if (req.member.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
    });
  }
  next();
};

// ── Generate JWT token ──
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
