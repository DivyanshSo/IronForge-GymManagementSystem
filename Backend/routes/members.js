const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { protect, adminOnly } = require('../middleware/auth');

// ─────────────────────────────────────────────
//  GET /api/members
//  Admin: Get all members with filters & pagination
// ─────────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      plan,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status) query.membershipStatus = status;
    if (plan) query.membershipPlan = plan;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { memberId: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [members, total] = await Promise.all([
      Member.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .select('-__v'),
      Member.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: members,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────
//  GET /api/members/stats
//  Admin: Dashboard statistics
// ─────────────────────────────────────────────
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalMembers,
      activeMembers,
      pendingMembers,
      planBreakdown,
      goalBreakdown,
      recentRegistrations,
    ] = await Promise.all([
      Member.countDocuments({ role: 'member' }),
      Member.countDocuments({ membershipStatus: 'active' }),
      Member.countDocuments({ membershipStatus: 'pending' }),
      Member.aggregate([
        { $group: { _id: '$membershipPlan', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Member.aggregate([
        { $group: { _id: '$fitnessGoal', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Member.find({ role: 'member' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email membershipPlan membershipStatus createdAt memberId'),
    ]);

    // Monthly revenue estimate
    const planPrices = { Starter: 999, Elite: 1999, Pro: 3499 };
    const monthlyRevenue = planBreakdown.reduce((sum, p) => {
      return sum + (planPrices[p._id] || 0) * p.count;
    }, 0);

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        pendingMembers,
        monthlyRevenue,
        planBreakdown,
        goalBreakdown,
        recentRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────
//  GET /api/members/:id
//  Get a specific member (admin or self)
// ─────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Only allow admin or the member themselves
    if (req.member.role !== 'admin' && req.member._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/members/:id/status
//  Admin: Update membership status
// ─────────────────────────────────────────────
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { membershipStatus, membershipStartDate, membershipEndDate } = req.body;

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { membershipStatus, membershipStartDate, membershipEndDate },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    res.json({
      success: true,
      message: `Membership status updated to "${membershipStatus}"`,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/members/:id/plan
//  Member or Admin: Upgrade/downgrade plan
// ─────────────────────────────────────────────
router.put('/:id/plan', protect, async (req, res) => {
  try {
    if (req.member.role !== 'admin' && req.member._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { membershipPlan } = req.body;
    if (!['Starter', 'Elite', 'Pro'].includes(membershipPlan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan.' });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { membershipPlan },
      { new: true }
    );

    res.json({
      success: true,
      message: `Plan updated to ${membershipPlan}`,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────
//  DELETE /api/members/:id
//  Admin: Delete a member
// ─────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    res.json({ success: true, message: 'Member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
