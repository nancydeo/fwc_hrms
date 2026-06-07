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
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalEmployees,
      totalDepartments,
      presentToday,
      onLeaveToday,
      openJobs,
      totalApplications,
      pendingLeaves,
      deptStats,
      attendanceTrend,
      roleDistribution
    ] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      Department.countDocuments({ status: 'active' }),
      Attendance.countDocuments({ date: today, status: { $in: ['present', 'late'] } }),
      Leave.countDocuments({ status: 'approved', startDate: { $lte: today }, endDate: { $gte: today } }),
      JobPosting.countDocuments({ status: 'open' }),
      Application.countDocuments(),
      Leave.countDocuments({ status: 'pending' }),
      User.aggregate([
        { $match: { status: 'active', department: { $exists: true } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
        { $unwind: '$dept' },
        { $project: { name: '$dept.name', count: 1 } }
      ]),
      Attendance.aggregate([
        { $match: { date: { $gte: sixMonthsAgo } } },
        { $group: { _id: { month: { $month: '$date' }, year: { $year: '$date' } }, present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ])
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
    const [recentLeaves, recentApps, recentJoins] = await Promise.all([
      Leave.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5),
      Application.find().populate('jobPosting', 'title').sort({ createdAt: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt')
    ]);
    res.json({ recentLeaves, recentApps, recentJoins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
