import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./utils/index.js";
import { routeNotFound, errorHandler } from "./middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";
import passport from 'passport';
import './config/passport.js';
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/project.js';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Server Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not Set');
console.log('CLIENT_URL:', process.env.CLIENT_URL);

dbConnection();

const PORT = process.env.PORT || 8800;

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.CLIENT_URL 
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Add a permissive CSP header for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:5173 http://localhost:8800;"
    );
    next();
  });
}

// Initialize Passport
app.use(passport.initialize());

// Mount routes
app.use("/api/user", userRoutes);  // Mount user routes directly
app.use("/api/task", taskRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/project', projectRoutes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
