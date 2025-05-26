import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import { getInitials } from "../utils";
import AddUser from "./AddUser";
import ChangePassword from "./ChangePassword";
import { apiSlice } from "../redux/slices/apiSlice";

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state for logout

  const logoutHandler = async () => {
    try {
      setLoading(true);
      await logoutUser().unwrap();
      dispatch(logout());
      // Reset the API cache
      dispatch(apiSlice.util.resetApiState());
      // Clear any additional stored data
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success("Successfully logged out!", {
        description: "You have been logged out of your account.",
        duration: 3000,
      });
      
      // Use React Router navigation instead of window.location
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed", {
        description: "Something went wrong while logging out. Please try again.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't render anything if user is not available
  }

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600"
              aria-label="User menu"
            >
              <span className="text-white font-semibold">
                {getInitials(user.name)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-[#1f1f1f] shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-800" : ""
                      } text-gray-700 dark:text-gray-300 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUser className="mr-2" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-800" : ""
                      } text-gray-700 dark:text-gray-300 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUserLock className="mr-2" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      disabled={loading}
                      className={`${
                        active ? "bg-red-100 dark:bg-red-800" : ""
                      } text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      {loading ? (
                        <span>Logging out...</span>
                      ) : (
                        <>
                          <IoLogOutOutline className="mr-2" aria-hidden="true" />
                          Logout
                        </>
                      )}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddUser open={open} setOpen={setOpen} userData={user} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default UserAvatar;
