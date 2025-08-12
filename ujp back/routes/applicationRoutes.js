import express from 'express';
import Application from '../models/Application.js';
import Application2 from '../models/Application2.js';
import Job from '../models/Job.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route remains unchanged
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'employee') { return res.status(403).json({ message: 'Only employees can submit applications.' }); }
        const { jobId, jobTitle, companyName } = req.body;
        const employeeId = req.user._id;
        const employeeName = req.user.name;
        if (!jobId || !jobTitle || !companyName || !employeeId || !employeeName) { return res.status(400).json({ message: 'Missing required application fields.' }); }
        const applicationData = { jobId, employeeId, jobTitle, companyName, employeeName };
        const newApplication = new Application(applicationData);
        await newApplication.save();
        const newApplication2 = new Application2(applicationData);
        await newApplication2.save();
        res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });
    } catch (error) {
        if (error.code === 11000) { return res.status(409).json({ message: 'You have already applied for this job.' }); }
        res.status(500).json({ message: 'Server error while submitting application.' });
    }
});

// Specific routes must come BEFORE wildcard routes like /:id
router.get('/my-applications', protect, async (req, res) => {
    try {
        if (req.user.role !== 'employee') { return res.status(403).json({ message: 'Only employees can view their applications.' }); }
        const applications = await Application2.find({ employeeId: req.user._id }).populate('jobId', 'title companyName location');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching your applications.' });
    }
});

router.get('/all', protect, async (req, res) => {
    try {
        if (req.user.role !== 'employer') { return res.status(403).json({ message: 'Only employers can view applications.' }); }
        const employerJobs = await Job.find({ postedBy: req.user._id }).select('_id');
        const jobIds = employerJobs.map(job => job._id);
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('employeeId', 'name email education skills')
            .populate('jobId', 'title companyName location');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching all applications.' });
    }
});

router.put('/status', protect, async (req, res) => {
    try {
        if (req.user.role !== 'employer') { return res.status(403).json({ message: 'Only employers can update status.' }); }
        const { applicationId, status } = req.body;
        if (!applicationId || !status || !['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Application ID and a valid status are required.' });
        }
        const mainApplication = await Application.findById(applicationId).populate('jobId');
        if (!mainApplication) { return res.status(404).json({ message: 'Application not found.' }); }
        if (!mainApplication.jobId || mainApplication.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this application.' });
        }
        mainApplication.status = status;
        const secondaryApplication = await Application2.findOne({ jobId: mainApplication.jobId._id, employeeId: mainApplication.employeeId });
        if (secondaryApplication) {
            secondaryApplication.status = status;
            await secondaryApplication.save();
        }
        await mainApplication.save();
        res.status(200).json({ message: `Application has been ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating status.' });
    }
});

// Wildcard route /:id must be LAST
router.get('/:id', protect, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching application.' });
    }
});

// THIS IS THE FINAL, CORRECTED DELETE ROUTE
router.delete('/:id', protect, async (req, res) => {
    try {
        const applicationId = req.params.id;
        const user = req.user;

        let applicationToDelete;
        if (user.role === 'employer') {
            applicationToDelete = await Application.findById(applicationId);
        } else { // employee
            applicationToDelete = await Application2.findById(applicationId);
        }

        if (!applicationToDelete) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        // We need the job to check for employer ownership
        const parentJob = await Job.findById(applicationToDelete.jobId);

        const isEmployeeOwner = user.role === 'employee' && applicationToDelete.employeeId.toString() === user._id.toString();
        // The employer can only delete if the job still exists and belongs to them
        const isEmployerOwner = user.role === 'employer' && parentJob && parentJob.postedBy.toString() === user._id.toString();

        if (!isEmployeeOwner && !isEmployerOwner) {
            return res.status(403).json({ message: 'You are not authorized to delete this application.' });
        }

        // Use the information from the found application to delete from both collections
        await Application.deleteOne({ 
            jobId: applicationToDelete.jobId, 
            employeeId: applicationToDelete.employeeId 
        });
        await Application2.deleteOne({ 
            jobId: applicationToDelete.jobId, 
            employeeId: applicationToDelete.employeeId 
        });

        res.status(200).json({ message: 'Application successfully deleted from all records.' });

    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Server error while deleting application.' });
    }
});

export default router;