import express from 'express';
import Job from '../models/Job.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/jobs - Create a new job (protected route)
router.post('/', protect, async (req, res) => {
  try {
    const { companyName, title, description, salary, location, qualification, additionalQualification } = req.body;

    if (!companyName || !title || !description || !salary || !location || !qualification) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newJob = new Job({
      companyName,
      title,
      description,
      salary,
      location,
      qualification,
      additionalQualification,
      postedBy: req.user.id || req.user._id
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('Job post error:', error);
    res.status(500).json({ message: 'Server error while posting job' });
  }
});

// GET /api/jobs/my-jobs - Get all jobs posted by the logged-in employer
router.get('/my-jobs', protect, async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;
    const jobs = await Job.find({ postedBy: employerId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Fetch my jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching your jobs' });
  }
});

// DELETE /api/jobs/:id - Delete a job by ID
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const employerId = req.user.id || req.user._id;
    if (job.postedBy.toString() !== employerId.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});

export default router;
