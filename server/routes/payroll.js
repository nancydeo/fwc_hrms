import express from 'express';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/payroll - Get payroll records
router.get('/', protect, async (req, res) => {
  try {
    const { month, year, userId } = req.query;
    const query = {};
    if (req.user.role === 'employee') query.user = req.user._id;
    else if (userId) query.user = userId;
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);
    const records = await Payroll.find(query).populate('user', 'name email employeeId department designation').sort({ year: -1, month: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/payroll/generate - Generate payroll for a month
router.post('/generate', protect, authorize('admin', 'hr_recruiter'), async (req, res) => {
  try {
    const { month, year } = req.body;
    const employees = await User.find({ status: 'active', salary: { $gt: 0 } });
    const payrolls = [];
    for (const emp of employees) {
      const exists = await Payroll.findOne({ user: emp._id, month, year });
      if (exists) continue;
      const basic = Math.round(emp.salary * 0.5);
      const hra = Math.round(emp.salary * 0.2);
      const allowances = Math.round(emp.salary * 0.15);
      const tax = Math.round(emp.salary * 0.1);
      const deductions = Math.round(emp.salary * 0.05);
      const net = emp.salary - tax - deductions;
      const payroll = await Payroll.create({
        user: emp._id, month, year, basicSalary: basic, hra, allowances, deductions, tax, netSalary: net,
      });
      payrolls.push(payroll);
    }
    res.status(201).json({ message: `Generated ${payrolls.length} payroll records`, payrolls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/payroll/:id/pay
router.put('/:id/pay', protect, authorize('admin'), async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, { status: 'paid', paidDate: new Date() }, { new: true });
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
