import express from 'express';
import passport from 'passport';
import { createJWT } from '../utils/index.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  async (req, res) => {
    try {
      console.log('=== Google OAuth Callback Debug ===');
      console.log('User from passport:', req.user);
      
      if (!req.user) {
        console.error('No user object in request');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed - no user data`);
      }

      // Create JWT token
      const token = createJWT(req.user._id);
      console.log('JWT token created successfully');
      
      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
      console.log('Cookie set successfully');

      // Send the token in the URL for the frontend to handle
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('=== OAuth Callback Error Details ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Request user:', req.user);
      console.error('Request headers:', req.headers);
      
      res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed: ${error.message}`);
    }
  }
);

// New route for setting up password after Google OAuth
router.post('/setup-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        status: false,
        message: "Token and password are required"
      });
    }

    // Verify token and get user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    if (!user.requiresPasswordSetup) {
      return res.status(400).json({
        status: false,
        message: "Password already set up"
      });
    }

    // Update user's password and remove requiresPasswordSetup flag
    user.password = password;
    user.requiresPasswordSetup = false;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password set up successfully"
    });
  } catch (error) {
    console.error('Password setup error:', error);
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
});

export default router; 