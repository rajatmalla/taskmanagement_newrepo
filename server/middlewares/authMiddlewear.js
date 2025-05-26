import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  console.log('=== Auth Debug ===');
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  
  try {
    // Check for token in cookie or authorization header
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('No token found in cookies or headers');
      return res.status(401).json({ 
        status: false, 
        message: "No authentication token found. Please login." 
      });
    }

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decodedToken);
        
      const user = await User.findById(decodedToken.userId)
        .select("isAdmin email role permissions");
      console.log('User found:', user ? 'Yes' : 'No');
        
      if (!user) {
          console.log('User not found in database');
          return res.status(401).json({ 
            status: false, 
            message: "User not found. Please login again." 
          });
        }

        req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userID: decodedToken.userId,
        role: user.role,
        permissions: user.permissions
        };
        
        console.log('User attached to request:', req.user);
        next();
      } catch (jwtError) {
        console.error('JWT verification error:', jwtError);
        return res.status(401).json({ 
          status: false, 
          message: "Invalid token. Please login again." 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      status: false, 
      message: "Authentication failed. Please try again." 
    });
  }
});

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };