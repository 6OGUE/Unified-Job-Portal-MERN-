import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // JWT for authentication

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName, location, establishedDate } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
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
      if (req.file) {
        userData.companyCertificate = req.file.path; // save file path to DB
      }
    } else if (role === 'employee') {
      if (req.file) {
        userData.cv = req.file.path;
      }
    }

    // Save new user to DB
    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
