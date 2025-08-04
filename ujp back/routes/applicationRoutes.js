import express from 'express';
import Application from '../models/Application.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Only employees can submit applications.' });
    }

    const { jobId, jobTitle, companyName } = req.body;

    const employeeId = req.user._id;
    const employeeName = req.user.name;

    if (!jobId || !jobTitle || !companyName || !employeeId || !employeeName) {
      return res.status(400).json({ message: 'Missing required application fields.' });
    }

    const newApplication = new Application({
      jobId,
      employeeId,
      jobTitle,
      companyName,
      employeeName,
    });

    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });
  } catch (error) {
    if (error.message === 'You have already applied for this job.') {
      return res.status(409).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied for this job.' });
    }

    res.status(500).json({ message: 'Server error while submitting application.' });
  }
});

router.get('/my-applications', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Only employees can view their applications.' });
    }
    const employeeId = req.user._id;
    const applications = await Application.find({ employeeId }).populate('jobId', 'title companyName location');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching your applications.' });
  }
});

router.get('/job/:jobId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view applications for their jobs.' });
    }
    const { jobId } = req.params;
    // const job = await Job.findById(jobId);
    // if (!job || job.postedBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to view applications for this job.' });
    // }

    const applications = await Application.find({ jobId }).populate('employeeId', 'name email education skills');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching job applications.' });
  }
});

export default router;
