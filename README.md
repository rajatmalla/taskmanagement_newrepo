# Task-Me: Modern Task Management System

Task-Me is a full-stack task management application built with React, Node.js, and MongoDB. It provides a modern, intuitive interface for managing tasks, teams, and projects with real-time updates and collaborative features.

## 🌟 Features

- **User Authentication**
  - Secure login/signup with JWT
  - Google OAuth integration
  - Role-based access control (Admin/User)

- **Task Management**
  - Create, read, update, and delete tasks
  - Task categorization (Todo, In Progress, Completed)
  - Priority levels (High, Medium, Low)
  - Due date tracking
  - File attachments
  - Task comments and activities

- **Team Collaboration**
  - Team member management
  - Task assignment
  - Real-time notifications
  - Activity tracking

- **Dashboard & Analytics**
  - Task statistics and progress tracking
  - Visual charts and graphs
  - Task filtering and search
  - Customizable views

## 🛠️ Tech Stack

### Frontend Development
- **Core Technologies**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- React 18
  - Vite (Build Tool)

- **Styling & UI**
  - Tailwind CSS
  - HeadlessUI (Accessible Components)
  - React Icons
  - Custom CSS Animations
  - Responsive Design

- **State Management**
  - Redux Toolkit
  - Redux Persist
  - React Hooks
  - Context API

- **Routing & Navigation**
  - React Router v6
  - Protected Routes
  - Dynamic Routing

- **UI Components**
  - Custom Components
  - Reusable Components
  - Form Components
  - Modal Components
  - Toast Notifications (Sonner)

- **Data Visualization**
  - Chart.js
  - Custom Charts
  - Data Tables

### Backend Development
- **Core Framework**
  - Node.js
  - Express.js
  - Nodemon (Development)

- **API Development**
  - RESTful Architecture
  - Express Router
  - Middleware Support
  - Error Handling

- **Security**
  - Helmet (Security Headers)
  - CORS (Cross-Origin Resource Sharing)
  - Rate Limiting
  - Input Validation

### Database
- **Database**
  - MongoDB (NoSQL Database)
  - Mongoose (ODM)
  - MongoDB Atlas (Cloud Database)

- **Data Modeling**
  - Schema Design
  - Data Validation
  - Indexing
  - Relationships

### Authentication & Authorization
- **Authentication**
  - JWT (JSON Web Tokens)
  - Passport.js
  - Google OAuth 2.0
  - Bcrypt (Password Hashing)

- **Authorization**
  - Role-Based Access Control (RBAC)
  - Protected Routes
  - Session Management
  - Token Refresh

### API Integration
- **RESTful Endpoints**
  - User Management
  - Task Management
  - Team Collaboration
  - File Upload

- **Real-time Features**
  - WebSocket Integration
  - Event Emitters
  - Real-time Updates

### Cloud Hosting & Deployment
- **Frontend Hosting**
  - Netlify
  - Continuous Deployment
  - Environment Variables
  - Custom Domain Support

- **Backend Hosting**
  - Render
  - Environment Configuration
  - Process Management
  - SSL/TLS Support

- **Database Hosting**
  - MongoDB Atlas
  - Automated Backups
  - Data Replication
  - Monitoring

### Development Tools
- **Version Control**
  - Git
  - GitHub
  - Git Flow

- **Development Environment**
  - VS Code
  - ESLint
  - Prettier
  - Postman (API Testing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-me.git
cd task-me
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add the following variables:
```env
PORT=8800
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

## 📁 Project Structure

```
task-me/
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/             # Static assets (images, icons)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── ...
│   │   │
│   │   ├── redux/             # Redux store and slices
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── taskSlice.js
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   │
│   ├── .env                   # Environment variables
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── server/                     # Backend Node.js application
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database configuration
│   │   └── passport.js       # Passport configuration
│   │
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   └── errorHandler.js  # Error handling middleware
│   │
│   ├── models/              # Mongoose models
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── logger.js
│   │   └── validators.js
│   │
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js         # Entry point
│
├── .gitignore            # Git ignore file
├── README.md            # Project documentation
└── LICENSE             # MIT License file
```

## 📦 Deployment

### Frontend Deployment (Netlify)

1. Create a `netlify.toml` file in the client directory:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy to Netlify:
   - Push your code to GitHub
   - Log in to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend API URL

### Backend Deployment

The backend can be deployed on any Node.js hosting platform like:
- Heroku
- DigitalOcean
- Railway
- Render

After deploying the backend, update the `VITE_API_URL` in your Netlify environment variables to point to your deployed backend URL.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Secure cookie settings
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Amit Shrestha - Initial work

## 🙏 Acknowledgments
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- Thanks to all contributors who have helped shape this project
- Inspired by modern task management tools and best practices
 
