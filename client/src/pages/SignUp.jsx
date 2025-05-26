import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import teamMeetingImage from "../assets/images/team-meeting.jpg";

const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      toast.error("Name must be at least 2 characters long");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: "user",
        title: "Team Member"
      };
      
      const response = await register(userData).unwrap();
      
      if (response.status) {
        toast.success("Account created successfully!", {
          description: "Please login with your credentials.",
          duration: 3000,
        });
      navigate("/login");
      } else {
        toast.error(response.message || "Failed to create account");
      }
    } catch (err) {
      const errorMessage = err?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-full md:w-1/2 h-full hidden md:flex items-center justify-center bg-gray-100 dark:bg-gray-800'>
            <img 
              src={teamMeetingImage} 
          alt='Team Meeting'
          className='w-full h-full object-cover'
            />
          </div>
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-10 pt-14 pb-14 transition-all duration-300 hover:shadow-xl animate-fade-in-delay-4'
          >
            <div className='transition-all duration-300 hover:scale-105 animate-fade-in-delay-5'>
              <p className='text-blue-600 text-3xl font-bold text-center transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-400'>
                Create Account
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-500 transition-colors duration-300 hover:text-gray-900 dark:hover:text-gray-300'>
                Start managing your tasks today!
              </p>
            </div>

            <div className='flex flex-col gap-y-5 animate-fade-in-delay-6'>
              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>Name</label>
                <input
                  type="text"
                  name="name"
                value={formData.name}
                  className='w-full px-4 py-2 border rounded-full bg-gray-50 dark:bg-[#2c2c2c] dark:text-white transition-all duration-300 focus:scale-105'
                  onChange={handleChange}
                  required
                minLength={2}
                placeholder="Enter your name"
                />
              </div>

              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>Email</label>
                <input
                  type="email"
                  name="email"
                value={formData.email}
                  className='w-full px-4 py-2 border rounded-full bg-gray-50 dark:bg-[#2c2c2c] dark:text-white transition-all duration-300 focus:scale-105'
                  onChange={handleChange}
                  required
                placeholder="Enter your email"
                />
              </div>

              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>Password</label>
                <input
                  type="password"
                  name="password"
                value={formData.password}
                  className='w-full px-4 py-2 border rounded-full bg-gray-50 dark:bg-[#2c2c2c] dark:text-white transition-all duration-300 focus:scale-105'
                  onChange={handleChange}
                  required
                minLength={6}
                placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
            className='w-full h-10 bg-blue-700 text-white rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105 animate-fade-in-delay-7 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className='text-sm text-center text-gray-600 dark:text-gray-400'>
              Already have an account?{" "}
              <Link to="/login" className='text-blue-600 hover:underline transition-all duration-300 hover:text-blue-700'>
              Log in
              </Link>
            </p>
          </form>
      </div>
    </div>
  );
};

export default SignUp; 