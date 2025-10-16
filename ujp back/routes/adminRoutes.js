import express from 'express';
import User from '../models/User.js';
import Report from '../models/report.js';
import TemporaryEmployer from '../models/Temporary.js'; // ✅ Add missing import
import EmployerEmail from '../models/EmployerEmail.js';

const router = express.Router();

//
// 👤 EMPLOYEE ROUTES
//

// GET /api/admin/employees - Fetch all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
});

// DELETE /api/admin/employees/:id - Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id, role: 'employee' });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error while deleting employee' });
  }
});

//
// 🏢 EMPLOYER ROUTES
//

// GET /api/admin/employers - Fetch all employers
router.get('/employers', async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer' }).select('-password');
    res.json(employers);
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ message: 'Server error while fetching employers' });
  }
});

// DELETE /api/admin/employers/:id - Delete an employer
router.delete('/employers/:id', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id, role: 'employer' });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.json({ message: 'Employer deleted successfully' });
  } catch (error) {
    console.error('Error deleting employer:', error);
    res.status(500).json({ message: 'Server error while deleting employer' });
  }
});

// GET /api/admin/certificates/:id - Get employer certificate URL
router.get('/certificates/:id', async (req, res) => {
  try {
    const employer = await User.findOne({ _id: req.params.id, role: 'employer' });

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    if (!employer.certificateFilePath) {
      return res.status(404).json({ message: 'Certificate not found for this employer' });
    }

    res.json({ certificateUrl: employer.certificateFilePath });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ message: 'Server error while fetching certificate' });
  }
});

//
// 📝 TEMPORARY EMPLOYER APPROVAL ROUTES
//

// GET /api/admin/temporary-list - Get pending employers
router.get('/temporary-list', async (req, res) => {
  try {
    const employers = await TemporaryEmployer.find({ status: 'pending' });
    res.json(employers);
  } catch (err) {
    console.error('Error fetching temporary employers:', err);
    res.status(500).json({ message: 'Server error while fetching temporary employers' });
  }
});


router.post('/temporary-list/approve/:id', async (req, res) => {
  try {
    const tempEmployer = await TemporaryEmployer.findById(req.params.id);
    if (!tempEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    if (tempEmployer.email) {
      await EmployerEmail.deleteOne({ email: tempEmployer.email });
    }

    const { status, ...employerData } = tempEmployer.toObject();

    const newUser = new User({
      ...employerData,
      role: 'employer',
    });

    await newUser.save();

    // Delete the TemporaryEmployer after successful user creation
    await TemporaryEmployer.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employer approved, user created, and temporary record deleted successfully' });
  } catch (err) {
    console.error('Error approving employer and creating user:', err);
    res.status(500).json({ message: 'Server error while approving employer' });
  }
});

router.post('/temporary-list/reject/:id', async (req, res) => {
  try {
    const employer = await TemporaryEmployer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    
    if (employer.email) {
      await EmployerEmail.deleteOne({ email: employer.email });
    }

    
    await TemporaryEmployer.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employer and associated email deleted successfully' });
  } catch (err) {
    console.error('Error deleting employer and email:', err);
    res.status(500).json({ message: 'Server error while deleting employer and email' });
  }
});


//
// 📢 REPORT ROUTES
//

// GET /api/admin/reports - Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

// DELETE /api/admin/reports/:id - Delete a report
router.delete('/reports/:id', async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error while deleting report' });
  }
});

export default router;
