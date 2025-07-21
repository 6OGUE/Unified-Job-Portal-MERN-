import Job from "../models/Job.js";

export const postJob = async (req, res) => {
  try {
    const employerId = req.user.id; // decoded from JWT
    const { title, description, location, salary, requirement, extraCertifications } = req.body;

    // Basic validation
    if (!title || !requirement?.length) {
      return res.status(400).json({ message: "Title and requirement are required." });
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      requirement,
      extraCertifications,
      employerId
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while posting job" });
  }
};
