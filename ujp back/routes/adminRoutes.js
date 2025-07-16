import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// GET /api/admin/employees - fetch all users with role 'employee'
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password'); // exclude password
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
});

export default router;
