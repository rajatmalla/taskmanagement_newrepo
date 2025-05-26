import clsx from "clsx";
import React, { useState } from "react";
import { FaTasks, FaTrashAlt, FaUsers, FaProjectDiagram } from "react-icons/fa";
import {
  MdDashboard,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Projects",
    link: "projects",
    icon: <FaProjectDiagram />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Status",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Trash",
    link: "trash",
    icon: <FaTrashAlt />,
  },
  {
    label: "Settings",
    link: "settings",
    icon: <MdSettings />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin 
    ? linkData 
    : linkData.filter(link => link.label !== "Trash");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[0];
    
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
          isActive 
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        )}
      >
        <span className={clsx(
          "text-xl transition-transform duration-200",
          isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
        )}>
        {el.icon}
        </span>
        {!isCollapsed && (
          <span className={clsx(
            "font-medium whitespace-nowrap",
            isActive ? "text-white" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}>
            {el.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className={clsx(
      'h-full flex flex-col gap-6 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {isCollapsed ? (
          <MdChevronRight className="text-gray-600 dark:text-gray-300" />
        ) : (
          <MdChevronLeft className="text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Navigation Links */}
      <div className='flex-1 flex flex-col gap-2 p-4'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;