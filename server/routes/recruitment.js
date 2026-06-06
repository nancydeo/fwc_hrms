import express from 'express';
import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// --- Job Postings ---

// GET /api/recruitment/jobs
router.get('/jobs', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const jobs = await JobPosting.find(query).populate('department', 'name').populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/recruitment/jobs
router.post('/jobs', protect, authorize('admin', 'hr_recruiter'), async (req, res) => {
  try {
    const job = await JobPosting.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/recruitment/jobs/:id
router.put('/jobs/:id', protect, authorize('admin', 'hr_recruiter'), async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Applications ---

// GET /api/recruitment/applications
router.get('/applications', protect, async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const query = {};
    if (jobId) query.jobPosting = jobId;
    if (status) query.status = status;
    const apps = await Application.find(query)
      .populate('jobPosting', 'title')
      .populate('reviewedBy', 'name')
      .sort({ aiScore: -1, createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/recruitment/applications
router.post('/applications', async (req, res) => {
  try {
    const app = await Application.create(req.body);
    await JobPosting.findByIdAndUpdate(req.body.jobPosting, { $inc: { applicationsCount: 1 } });
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/recruitment/applications/:id/status
router.put('/applications/:id/status', protect, authorize('admin', 'hr_recruiter'), async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, reviewedBy: req.user._id, notes: req.body.notes || '' },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
