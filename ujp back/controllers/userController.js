import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pdfParse from 'pdf-parse';

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      companyName,
      location,
      establishedDate,
    } = req.body;

    // File is available on req.file from multer
    if (role === 'employer') {
      if (!req.file) {
        return res.status(400).json({ message: 'Company certificate is required' });
      }
      // Check file tampering by hashing buffer
      const fileBuffer = req.file.buffer;
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Extract text from PDF to check companyName presence
      const pdfData = await pdfParse(fileBuffer);
      const pdfText = pdfData.text;

      if (!pdfText.toLowerCase().includes(companyName.toLowerCase())) {
        return res.status(400).json({ message: 'Company name not found in certificate' });
      }

      // You can save fileHash to DB for future tamper checks (optional)
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === 'employer') {
      userData.companyName = companyName;
      userData.location = location;
      userData.establishedDate = establishedDate;
      // Store certificate hash for employer
      userData.certificateHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
