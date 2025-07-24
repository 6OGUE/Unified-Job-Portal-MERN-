import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveFileAndGetUrl(file, req) {
  if (!file) {
    return '';
  }
  const uniqueFilename = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(__dirname, '..', 'uploads', uniqueFilename);
  fs.writeFileSync(filePath, file.buffer);
  return `${req.protocol}://${req.get('host')}/uploads/${uniqueFilename}`;
}

async function registerEmployer(req, res) {
  const { name, email, password, role, companyName, location, establishedDate } = req.body;
  const certificateFile = req.files && req.files.length > 0 ? req.files[0] : null;

  if (!certificateFile) {
    return res.status(400).json({ message: 'Company certificate is required' });
  }

  try {
    const pdfData = await pdfParse(certificateFile.buffer);
    const pdfText = pdfData.text;

    if (!companyName || !pdfText.toLowerCase().includes(companyName.toLowerCase())) {
        return res.status(400).json({ message: 'Verification failed: The company name provided does not match the name on the certificate.' });
    }
  } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
      return res.status(400).json({ message: 'Could not read the certificate file. Please ensure it is a valid PDF.' });
  }

  const fileBuffer = certificateFile.buffer;
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    companyName,
    location,
    establishedDate,
    certificateHash: fileHash,
  });
  await user.save();
  res.status(201).json({ message: 'Employer registered successfully' });
}

async function registerJobSeeker(req, res) {
  const {
    name,
    email,
    password,
    dob,
    gender,
    education,
    role,
  } = req.body;

  const cvFile = req.files.find(file => file.fieldname === 'cv');

  if (cvFile) {
      try {
          const pdfData = await pdfParse(cvFile.buffer);
          const pdfText = pdfData.text;

          if (!name || !pdfText.toLowerCase().includes(name.toLowerCase())) {
              return res.status(400).json({ message: 'Verification failed: Your name does not appear to be on the uploaded CV.' });
          }
      } catch (parseError) {
          console.error("PDF Parsing Error:", parseError);
          return res.status(400).json({ message: 'Could not read the CV file. Please ensure it is a valid PDF.' });
      }
  } else {
    return res.status(400).json({ message: 'A CV in PDF format is required for name verification.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const certificates = [];
  let index = 0;

  while (true) {
    const titleKey = `certificates_title_${index}`;
    const fileKey = `certificates_file_${index}`;

    if (!(titleKey in req.body)) break;

    const title = req.body[titleKey];
    const file = req.files.find(f => f.fieldname === fileKey);

    if (file && title) {
      const fileUrl = saveFileAndGetUrl(file, req);
      certificates.push({
        name: title,
        filePath: fileUrl,
      });
    }
    index++;
  }

  const cvFilePath = cvFile ? saveFileAndGetUrl(cvFile, req) : '';

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: (role === 'job seeker') ? 'job seeker' : 'employee',
    dateOfBirth: dob,
    gender,
    education,
    certificates,
    cvFilePath,
  });

  await user.save();
  res.status(201).json({ message: 'Job Seeker registered successfully' });
}

export const registerUser = async (req, res) => {
  try {
    const { role } = req.body;
    if (role === 'employer') {
      await registerEmployer(req, res);
    } else if (role === 'employee' || role === 'job seeker') {
      await registerJobSeeker(req, res);
    } else {
      return res.status(400).json({ message: 'A valid role (employee/job seeker or employer) is required.' });
    }
  } catch (error) {
    console.error("REGISTRATION CRASH:", error);
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};