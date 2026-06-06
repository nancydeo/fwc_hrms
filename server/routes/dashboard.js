import express from 'express';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';
import Performance from '../models/Performance.js';
import Payroll from '../models/Payroll.js';
import Department from '../models/Department.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const totalEmployees = await User.countDocuments({ status: 'active' });
    const totalDepartments = await Department.countDocuments({ status: 'active' });
    const presentToday = await Attendance.countDocuments({ date: today, status: { $in: ['present', 'late'] } });
    const onLeaveToday = await Leave.countDocuments({
      status: 'approved', startDate: { $lte: today }, endDate: { $gte: today }
    });
    const openJobs = await JobPosting.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    // Department-wise employee count
    const deptStats = await User.aggregate([
      { $match: { status: 'active', department: { $exists: true } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { name: '$dept.name', count: 1 } }
    ]);

    // Monthly attendance trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const attendanceTrend = await Attendance.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$date' }, year: { $year: '$date' } }, present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      totalEmployees, totalDepartments, presentToday, onLeaveToday,
      openJobs, totalApplications, pendingLeaves,
      deptStats, attendanceTrend, roleDistribution,
      attendanceRate: totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/dashboard/recent-activities
router.get('/recent-activities', protect, async (req, res) => {
  try {
    const recentLeaves = await Leave.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5);
    const recentApps = await Application.find().populate('jobPosting', 'title').sort({ createdAt: -1 }).limit(5);
    const recentJoins = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    res.json({ recentLeaves, recentApps, recentJoins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
