import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables explicitly
dotenv.config();

// Debug environment variables
console.log('Environment Variables Check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not Set');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CLIENT_URL:', process.env.CLIENT_URL);

// Google Strategy configuration
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8800/api/auth/google/callback',
  scope: ['profile', 'email']
};

console.log('Google Strategy Config:', {
  ...googleConfig,
  clientSecret: googleConfig.clientSecret ? 'Set' : 'Not Set'
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    googleConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('=== Google Strategy Debug ===');
        console.log('Profile:', {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value
        });

        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log('Existing user found:', user ? 'Yes' : 'No');

        if (user) {
          // Update user's Google ID if not set
          if (!user.googleId) {
            console.log('Updating user with Google ID');
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        console.log('Creating new user');
        // Create new user if doesn't exist
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          title: 'User',
          role: 'user',
          isActive: true,
          permissions: {
            canViewAllTasks: false,
            canCreateTasks: true,
            canEditAllTasks: false,
            canDeleteTasks: false,
            canAssignTasks: false,
            canViewAllProjects: false,
            canCreateProjects: false,
            canAddTeamMember: false,
            canEditAllProjects: false,
            canDeleteProjects: false,
            canAssignProjects: false
          }
        });
        console.log('New user created successfully');

        // If user is admin, update permissions
        if (user.isAdmin) {
          user.permissions = {
            canViewAllTasks: true,
            canCreateTasks: true,
            canEditAllTasks: true,
            canDeleteTasks: true,
            canAssignTasks: true,
            canViewAllProjects: true,
            canCreateProjects: true,
            canAddTeamMember: true,
            canEditAllProjects: true,
            canDeleteProjects: true,
            canAssignProjects: true
          };
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error('=== Google Strategy Error ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Profile data:', profile);
        return done(error, null);
      }
    }
  )
); 