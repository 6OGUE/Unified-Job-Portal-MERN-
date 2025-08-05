import mongoose from 'mongoose';

// Define the schema for the Application2 model
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
// This index will ensure that an employee can only apply for a specific job once in this collection.
applicationSchema.index({ jobId: 1, employeeId: 1 }, { unique: true });

// Export the Mongoose model for 'Application2' using the defined schema.
// It's crucial that the model name here ('Application2') matches the import name in your routes.
export default mongoose.model('Application2', applicationSchema);
