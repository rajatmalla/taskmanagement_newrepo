import React from "react";
import { FiMenu } from "react-icons/fi";
import { MdOutlineAddTask } from "react-icons/md";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(setOpenSidebar(true));
  };

  return (
    <div className='flex justify-between items-center bg-white dark:bg-gray-800 px-4 py-3 2xl:py-4 sticky z-10 top-0 border-b border-gray-200 dark:border-gray-700'>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <FiMenu className="text-2xl text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex gap-2 items-center">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
            <MdOutlineAddTask className="text-white text-2xl" />
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">TaskMe</span>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <NotificationPanel />
        {user?.role && (
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm px-3 py-1 rounded-full font-semibold">
            {user.role}
          </span>
        )}
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;