import express from 'express';
import Performance from '../models/Performance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/performance
router.get('/', protect, async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {};
    if (req.user.role === 'employee') query.user = req.user._id;
    else if (userId) query.user = userId;
    const reviews = await Performance.find(query)
      .populate('user', 'name email employeeId designation')
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/performance
router.post('/', protect, authorize('admin', 'senior_manager', 'hr_recruiter'), async (req, res) => {
  try {
    const { ratings } = req.body;
    const overall = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;
    const review = await Performance.create({ ...req.body, reviewer: req.user._id, overallRating: overall.toFixed(1) });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/performance/:id
router.put('/:id', protect, authorize('admin', 'senior_manager', 'hr_recruiter'), async (req, res) => {
  try {
    const review = await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
