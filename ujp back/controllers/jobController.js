import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Application2 from "../models/Application2.js";

const educationLevels = ['Matriculation', 'Higher Secondary', 'Graduation', 'Postgraduation'];

const getEducationLevel = (education) => {
  const index = educationLevels.indexOf(education);
  return index === -1 ? 0 : index;
};

const canApplyForJob = (userEducation, jobEducationArray) => {
  const userLevel = getEducationLevel(userEducation);
  return jobEducationArray.some(jobEdu => {
    const jobLevel = getEducationLevel(jobEdu);
    return userLevel >= jobLevel;
  });
};

export const postJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, location, salary, education, additionalQualification, companyName } = req.body;
    if (!title || !education?.length) {
      return res.status(400).json({ message: "Title and education are required." });
    }
    let finalCompanyName = companyName;
    if (!finalCompanyName) {
      const employer = await User.findById(employerId).select('companyName');
      finalCompanyName = employer?.companyName || 'Unknown Company';
    }
    const newJob = new Job({
      companyName: finalCompanyName, title, description, location, salary,
      education: Array.isArray(education) ? education : [education],
      additionalQualification: Array.isArray(additionalQualification) ? additionalQualification : (additionalQualification ? [additionalQualification] : []),
      postedBy: employerId
    });
    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ message: "Server error while posting job" });
  }
};

export const getFilteredJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. This route is for employees only.' });
    }
    const userEducation = req.user.education;
    const userId = req.user._id;
    if (!userEducation) {
      return res.status(400).json({ message: 'Please update your education level in your profile to view relevant jobs.' });
    }
    const userApplications = await Application2.find({ employeeId: userId }).select('jobId');
    const appliedJobIds = userApplications.map(app => app.jobId.toString());
    const allJobs = await Job.find({ _id: { $nin: appliedJobIds } }).populate('postedBy', 'companyName');
    const filteredJobs = allJobs.filter(job => canApplyForJob(userEducation, job.education));
    res.status(200).json(filteredJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('postedBy', 'companyName');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;
    const jobs = await Job.find({ postedBy: employerId });
    res.status(200).json(jobs);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error while deleting job' });
  }
};

export const updateApplicationStatus = async (req, res) => {
    const { applicationId, status } = req.body;
    const employerId = req.user.id;
    if (!applicationId || !status || !['Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Application ID and a valid status are required.' });
    }
    try {
        const mainApplication = await Application.findById(applicationId).populate('jobId');
        if (!mainApplication) { return res.status(404).json({ message: 'Application not found.' }); }
        if (mainApplication.jobId.postedBy.toString() !== employerId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this application.' });
        }
        mainApplication.status = status;
        const secondaryApplication = await Application2.findOne({ jobId: mainApplication.jobId._id, employeeId: mainApplication.employeeId });
        if (secondaryApplication) {
            secondaryApplication.status = status;
            await secondaryApplication.save();
        }
        await mainApplication.save();
        res.status(200).json({ message: `Application has been ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating application status.' });
    }
};

export const getEmployerApplications = async (req, res) => {
    try {
        const employerId = req.user.id;
        const employerJobs = await Job.find({ postedBy: employerId }).select('_id');
        const jobIds = employerJobs.map(job => job._id);
        const applications = await Application.find({ jobId: { $in: jobIds } }).populate('employeeId', 'name email').populate('jobId', 'title companyName');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching applications.' });
    }
};

export const getEmployeeApplications = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const applications = await Application2.find({ employeeId }).populate('jobId', 'title companyName');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching your applications.' });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) { return res.status(404).json({ message: 'Application not found.' }); }
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching application.' });
    }
};