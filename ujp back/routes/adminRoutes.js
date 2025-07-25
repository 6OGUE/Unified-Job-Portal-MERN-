import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// GET /api/admin/employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
});

// DELETE /api/admin/employees/:id  <-- new route to delete employee by id
router.delete('/employees/:id', async (req, res) => {
  const employeeId = req.params.id;
  try {
    const deletedUser = await User.findOneAndDelete({ _id: employeeId, role: 'employee' });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
});
router.delete('/employers/:id', async (req, res) => {
  const employerId = req.params.id;
  try {
    const deletedUser = await User.findOneAndDelete({ _id: employerId, role: 'employer' });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.json({ message: 'Employer deleted successfully' });
  } catch (error) {
    console.error('Error deleting employer:', error);
    res.status(500).json({ message: 'Server error deleting employer' });
  }
});

// GET /api/admin/employers
router.get('/employers', async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer' }).select('-password');
    res.json(employers);
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ message: 'Server error fetching employers' });
  }
});

export default router;
