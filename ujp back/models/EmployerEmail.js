import mongoose from 'mongoose';

const employerEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const EmployerEmail = mongoose.model('EmployerEmail', employerEmailSchema);

export default EmployerEmail;
