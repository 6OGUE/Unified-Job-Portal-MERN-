// Importing required modules
import express from 'express';          // Core framework for creating APIs
import mongoose from 'mongoose';        // MongoDB ODM (Object Data Modeling)
import dotenv from 'dotenv';            // Loads environment variables from .env file
import cors from 'cors';                // Enables Cross-Origin requests (React <-> Node)
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use('/api/admin', adminRoutes);
// Middleware to enable CORS (Frontend-Backend communication)


// Middleware to parse incoming JSON requests
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Test route to verify server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));


// Define port from .env or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
