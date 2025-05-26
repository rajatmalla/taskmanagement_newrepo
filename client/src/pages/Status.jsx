import React from "react";
import { useGetUserTaskStatusQuery } from "../redux/slices/api/userApiSlice";
import { getInitials } from "../utils";
import { Loading, Title } from "../components";
import { useSelector } from "react-redux";

const StatusPage = () => {
  const { data, isLoading } = useGetUserTaskStatusQuery();
  const { user: currentUser } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Task Progress</th>
        <th className='py-2'>Task Numbers</th>
        <th className='py-2'>Total Task</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    const { taskStats } = user;
    const totalTasks = taskStats.total || 0;

    return (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
        <td className='p-2'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
              <span className='text-xs md:text-sm text-center'>
                {getInitials(user.name)}
              </span>
            </div>
            {user.name}
          </div>
        </td>
        <td className='p-2'>{user.title}</td>
        <td className='p-2'>
          <div className='flex items-center gap-2 text-white text-sm'>
            <p className='px-2 py-1 bg-blue-600 rounded'>
              {totalTasks > 0 ? ((taskStats.inProgress / totalTasks) * 100).toFixed(1) : 0}%
            </p>
            <p className='px-2 py-1 bg-amber-600 rounded'>
              {totalTasks > 0 ? ((taskStats.todo / totalTasks) * 100).toFixed(1) : 0}%
            </p>
            <p className='px-2 py-1 bg-emerald-600 rounded'>
              {totalTasks > 0 ? ((taskStats.completed / totalTasks) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </td>
        <td className='p-2 flex gap-3'>
          <span>{taskStats.inProgress}</span> {" | "}
          <span>{taskStats.todo}</span>
          {" | "}
          <span>{taskStats.completed}</span>
        </td>
        <td className='p-2'>
          <span>{totalTasks}</span>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title={currentUser?.isAdmin ? 'All Users Task Status' : 'My Task Status'} />
        </div>
        <div className='bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {currentUser?.isAdmin ? (
                  data?.users?.map((user, index) => (
                    <TableRow key={user._id || index} user={user} />
                  ))
                ) : (
                  data?.user && <TableRow user={data.user} />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusPage;