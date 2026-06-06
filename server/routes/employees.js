import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/employees - Get all employees
router.get('/', protect, async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const employees = await User.find(query)
      .populate('department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ employees, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/employees/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).populate('department');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', protect, authorize('admin', 'senior_manager', 'hr_recruiter'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const employee = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('department');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
