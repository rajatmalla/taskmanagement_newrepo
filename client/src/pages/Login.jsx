import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useEffect } from "react";
import teamWorkingImage from "../assets/images/team-working.jpg";
import { APP_CONFIG } from "../config/appConfig";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();
      console.log('Login response:', res);
      
      if (res.status && res.user && res.token) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        toast.success("Welcome back!", {
          description: `Successfully logged in as ${res.user.name}`,
          duration: 3000,
        });
        navigate("/dashboard");
      } else {
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
          duration: 4000,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error("Login failed", {
        description: err?.data?.message || "Please check your credentials and try again.",
        duration: 4000,
      });
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = 'http://localhost:8800';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-2 px-4 border rounded-full text-sm md:text-base dark:border-transparent border-transparent text-white font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 mt-8 animate-fade-in shadow-lg hover:shadow-xl'>
              Manage all your task in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-400 text-blue-700'>
              <span className='transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent animate-fade-in-delay'>{APP_CONFIG.title.firstLine}</span>
              <span className='transition-all duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:bg-clip-text hover:text-transparent animate-fade-in-delay-2'>{APP_CONFIG.title.secondLine}</span>
            </p>
            <img 
              src={teamWorkingImage} 
              alt="Team working together" 
              className="w-full max-w-lg rounded-lg shadow-lg mt-8 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-delay-3"
            />
          </div>
        </div>

        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-10 pt-14 pb-14 transition-all duration-300 hover:shadow-xl animate-fade-in-delay-4'
          >
            <div className='transition-all duration-300 hover:scale-105 animate-fade-in-delay-5'>
              <p className='text-blue-600 text-3xl font-bold text-center transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-400'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-500 transition-colors duration-300 hover:text-gray-900 dark:hover:text-gray-300'>
                Keep all your credetials safe!
              </p>
            </div>
            <div className='flex flex-col gap-y-5 animate-fade-in-delay-6'>
              <Textbox
                placeholder='you@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full transition-all duration-300 focus:scale-105'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full transition-all duration-300 focus:scale-105'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />
              <span className='text-sm text-gray-600 hover:underline cursor-pointer transition-all duration-300 hover:text-blue-600'>
                Forget Password?
              </span>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label='Log in'
                className='w-full h-10 bg-blue-700 text-white rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105 animate-fade-in-delay-7'
              />
            )}
            <p className='text-sm text-center text-gray-600 dark:text-gray-400'>
              Don't have an account?{" "}
              <Link to="/signup" className='text-blue-600 hover:underline transition-all duration-300 hover:text-blue-700'>
                Sign Up
              </Link>
            </p>
          </form>

          <div className="mt-6 animate-fade-in-delay-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 transition-all duration-500 hover:border-blue-500 hover:scale-x-105" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="group flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-delay-9 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-700 dark:hover:to-slate-600"
              >
                <svg 
                  className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  aria-hidden="true" 
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                    className="transition-all duration-300 group-hover:fill-[#ff4d4d] group-hover:scale-110"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                    className="transition-all duration-300 group-hover:fill-[#5c9eff] group-hover:scale-110"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                    className="transition-all duration-300 group-hover:fill-[#ffd04c] group-hover:scale-110"
                  />
                  <path
                    d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.87043 19.245 6.21543 17.135 5.26543 14.29L1.27545 17.385C3.25545 21.31 7.31043 24 12.0004 24Z"
                    fill="#34A853"
                    className="transition-all duration-300 group-hover:fill-[#4caf50] group-hover:scale-110"
                  />
                </svg>
                <span className="transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105 group-hover:translate-x-1">
                  Sign in with Google
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;