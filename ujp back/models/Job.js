import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  salary: { type: Number },

  requirement: {
    type: [String],
    enum: ["Matriculation", "Higher Secondary", "Graduation", "Post Graduation", "PhD"],
    required: true
  },

  extraCertifications: {
    type: [String],  // optional
    default: []
  },

  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Job", jobSchema);
