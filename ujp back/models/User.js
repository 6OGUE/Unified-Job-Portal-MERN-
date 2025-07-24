import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String },
  education: {
    type: String,
    enum: ['Higher Secondary', 'Graduation', 'Postgraduation'],
  },
  cvFilePath: { type: String },
  certificates: [
    {
      name: { type: String },
      filePath: { type: String },
    }
  ],  // Array of certificates with name and filePath
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
  certificateHash: { type: String },  // For employer's company certificate hash
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
