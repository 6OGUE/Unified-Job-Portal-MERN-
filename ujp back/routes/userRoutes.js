import express from 'express';
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

export default router;
