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
    sendotp,
    verifyotp,
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
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        registerUser(req, res);
    });
});


router.post('/login', loginUser);


router.post('/create-admin', async (req, res) => {
    try {
        const existing = await User.findOne({ email: 'admin@ujp.com' });
        if (existing) return res.status(400).json({ message: 'Admin user already exists.' });

        const hashedPassword = 'admin123';
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




router.get('/profile', protect, getProfile);
router.put('/profile/qualification', protect, updateQualification);


router.put('/profile/about', protect, updateAboutMe);


router.post('/profile/cv', protect, upload.single('cv'), uploadCV);


router.post(
    '/profile/certificates',
    protect,
    upload.fields(Array.from({ length: 10 }, (_, i) => ({ name: `certificates[${i}][file]`, maxCount: 1 }))),
    addCertificates
);


router.delete('/profile/cv', protect, deleteCV);


router.get('/count/employees', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'employee' });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while counting employees.' });
  }
});


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

router.delete('/profile/certificates/:id', protect, deleteCertificate);
router.post('/verify-otp', verifyotp);
router.post('/send-otp', sendotp);

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
}
);

export default router;
