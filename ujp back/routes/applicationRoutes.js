import express from 'express';
import Application from '../models/Application.js'; // Main application table (for employers)
import Application2 from '../models/Application2.js'; // Employee's application history table
import Job from '../models/Job.js'; // Required for employer authorization checks (e.g., when posting jobs)
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

        // Prepare the application data
        const applicationData = {
            jobId,
            employeeId,
            jobTitle,
            companyName,
            employeeName,
        };

        // --- Insert into BOTH Application and Application2 ---
        // Create and save a new application instance to the 'applications' table (for employers to view)
        const newApplication = new Application(applicationData);
        await newApplication.save();

        // Create and save the same application data to the 'application2' table (for employee history)
        const newApplication2 = new Application2(applicationData);
        await newApplication2.save();
        // --- End Dual Insert ---

        res.status(201).json({
            message: 'Application submitted successfully to both tables!',
            application: newApplication,
            application2: newApplication2 // Optionally return the second application as well
        });

    } catch (error) {
        // Handle duplicate application error (MongoDB unique index error code 11000)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already applied for this job.' });
        }
        // Generic server error
        console.error('Error submitting application to one or both tables:', error);
        res.status(500).json({ message: 'Server error while submitting application.' });
    }
});

// @desc    Get applications for the authenticated employee (from Application2)
// @route   GET /api/applications/my-applications
// @access  Private (Employee only)
router.get('/my-applications', protect, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: 'Only employees can view their applications.' });
        }
        const employeeId = req.user._id;
        // Employees view their applications from Application2
        const applications = await Application2.find({ employeeId }).populate('jobId', 'title companyName location');
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching employee applications from Application2:', error);
        res.status(500).json({ message: 'Server error while fetching your applications.' });
    }
});

// @desc    Get all applications (for employers, from Application)
// @route   GET /api/applications/all
// @access  Private (Employer only)
router.get('/all', protect, async (req, res) => {
    try {
        // Ensure only employers can view all applications
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can view all applications.' });
        }

        // Employers view all applications from the main Application table
        const applications = await Application.find({}) // Corrected to fetch from Application
            .populate('employeeId', 'name email education skills')
            .populate('jobId', 'title companyName location');

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching all applications:', error);
        res.status(500).json({ message: 'Server error while fetching all applications.' });
    }
});

// @desc    Get applications for a specific job (for employers, from Application)
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
        // const job = await Job.findById(jobId);
        // if (!job || job.postedBy.toString() !== req.user._id.toString()) {
        //   return res.status(403).json({ message: 'Not authorized to view applications for this job.' });
        // }

        // Employers view job-specific applications from the main Application table
        const applications = await Application.find({ jobId }).populate('employeeId', 'name email education skills');
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching job-specific applications:', error);
        res.status(500).json({ message: 'Server error while fetching job applications.' });
    }
});


// @desc    Delete an application by ID (Role-based deletion)
// @route   DELETE /api/applications/:id
// @access  Private (Employee for their own from Application2, Employer for their job's from Application)
router.delete('/:id', protect, async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.user._id; // The ID of the logged-in user (employee or employer)
        const userRole = req.user.role; // The role of the logged-in user

        if (userRole === 'employee') {
            // Employee wants to delete their own application from Application2 table
            const application = await Application2.findOneAndDelete({ _id: applicationId, employeeId: userId });

            if (!application) {
                return res.status(404).json({ message: 'Application not found in your history or you are not authorized to delete it.' });
            }
            res.status(200).json({ message: 'Application deleted successfully from your history.' });

        } else if (userRole === 'employer') {
            // Employer wants to delete an application from the main Application table
            // IMPORTANT SECURITY NOTE: This assumes the frontend only sends application IDs
            // for jobs that the authenticated employer has posted. For robust security,
            // you should re-implement the check to ensure the employer owns the job
            // associated with this application.
            // Example:
            // const applicationToDelete = await Application.findById(applicationId).populate('jobId');
            // if (!applicationToDelete || !applicationToDelete.jobId || applicationToDelete.jobId.postedBy.toString() !== userId.toString()) {
            //     return res.status(403).json({ message: 'Not authorized to delete this application.' });
            // }

            const deletedApplication = await Application.findByIdAndDelete(applicationId);

            if (!deletedApplication) {
                return res.status(404).json({ message: 'Application not found in the main list.' });
            }
            res.status(200).json({ message: 'Application deleted successfully from the main applications list.' });

        } else {
            // Handle other roles or unauthorized access
            return res.status(403).json({ message: 'You are not authorized to perform this action.' });
        }

    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Server error while deleting application.' });
    }
});

export default router;
