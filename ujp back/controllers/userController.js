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
const baseUploadPath = path.join(__dirname, '..', 'uploads');

const performSmartVerification = async (fileBuffer, nameToVerify) => {
    const pdfData = await pdfParse(fileBuffer);
    const pdfText = pdfData.text;
    if (!pdfText || pdfText.trim() === '') throw new Error('Could not extract text from the document for verification.');
    const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    const normalizedPdfText = normalizeText(pdfText), normalizedNameToVerify = normalizeText(nameToVerify);
    if (!normalizedNameToVerify) throw new Error('Name to verify is empty.');
    return normalizedPdfText.includes(normalizedNameToVerify);
};

export const saveFileAndGetUrl = (file, req) => file?.filename ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}` : null;

async function registerEmployer(req, res) {
    const { name, email, password, role, companyName, location, establishedDate } = req.body;
    const certificateFile = req.files?.companyCertificate?.[0];
    const cleanupFile = (file) => { if (file?.filename && fs.existsSync(path.join(baseUploadPath, file.filename))) try { fs.unlinkSync(path.join(baseUploadPath, file.filename)); } catch (e) {} };
    if (!password || password.trim() === '') return res.status(400).json({ message: 'Password is required and cannot be empty.' });
    if (!companyName || companyName.trim() === '') return res.status(400).json({ message: 'Company name is required.' });
    if (!certificateFile) return res.status(400).json({ message: 'Company certificate file is required.' });
    if (certificateFile.mimetype !== 'application/pdf') { cleanupFile(certificateFile); return res.status(400).json({ message: 'Invalid file type. Only PDF allowed.' }); }
    const filePathOnDisk = path.join(baseUploadPath, certificateFile.filename);
    try {
        const fileBuffer = fs.readFileSync(filePathOnDisk);
        if (!await performSmartVerification(fileBuffer, companyName)) return res.status(400).json({ message: 'Verification failed: Company name not found in the certificate.' });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User with this email already exists.' });
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const certificateFilePath = saveFileAndGetUrl(certificateFile, req);
        const user = new User({ name, email, password, role, companyName, location, establishedDate: establishedDate ? new Date(establishedDate) : undefined, certificateHash: fileHash, certificateFilePath: certificateFilePath });
        await user.save();
        res.status(201).json({ message: 'Employer registered successfully.' });
    } catch (error) {
        console.error("Employer Registration Error:", error);
        res.status(500).json({ message: error.message || 'Server error during employer registration.' });
    } finally { cleanupFile(certificateFile); }
}

async function registerJobSeeker(req, res) {
    const { name, email, password, role, dateOfBirth, gender, about, education, linkedinProfile, githubProfile, skills, experience } = req.body;
    const allUploadedFiles = req.files ? Object.values(req.files).flat() : [];
    const cleanupFiles = () => allUploadedFiles.forEach(file => { if (file?.filename && fs.existsSync(path.join(baseUploadPath, file.filename))) try { fs.unlinkSync(path.join(baseUploadPath, file.filename)); } catch (e) {} });
    if (!password || password.trim() === '') return res.status(400).json({ message: 'Password is required and cannot be empty.' });
    if (!name || name.trim() === '') return res.status(400).json({ message: 'Full name is required.' });
    const cvFile = req.files?.cv?.[0];
    if (!cvFile) return res.status(400).json({ message: 'CV file is required.' });
    const cvFilePathOnDisk = path.join(baseUploadPath, cvFile.filename);
    try {
        const cvFileBuffer = fs.readFileSync(cvFilePathOnDisk);
        if (!await performSmartVerification(cvFileBuffer, name)) { cleanupFiles(); return res.status(400).json({ message: 'Verification failed: Your name was not found in the uploaded CV.' }); }
        const existingUser = await User.findOne({ email });
        if (existingUser) { cleanupFiles(); return res.status(400).json({ message: 'User with this email already exists.' }); }
        const certificateFiles = allUploadedFiles.filter(f => f.fieldname.startsWith('certificates['));
        const certificateRecords = certificateFiles.map(certFile => {
            const indexMatch = certFile.fieldname.match(/\[(\d+)\]/);
            const certIndex = indexMatch ? parseInt(indexMatch[1], 10) : null;
            const certTitle = (certIndex !== null && req.body.certificates?.[certIndex]?.title) || 'Untitled Certificate';
            return { title: certTitle, filePath: saveFileAndGetUrl(certFile, req), mimetype: certFile.mimetype };
        });
        const user = new User({ name, email, password, role, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, gender, about, education, cvFilePath: saveFileAndGetUrl(cvFile, req), certificates: certificateRecords, linkedinProfile, githubProfile, skills: skills ? skills.split(',').map(s => s.trim()) : [], experience: experience ? experience.split(',').map(exp => exp.trim()) : [] });
        await user.save();
        res.status(201).json({ message: 'Employee registered successfully.' });
    } catch (error) {
        console.error("Employee Registration Error:", error);
        cleanupFiles();
        res.status(500).json({ message: error.message || 'Server error during employee registration.' });
    }
}

export const registerUser = (req, res) => {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'User role is required.' });
    if (role === 'employer') registerEmployer(req, res);
    else if (role === 'employee' || role === 'job seeker') registerJobSeeker(req, res);
    else return res.status(400).json({ message: 'Invalid user role specified.' });
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowercasedEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowercasedEmail });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error." });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

export const getProfile = async (req, res) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized.' });
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateQualification = async (req, res) => {
    const { education } = req.body;
    if (!['Matriculation', 'Higher Secondary', 'Graduation', 'Postgraduation'].includes(education)) return res.status(400).json({ message: 'Invalid education value.' });
    try {
        if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized.' });
        const user = await User.findByIdAndUpdate(req.user.id, { education }, { new: true }).select('education');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json({ success: true, education: user.education });
    } catch (err) {
        console.error("Error updating qualification:", err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateAboutMe = async (req, res) => {
    const { about } = req.body;
    if (typeof about === 'undefined') return res.status(400).json({ message: 'About content is missing.' });
    try {
        if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized.' });
        const user = await User.findByIdAndUpdate(req.user.id, { about }, { new: true, runValidators: true }).select('about');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json({ success: true, about: user.about });
    } catch (err) {
        console.error("Error updating about me:", err);
        res.status(500).json({ message: 'Server error while updating about me.' });
    }
};

export const uploadCV = async (req, res) => {
    const file = req.file;
    const cleanupFile = () => { if (file?.filename && fs.existsSync(path.join(baseUploadPath, file.filename))) try { fs.unlinkSync(path.join(baseUploadPath, file.filename)); } catch (e) {} };
    if (!file) return res.status(400).json({ message: 'No CV file uploaded.' });
    try {
        if (!req.user?.id) { cleanupFile(); return res.status(401).json({ message: 'Unauthorized.' }); }
        const user = await User.findById(req.user.id);
        if (!user) { cleanupFile(); return res.status(404).json({ message: 'User not found.' }); }
        const fileBuffer = fs.readFileSync(path.join(baseUploadPath, file.filename));
        if (!await performSmartVerification(fileBuffer, user.name)) { cleanupFile(); return res.status(400).json({ message: `Verification failed: Your name was not found in the new CV.` }); }
        if (user.cvFilePath) {
            const oldFilename = user.cvFilePath.split('/').pop();
            const oldPath = path.join(baseUploadPath, oldFilename);
            if (fs.existsSync(oldPath)) try { fs.unlinkSync(oldPath); } catch (e) { console.error("Failed to delete old CV:", e); }
        }
        user.cvFilePath = saveFileAndGetUrl(file, req);
        await user.save();
        res.json({ success: true, cvFilePath: user.cvFilePath });
    } catch (err) {
        cleanupFile();
        console.error("Error uploading CV:", err);
        res.status(500).json({ message: err.message || 'Error uploading CV.' });
    }
};

export const addCertificates = async (req, res) => {
    let allFiles = req.files ? Object.values(req.files).flat() : [];
    const cleanupFiles = () => allFiles.forEach(file => { if (file?.filename && fs.existsSync(path.join(baseUploadPath, file.filename))) try { fs.unlinkSync(path.join(baseUploadPath, file.filename)); } catch (e) {} });
    try {
        if (allFiles.length === 0) return res.status(400).json({ message: 'No certificate files provided.' });
        if (!req.user?.id) { cleanupFiles(); return res.status(401).json({ message: 'Unauthorized.' }); }
        const user = await User.findById(req.user.id);
        if (!user) { cleanupFiles(); return res.status(404).json({ message: 'User not found.' }); }
        const newVerifiedCertificates = [];
        for (const file of allFiles) {
            const filePathOnDisk = path.join(baseUploadPath, file.filename);
            const fileBuffer = fs.readFileSync(filePathOnDisk);
            if (!await performSmartVerification(fileBuffer, user.name)) { cleanupFiles(); return res.status(400).json({ message: `Verification failed: Your name was not found in the certificate '${file.originalname}'.` }); }
            const match = file.fieldname.match(/\[(\d+)\]/);
            const index = match ? parseInt(match[1], 10) : null;
            const title = (index !== null && req.body.certificates?.[index]?.title) || 'Untitled Certificate';
            newVerifiedCertificates.push({ title, filePath: saveFileAndGetUrl(file, req), mimetype: file.mimetype });
        }
        user.certificates.push(...newVerifiedCertificates);
        await user.save();
        res.json({ success: true, certificates: user.certificates });
    } catch (err) {
        cleanupFiles();
        console.error("Error adding certificates:", err);
        res.status(500).json({ message: err.message || 'Server error while adding certificates.' });
    }
};

export const deleteCV = async (req, res) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized.' });
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.cvFilePath) {
            const cvFilename = user.cvFilePath.split('/').pop();
            const cvPath = path.join(baseUploadPath, cvFilename);
            if (fs.existsSync(cvPath)) try { fs.unlinkSync(cvPath); } catch (e) { console.error("Failed to delete CV file:", e); }
            user.cvFilePath = '';
            await user.save();
        }
        res.json({ success: true, message: 'CV deleted successfully.' });
    } catch (err) {
        console.error("Error deleting CV:", err);
        res.status(500).json({ message: 'Error deleting CV.' });
    }
};

export const deleteCertificate = async (req, res) => {
    const certId = req.params.id;
    if (!certId) return res.status(400).json({ message: 'Certificate ID is required.' });
    try {
        if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized.' });
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const cert = user.certificates.id(certId);
        if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
        const certFilename = cert.filePath.split('/').pop();
        const certPath = path.join(baseUploadPath, certFilename);
        if (fs.existsSync(certPath)) try { fs.unlinkSync(certPath); } catch (e) { console.error("Failed to delete cert file:", e); }
        cert.deleteOne();
        await user.save();
        res.json({ success: true, message: 'Certificate deleted successfully.', certificates: user.certificates });
    } catch (err) {
        console.error("Error deleting certificate:", err);
        res.status(500).json({ message: 'Server error.' });
    }
};