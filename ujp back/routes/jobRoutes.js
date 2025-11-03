import express from 'express';
import Job from '../models/Job.js';
import { protect } from '../middleware/authMiddleware.js';
import Report from '../models/report.js';
import mongoose from 'mongoose';
import { 
  postJob, 
  getFilteredJobs, 
  getAllJobs, 
  getEmployerJobs, 
  deleteJob 
} from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs - Create a new job (protected route for employers)
router.post('/', protect, postJob);


// GET /api/jobs - Get filtered jobs for employees based on their education level
// or get all jobs for employers/admins
router.get('/', protect, (req, res) => {
  if (req.user.role === 'employee') {
    return getFilteredJobs(req, res);
  } else {
    return getAllJobs(req, res);
  }
});

// GET /api/jobs/my-jobs - Get all jobs posted by the logged-in employer
router.get('/my-jobs', protect, getEmployerJobs);


router.get('/count', async (req, res) => {
  try {
    const count = await Job.countDocuments(); // count all jobs
    res.json({ count });
  } catch (error) {
    console.error('Error fetching job count:', error);
    res.status(500).json({ message: 'Server error fetching job count' });
  }
});

// GET /api/jobs/:id - Get a job by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const jobId = req.params.id;
    // Normalize the incoming id and validate it. We avoid noisy debug logs here.
    const sanitizedJobId = String(jobId).replace(/[^0-9a-fA-F]/g, '');

    if (!mongoose.Types.ObjectId.isValid(sanitizedJobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const job = await Job.findById(sanitizedJobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: "Server error while fetching job details" });
  }
});

// DELETE /api/jobs/:id - Delete a job by ID
router.delete('/:id', protect, deleteJob);

// POST /api/jobs/report - Employee reports a job
router.post('/report', protect, async (req, res) => {
  try {
    const { companyName, jobTitle, description, jobId } = req.body;
    const employeeName = req.user.name; // Assuming req.user.name is set by authMiddleware

    if (!companyName || !jobTitle || !description || !employeeName || !jobId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const report = new Report({
      companyName,
      jobTitle,
      employeeName,
      description,
      jobId
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit report.', error: error.message });
  }
});

export default router;