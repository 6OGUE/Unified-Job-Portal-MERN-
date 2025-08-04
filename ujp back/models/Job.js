import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  location: { type: String, required: true },
  education: { type: [String], required: true }, // Changed 'qualification' to 'education'
  additionalQualification: { type: [String], default: [] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);