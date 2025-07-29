import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Required for pre-save hashing

// Schema for individual certificates (subdocument)
const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  filePath: { type: String, required: true },
  mimetype: { type: String },
});

// Main User Schema
const userSchema = new mongoose.Schema({
  // Common fields for all users
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['employee', 'employer', 'admin'],
    message: 'Role must be employee, employer, or admin.'
  },

  // Fields specific to 'employee' (Job Seeker) role
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  about: { type: String, trim: true, default: '' },
  education: {
    type: String,
    enum: ['Matriculation', 'Higher Secondary', 'Graduation', 'Postgraduation', ''],
    default: '',
  },
  cvFilePath: { type: String, default: '' },
  certificates: {
    type: [CertificateSchema],
    default: [],
  },
  

  // Fields specific to 'employer' role
  companyName: { type: String, trim: true },
  location: { type: String, trim: true },
  establishedDate: { type: Date },
  certificateHash: { type: String, trim: true },
  certificateFilePath: { type: String, trim: true }, // Added trim for consistency
}, { timestamps: true });

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Pre-save hook to clear role-specific fields
userSchema.pre('save', function (next) {
  if (this.role === 'employer') {
    this.dateOfBirth = undefined;
    this.gender = undefined;
    this.about = undefined;
    this.education = undefined;
    this.cvFilePath = undefined;
    this.certificates = undefined;
  } else if (this.role === 'employee') {
    this.companyName = undefined;
    this.location = undefined;
    this.establishedDate = undefined;
    this.certificateHash = undefined;
    this.certificateFilePath = undefined;
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;