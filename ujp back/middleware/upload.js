import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Helper for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base uploads folder. This is where all files will be stored.
const baseUploadPath = path.join(__dirname, '..', 'uploads');

// Define allowed file extensions (case-insensitive) and MIME types for validation
const allowedExtensionsRegex = /\.(jpeg|jpg|png|pdf)$/i;
const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

// File filter function for Multer to restrict file types
const fileFilter = (req, file, cb) => {
  const extValid = allowedExtensionsRegex.test(file.originalname);
  const mimeValid = allowedMimeTypes.includes(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'), false);
  }
};

// Configure Multer's disk storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the base uploads directory exists
    if (!fs.existsSync(baseUploadPath)) {
      fs.mkdirSync(baseUploadPath, { recursive: true });
    }
    cb(null, baseUploadPath); // Set the destination directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedOriginalname = file.originalname
      .replace(ext, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    const uniqueName = `${sanitizedOriginalname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Create the main Multer instance with the defined storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
