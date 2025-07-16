import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'employer','admin'], required: true }
}, { timestamps: true });

// Fix for OverwriteModelError:
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
