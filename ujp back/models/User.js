import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String },
  about: { type: String, trim: true }, // <-- Added field
  education: {
    type: String,
    enum: ['Matriculation', 'Higher Secondary', 'Graduation', 'Postgraduation'],
  },
  cvFilePath: { type: String },
  certificates: [
    {
      name: { type: String },
      filePath: { type: String },
    }
  ],
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['employee', 'job seeker', 'employer', 'admin'] 
  },
  companyName: { type: String },
  location: { type: String },
  establishedDate: { type: Date },
  linkedinProfile: { type: String },
  githubProfile: { type: String },
  certificateHash: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
