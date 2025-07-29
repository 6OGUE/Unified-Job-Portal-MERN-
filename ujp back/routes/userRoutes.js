import express from 'express';
import bcrypt from 'bcryptjs';
import upload from '../middleware/upload.js';
import User from '../models/User.js';
import {
  registerUser,
  loginUser,
  getProfile,
  updateQualification,
  updateAboutMe,
  uploadCV,
  addCertificates,
  deleteCV,
  deleteCertificate,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  const allPossibleFields = [
    { name: 'companyCertificate', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
  ];
  const MAX_CERTIFICATES = 10;
  for (let i = 0; i < MAX_CERTIFICATES; i++) {
    allPossibleFields.push({ name: `certificates[${i}][file]`, maxCount: 1 });
  }
  upload.fields(allPossibleFields)(req, res, (err) => {
    if (err) { return res.status(400).json({ message: err.message }); }
    registerUser(req, res);
  });
});

router.post('/login', loginUser);

router.post('/create-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@ujp.com' });
    if (existing) return res.status(400).json({ message: 'Admin user already exists.' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({ name: 'Admin', email: 'admin@ujp.com', password: hashedPassword, role: 'admin' });
    await adminUser.save();
    res.status(201).json({ message: 'Admin user created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred while creating admin user.', details: error.message });
  }
});

router.get('/profile', protect, getProfile);
router.put('/profile/qualification', protect, updateQualification);
router.put('/profile/about', protect, updateAboutMe);
router.post('/profile/cv', protect, upload.single('cv'), uploadCV);
router.post('/profile/certificates', protect, upload.fields(Array.from({ length: 10 }, (_, i) => ({ name: `certificates[${i}][file]`, maxCount: 1 }))), addCertificates);
router.delete('/profile/cv', protect, deleteCV);
router.delete('/profile/certificates/:id', protect, deleteCertificate);

export default router;