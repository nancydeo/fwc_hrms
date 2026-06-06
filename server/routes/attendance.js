import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /api/attendance/check-in
router.post('/check-in', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let record = await Attendance.findOne({ user: req.user._id, date: today });
    if (record && record.checkIn) return res.status(400).json({ message: 'Already checked in today' });
    if (!record) {
      record = new Attendance({ user: req.user._id, date: today, checkIn: new Date(), status: 'present' });
    } else {
      record.checkIn = new Date();
      record.status = 'present';
    }
    const hour = new Date().getHours();
    if (hour >= 10) record.status = 'late';
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/attendance/check-out
router.post('/check-out', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const record = await Attendance.findOne({ user: req.user._id, date: today });
    if (!record || !record.checkIn) return res.status(400).json({ message: 'You haven\'t checked in today' });
    if (record.checkOut) return res.status(400).json({ message: 'Already checked out today' });
    record.checkOut = new Date();
    record.workHours = ((record.checkOut - record.checkIn) / (1000 * 60 * 60)).toFixed(2);
    if (record.workHours < 4) record.status = 'half_day';
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/attendance - Get attendance records
router.get('/', protect, async (req, res) => {
  try {
    const { userId, month, year, page = 1, limit = 31 } = req.query;
    const query = {};
    if (req.user.role === 'employee') {
      query.user = req.user._id;
    } else if (userId) {
      query.user = userId;
    }
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }
    const records = await Attendance.find(query)
      .populate('user', 'name email employeeId department')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Attendance.countDocuments(query);
    res.json({ records, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/attendance/today
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const record = await Attendance.findOne({ user: req.user._id, date: today });
    res.json(record || { checkedIn: false, checkedOut: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
