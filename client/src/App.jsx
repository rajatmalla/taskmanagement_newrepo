import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TaskDetail from "./pages/TaskDetail"; 
import Settings from "./pages/Settings";
import Team from "./pages/Users";
import Trashed from "./pages/Trash";
import Status from "./pages/Status";
import SignUp from "./pages/SignUp";
import { setOpenSidebar, setCredentials } from "./redux/slices/authSlice";
import { clsx } from "clsx";
import PrivateRoute from "./components/PrivateRoute";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

const App = () => {
  const { user, token, isSidebarOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Restore user profile if token exists but user is missing (prevents logout on reload)
  useEffect(() => {
    if (token && !user) {
      fetch("http://localhost:8800/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user) {
            dispatch(setCredentials({ user: data.user, token }));
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, user, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster 
        position="top-center" 
        richColors 
        expand={true}
        style={{ top: '20px' }}
        closeButton={false}
        duration={3000}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route element={
          <PrivateRoute>
        <>
          <Navbar />
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-lg">
              <Sidebar />
              </div>

            {/* Mobile Sidebar */}
            <div className={clsx(
              "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:hidden",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              <div className="h-full bg-white dark:bg-gray-800 shadow-lg">
                <Sidebar />
              </div>
            </div>

            {/* Overlay - Only shown on mobile when sidebar is open */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                onClick={() => dispatch(setOpenSidebar(false))}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-6">
                    <Outlet />
                  </div>
                </div>
              </div>
            </>
          </PrivateRoute>
        }>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/trash" element={<Trashed />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                </Routes>
      </div>
  );
};

export default App;