import Job from "../models/Job.js";
import User from "../models/User.js";

// Helper function to map education strings to numerical values for comparison
const educationLevels = ['Matriculation', 'Higher Secondary', 'Graduation', 'Postgraduation'];

const getEducationLevel = (education) => {
  const index = educationLevels.indexOf(education);
  return index === -1 ? 0 : index;
};

// Helper function to check if user can apply for a job based on education
const canApplyForJob = (userEducation, jobEducationArray) => {
  const userLevel = getEducationLevel(userEducation);
  
  // Check if any of the job's education requirements can be met by the user
  return jobEducationArray.some(jobEdu => {
    const jobLevel = getEducationLevel(jobEdu);
    return userLevel >= jobLevel; // User can apply if their education is equal or higher
  });
};

export const postJob = async (req, res) => {
  try {
    const employerId = req.user.id; // decoded from JWT
    const { title, description, location, salary, education, additionalQualification, companyName } = req.body;

    // Basic validation
    if (!title || !education?.length) {
      return res.status(400).json({ message: "Title and education are required." });
    }

    // Get company name from employer's profile if not provided
    let finalCompanyName = companyName;
    if (!finalCompanyName) {
      const employer = await User.findById(employerId).select('companyName');
      finalCompanyName = employer?.companyName || 'Unknown Company';
    }

    const newJob = new Job({
      companyName: finalCompanyName,
      title,
      description,
      location,
      salary,
      education: Array.isArray(education) ? education : [education],
      additionalQualification: Array.isArray(additionalQualification) ? additionalQualification : (additionalQualification ? [additionalQualification] : []),
      postedBy: employerId
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while posting job" });
  }
};

export const getFilteredJobs = async (req, res) => {
  try {
    // Check if the user is an employee
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. This route is for employees only.' });
    }

    // Get the employee's education level from the authenticated user object
    const userEducation = req.user.education;
    
    if (!userEducation) {
      return res.status(400).json({ message: 'Please update your education level in your profile to view relevant jobs.' });
    }

    // Get all jobs
    const allJobs = await Job.find({}).populate('postedBy', 'companyName');

    // Filter jobs based on education level
    const filteredJobs = allJobs.filter(job => {
      return canApplyForJob(userEducation, job.education);
    });

    res.status(200).json(filteredJobs);
  } catch (error) {
    console.error('Fetch filtered jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('postedBy', 'companyName');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Fetch all jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;
    const jobs = await Job.find({ postedBy: employerId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Fetch employer jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching your jobs' });
  }
};



export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const employerId = req.user.id || req.user._id;
    if (job.postedBy.toString() !== employerId.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
};