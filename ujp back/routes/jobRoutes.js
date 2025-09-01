import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Report from '../models/report.js'; // <-- Correct import for ES module
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

// DELETE /api/jobs/:id - Delete a job by ID
router.delete('/:id', protect, deleteJob);

// POST /api/jobs/report - Employee reports a job
router.post('/report', protect, async (req, res) => {
  try {
    const { companyName, jobTitle, description } = req.body;
    const employeeName = req.user.name; // Assuming req.user.name is set by authMiddleware

    if (!companyName || !jobTitle || !description || !employeeName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const report = new Report({
      companyName,
      jobTitle,
      employeeName,
      description
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit report.', error: error.message });
  }
});

export default router;