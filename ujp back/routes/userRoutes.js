import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import upload from '../middleware/upload.js';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post(
  '/register',
  (req, res, next) => {
    const uploadField = req.query.role === 'employer' ? 'companyCertificate' : 'cv';
    const dynamicUpload = upload.single(uploadField);
    dynamicUpload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
      }
      next();
    });
  },
  registerUser
);

router.post('/login', loginUser);

router.post('/create-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@ujp.com' });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@ujp.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
