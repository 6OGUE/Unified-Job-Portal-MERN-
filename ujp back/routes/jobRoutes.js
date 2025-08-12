import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import { 
  postJob, 
  getFilteredJobs, 
  getAllJobs, 
  getEmployerJobs, 
  deleteJob 
} from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs - Create a new job (protected route for employers)
router.post('/', protect, postJob);

// GET /api/jobs - Get filtered jobs for employees based on their education level
// or get all jobs for employers/admins
router.get('/', protect, (req, res) => {
  if (req.user.role === 'employee') {
    return getFilteredJobs(req, res);
  } else {
    return getAllJobs(req, res);
  }
});



// GET /api/jobs/my-jobs - Get all jobs posted by the logged-in employer
router.get('/my-jobs', protect, getEmployerJobs);

// DELETE /api/jobs/:id - Delete a job by ID
router.delete('/:id', protect, deleteJob);

export default router;