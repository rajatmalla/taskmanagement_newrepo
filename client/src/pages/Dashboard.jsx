import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Chart, Loading, UserInfo } from "../components";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from '../redux/slices/authSlice';

const Card = ({ label, count, bg, icon }) => {
  return (
    <div className='w-full h-auto min-h-[120px] bg-white dark:bg-gray-800 p-4 md:p-5 shadow-sm rounded-xl flex items-center justify-between transition-all duration-300 hover:shadow-md border border-gray-100 dark:border-gray-700'>
      <div className='h-full flex flex-1 flex-col justify-between gap-2'>
        <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium'>{label}</p>
        <span className='text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200'>{count}</span>
        <span className='text-xs md:text-sm text-gray-400 dark:text-gray-500'>Last month</span>
      </div>
      <div
        className={clsx(
          "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm",
          bg
        )}
      >
        {icon}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data, isLoading } = useGetDashboardStatsQuery({ page, search: debouncedSearch });
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for token in URL (from Google OAuth)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Remove token from URL
      window.history.replaceState({}, document.title, '/dashboard');
      
      // Fetch user data using the token
      fetchUserData(token);
    }
  }, [location]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:8800/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch(setCredentials(data.user));
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const totals = data?.tasksByStage || [];

  if (isLoading)
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );

  // Filter tasks based on user role
  const filteredTasks = data?.tasks || [];

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: data?.totalTask || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: data?.tasksByStage?.["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: data?.tasksByStage?.["in progress"] || 0,
      icon: <LuClipboardList />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: data?.tasksByStage?.["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className='h-full py-4 px-2 md:px-4 lg:px-6'>
      <>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
          {stats?.map(({ icon, bg, label, total }, index) => (
            <Card key={index} icon={icon} bg={bg} label={label} count={total} />
          ))}
        </div>

        {user?.isAdmin && data?.graphData && (
          <div className='w-full bg-white dark:bg-gray-800 my-8 md:my-12 lg:my-16 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <h4 className='text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-bold mb-4 md:mb-6'>
              Chart by Priority
            </h4>
            <Chart data={data?.graphData} />
          </div>
        )}

        <div className='w-full bg-white dark:bg-gray-800 my-8 md:my-12 lg:my-16 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h4 className='text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-bold'>Recent Tasks</h4>
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <TaskTable tasks={filteredTasks} />
          
          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      page === pageNum
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {data && user?.isAdmin && (
          <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
            <h4 className='text-xl text-gray-500 font-bold mb-4'>Recent Users</h4>
            <UserTable users={data?.users} />
          </div>
        )}
      </>
    </div>
  );
};

const UserTable = ({ users }) => {
  return (
    <div className="w-full bg-white dark:bg-[#1f1f1f] px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
      <table className='w-full'>
        <thead className='border-b border-gray-300 dark:border-gray-600'>
          <tr className='text-black dark:text-white text-left'>
            <th className='py-2'>Name</th>
            <th className='py-2'>Title</th>
            <th className='py-2'>Role</th>
            <th className='py-2'>Status</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, id) => (
            <tr key={user?._id + id} className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
              <td className='py-2'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
                    <span className='text-xs md:text-sm text-center'>
                      {getInitials(user.name)}
                    </span>
                  </div>
                  {user.name}
                </div>
              </td>
              <td className='py-2'>{user.title}</td>
              <td className='py-2'>{user.role}</td>
              <td className='py-2'>
                <span className={clsx(
                  "px-2 py-1 rounded-full text-sm transition-colors duration-200",
                  user.isActive 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                )}>
                  {user.isActive ? "Active" : "Disabled"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const ROLE_BADGES = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    developer: "bg-green-100 text-green-800",
    designer: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800"
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Team</th>
        <th className='py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2'>
        <Link to={`/task/${task._id}`} className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className='text-base text-black dark:text-gray-400'>
            {task?.title}
          </p>
        </Link>
      </td>
      <td className='py-2'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize'>{task?.priority}</span>
        </div>
      </td>

      <td className='py-2'>
        <div className='flex flex-col gap-2'>
          {task?.team?.map((member, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={clsx(
                  "w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700",
                  BGS[index % BGS?.length]
                )}
              >
                <span className="text-xs md:text-sm text-center">{getInitials(member.name)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{member.name}</span>
                <span className={clsx(
                  "text-xs px-2 py-0.5 rounded-full capitalize",
                  ROLE_BADGES[member.role?.toLowerCase()] || ROLE_BADGES.default
                )}>
                  {member.role || "Member"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </td>

      <td className='py-2 hidden md:block'>
        <span className='text-base text-gray-600'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  if (!tasks || !Array.isArray(tasks)) {
    return (
      <div className="w-full bg-white dark:bg-[#1f1f1f] px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
        <p className="text-center text-gray-500">No tasks available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#1f1f1f] px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
      <table className='w-full'>
        <TableHeader />
        <tbody>
          {tasks.map((task, id) => (
            <TableRow key={task?._id + id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;