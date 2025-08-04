import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import the User model

export const protect = async (req, res, next) => { // Made async to use await
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token payload
      // Select all fields except the password for security
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach the full user object to the request
      // This will now include 'name', 'skills', 'role', etc.
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification or user fetch error:', error); // Log the actual error
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

// Optional: role-based protection middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user and req.user.role exist from the protect middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role access' });
    }
    next();
  };
};
