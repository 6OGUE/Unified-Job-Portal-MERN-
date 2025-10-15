import express from 'express';
import bcrypt from 'bcryptjs';
import upload from '../middleware/upload.js';
import User from '../models/User.js'; // unified import (use consistent case with your file system)
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

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
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
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        registerUser(req, res);
    });
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

// @desc    Create an admin user (for initial setup)
// @route   POST /api/users/create-admin
// @access  Public (should be restricted in production)
router.post('/create-admin', async (req, res) => {
    try {
        const existing = await User.findOne({ email: 'admin@ujp.com' });
        if (existing) return res.status(400).json({ message: 'Admin user already exists.' });

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@ujp.com',
            password: hashedPassword,
            role: 'admin',
        });
        await adminUser.save();
        res.status(201).json({ message: 'Admin user created successfully.' });
    } catch (error) {
        res.status(500).json({
            error: 'Server error occurred while creating admin user.',
            details: error.message,
        });
    }
});

// @desc    Get authenticated user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, getProfile);

// @desc    Update user qualification
// @route   PUT /api/users/profile/qualification
// @access  Private
router.put('/profile/qualification', protect, updateQualification);

// @desc    Update user 'about me' section
// @route   PUT /api/users/profile/about
// @access  Private
router.put('/profile/about', protect, updateAboutMe);

// @desc    Upload user CV
// @route   POST /api/users/profile/cv
// @access  Private
router.post('/profile/cv', protect, upload.single('cv'), uploadCV);

// @desc    Add user certificates
// @route   POST /api/users/profile/certificates
// @access  Private
router.post(
    '/profile/certificates',
    protect,
    upload.fields(Array.from({ length: 10 }, (_, i) => ({ name: `certificates[${i}][file]`, maxCount: 1 }))),
    addCertificates
);

// @desc    Delete user CV
// @route   DELETE /api/users/profile/cv
// @access  Private
router.delete('/profile/cv', protect, deleteCV);

// @desc    Delete a specific user certificate
// @route   DELETE /api/users/profile/certificates/:id
// @access  Private
router.delete('/profile/certificates/:id', protect, deleteCertificate);



// @desc    Get total number of employees (job seekers)
// @route   GET /api/users/count/employees
// @access  Private
router.get('/count/employees', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'employee' });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while counting employees.' });
  }
});

// @desc    Get total number of employers
// @route   GET /api/users/count/employers
// @access  Private
router.get('/count/employers', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'employer' });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while counting employers.' });
  }
});


// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private

router.get('/:id', protect, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching user profile.' });
    }
});

export default router;
