import express from 'express';
import Application from '../models/Application.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Submit a new job application
// @route   POST /api/applications
// @access  Private (Employee only)
router.post('/', protect, async (req, res) => {
    try {
        // Ensure only employees can submit applications
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: 'Only employees can submit applications.' });
        }

        const { jobId, jobTitle, companyName } = req.body;

        const employeeId = req.user._id;
        const employeeName = req.user.name;

        // Basic validation for required fields
        if (!jobId || !jobTitle || !companyName || !employeeId || !employeeName) {
            return res.status(400).json({ message: 'Missing required application fields.' });
        }

        // Create a new application instance
        const newApplication = new Application({
            jobId,
            employeeId,
            jobTitle,
            companyName,
            employeeName,
        });

        // Save the application to the database
        await newApplication.save();

        res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });
    } catch (error) {
        // Handle duplicate application error (MongoDB unique index error code 11000)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already applied for this job.' });
        }
        // Generic server error
        res.status(500).json({ message: 'Server error while submitting application.' });
    }
});

// @desc    Get applications for the authenticated employee
// @route   GET /api/applications/my-applications
// @access  Private (Employee only)
router.get('/my-applications', protect, async (req, res) => {
    try {
        // Ensure only employees can view their applications
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: 'Only employees can view their applications.' });
        }
        const employeeId = req.user._id;
        // Find applications by employeeId and populate job details
        const applications = await Application.find({ employeeId }).populate('jobId', 'title companyName location');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching your applications.' });
    }
});

// @desc    Get applications for a specific job (for employers)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only, for their own jobs)
router.get('/job/:jobId', protect, async (req, res) => {
    try {
        // Ensure only employers can view applications for their jobs
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can view applications for their jobs.' });
        }
        const { jobId } = req.params;
        // In a real application, you would also verify that the job belongs to the authenticated employer.
        // For example:
        // const job = await Job.findById(jobId);
        // if (!job || job.postedBy.toString() !== req.user._id.toString()) {
        //   return res.status(403).json({ message: 'Not authorized to view applications for this job.' });
        // }

        // Find applications by jobId and populate employee details
        const applications = await Application.find({ jobId }).populate('employeeId', 'name email education skills');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching job applications.' });
    }
});

// @desc    Get all applications (for employers, as a whole)
// @route   GET /api/applications/all
// @access  Private (Employer only)
router.get('/all', protect, async (req, res) => {
    try {
        // Ensure only employers can view all applications
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can view all applications.' });
        }

        // Fetch all applications and populate both employee and job details
        const applications = await Application.find({})
            .populate('employeeId', 'name email education skills') // Populate employee details
            .populate('jobId', 'title companyName location'); // Populate job details

        res.status(200).json(applications);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error while fetching all applications.' });
    }
});

export default router;
