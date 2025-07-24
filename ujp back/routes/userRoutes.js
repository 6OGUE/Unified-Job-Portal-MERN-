import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'), false);
    }
  },
});

router.post('/register', upload.any(), registerUser);

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
      role: 'admin',
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
