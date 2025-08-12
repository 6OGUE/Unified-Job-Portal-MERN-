import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        type: String,
        required: true,
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
}, { timestamps: true });

applicationSchema.index({ jobId: 1, employeeId: 1 }, { unique: true });

export default mongoose.model('Application2', applicationSchema);