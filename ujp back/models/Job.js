import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  location: { type: String, required: true },
  qualification: { type: String, required: true },
  additionalQualification: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
