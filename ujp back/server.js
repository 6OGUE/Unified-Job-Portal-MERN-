import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js'; // NEW: Import application routes

dotenv.config(); // Load environment variables from .env file

const app = express();

// Enable CORS for all origins. In a production environment, you should restrict this
// to specific origins for security.
app.use(cors());

// Middleware to parse JSON request bodies. This is essential for handling JSON data
// sent in POST and PUT requests.
app.use(express.json());

// Serve static files from the 'uploads' directory. This is used for serving
// uploaded CVs, certificates, etc.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic root route to confirm the API is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use API routes. These lines connect your route modules to specific base paths.
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes); // NEW: Register application routes

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected')) // Log success
  .catch((err) => console.log('❌ MongoDB connection error:', err)); // Log error

// Define the port and start the server
const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`); // Confirm server start
});
