import express from 'express';
import Job from '../models/Job.js';
import { protect } from '../middleware/authMiddleware.js'; // Correct import for named export

const router = express.Router();

// POST /api/jobs - Create a new job (protected route)
router.post('/', protect, async (req, res) => {
  try {
    const { companyName, title, description, salary, location, qualification, additionalQualification } = req.body;

    // Basic validation to check required fields
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
      postedBy: req.user.id || req.user._id   // Try both, whichever is defined
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('Job post error:', error);  // You might want to keep this for debugging
    res.status(500).json({ message: 'Server error while posting job' });
  }
});

export default router;
