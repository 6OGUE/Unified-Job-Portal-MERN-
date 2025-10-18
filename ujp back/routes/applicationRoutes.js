import express from 'express';
import Application from '../models/Application.js';
import Application2 from '../models/Application2.js';
import Job from '../models/Job.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();


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
        if (error.code === 11000) { return res.status(409).json({ message: 'You have already applied for this job and the application for this job already exists with the employer.' }); }
        res.status(500).json({ message: 'Server error while submitting application.' });
    }
});


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
/////////////////////////////////////////////////////////////////////////////////////////
router.put('/status', protect, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can update status.' });
        }

        const { applicationId, status } = req.body;

        if (!applicationId || !status || !['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Application ID and a valid status are required.' });
        }

        const mainApplication = await Application.findById(applicationId).populate('jobId');
        if (!mainApplication) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        if (
            !mainApplication.jobId ||
            mainApplication.jobId.postedBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'You are not authorized to update this application.' });
        }

        
        mainApplication.status = status;

        const secondaryApplication = await Application2.findOne({
            jobId: mainApplication.jobId._id,
            employeeId: mainApplication.employeeId,
        });

        if (secondaryApplication) {
            secondaryApplication.status = status;
            await secondaryApplication.save();
        }

        await mainApplication.save();

        
        const employee = await User.findById(mainApplication.employeeId);

        res.status(200).json({ message: `Application has been ${status.toLowerCase()}.` });

        // ✅ Send email to the employee (applicant)
        if (!employee || !employee.email) {
            console.warn('Employee not found or missing email.');
        } else {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: `"Unified Job Portal" <${process.env.EMAIL_USER}>`,
                    to: employee.email,
                    subject: 'Your Job Application Status Has Been Updated',
                    html: `
                        <h3>Hello ${employee.name || 'there'},</h3>
                        <p>Your application for <strong>${mainApplication.jobId.title}</strong> has been <strong>${status}</strong>.</p>
                        <p>Log in to your account on Unified Job Portal to view more details.</p>
                        <br>
                        <p>Best regards,<br>Unified Job Portal Team</p>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log("✅ Email sent to employee:", employee.email);
            } catch (emailErr) {
                console.error('❌ Failed to send email to employee:', emailErr.message || emailErr);
            }
        }

    } catch (error) {
        console.error("❌ Error updating application:", error.message);
        res.status(500).json({ message: 'Server error while updating status.' });
    }
});




/////////////////////////////////////////////////////////////////////////////////////////

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

        // NEW: Check if employer is trying to delete a Pending application
        if (user.role === 'employer' && applicationToDelete.status === 'Pending') {
            return res.status(400).json({ 
                message: 'Cannot delete application with Pending status. Please change the status first.' 
            });
        }

        // --- MODIFIED LOGIC HERE ---
        if (user.role === 'employer') {
            await Application.deleteOne({
                jobId: applicationToDelete.jobId,
                employeeId: applicationToDelete.employeeId
            });
        } else if (user.role === 'employee') {
            await Application2.deleteOne({
                jobId: applicationToDelete.jobId,
                employeeId: applicationToDelete.employeeId
            });
        }
        // --- END OF MODIFIED LOGIC ---

        res.status(200).json({ message: 'Application successfully deleted from all records.' });

    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Server error while deleting application.' });
    }
});

export default router;