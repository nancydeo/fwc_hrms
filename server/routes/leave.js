import express from 'express';
import Leave from '../models/Leave.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /api/leave - Apply for leave
router.post('/', protect, async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const leave = await Leave.create({ user: req.user._id, type, startDate: start, endDate: end, days, reason });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/leave - Get leaves
router.get('/', protect, async (req, res) => {
  try {
    const { status, userId } = req.query;
    const query = {};
    if (req.user.role === 'employee') {
      query.user = req.user._id;
    } else if (userId) {
      query.user = userId;
    }
    if (status) query.status = status;
    const leaves = await Leave.find(query)
      .populate('user', 'name email employeeId department')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/leave/:id/approve
router.put('/:id/approve', protect, authorize('admin', 'senior_manager', 'hr_recruiter'), async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user._id, comments: req.body.comments || '' },
      { new: true }
    ).populate('user', 'name email');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/leave/:id/reject
router.put('/:id/reject', protect, authorize('admin', 'senior_manager', 'hr_recruiter'), async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', approvedBy: req.user._id, comments: req.body.comments || '' },
      { new: true }
    ).populate('user', 'name email');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/leave/balance
router.get('/balance', protect, async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    const approved = await Leave.find({
      user: req.user._id, status: 'approved',
      startDate: { $gte: startOfYear, $lte: endOfYear }
    });
    const used = { sick: 0, casual: 0, earned: 0 };
    approved.forEach(l => { if (used[l.type] !== undefined) used[l.type] += l.days; });
    res.json({
      sick: { total: 12, used: used.sick, remaining: 12 - used.sick },
      casual: { total: 12, used: used.casual, remaining: 12 - used.casual },
      earned: { total: 15, used: used.earned, remaining: 15 - used.earned },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
