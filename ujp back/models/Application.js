import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job model
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (employee)
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String, // Storing the employee's name directly for easier display
    required: true,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  
  // You can add more fields here, e.g., resume path, cover letter path, etc.
}, { timestamps: true }); // `timestamps: true` adds createdAt and updatedAt fields automatically

// Add this compound unique index to prevent duplicate applications
applicationSchema.index({ jobId: 1, employeeId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
