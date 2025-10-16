import mongoose from 'mongoose';

// Temporary Employer Schema
const temporaryEmployerSchema = new mongoose.Schema({
  // Basic user fields
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['employer', 'admin'] }, // adjust as per your roles

  // Employer-specific fields
  companyName: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  establishedDate: { type: Date, required: true },
  certificateHash: { type: String, required: true, trim: true },
  certificateFilePath: { type: String, required: true, trim: true },

  // Status field with default value 'pending'
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

}, { timestamps: true });

const TemporaryEmployer = mongoose.models.TemporaryEmployer || mongoose.model('TemporaryEmployer', temporaryEmployerSchema);

export default TemporaryEmployer;
