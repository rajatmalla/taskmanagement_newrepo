import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
  getInitials,
  getGravatarUrl,
} from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='w-full h-fit bg-white dark:bg-[#1f1f1f] shadow-md p-4 rounded'>
        <div className='w-full flex justify-between items-center'>
          <div className='flex items-center gap-2'>
          <div
            className={clsx(
                "flex gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600" />
            <div className={clsx(
              "flex items-center text-sm font-medium",
              TASK_TYPE[task?.status?.toLowerCase()]
            )}>
              <span className='uppercase'>{task?.status}</span>
            </div>
          </div>
          {user?.isAdmin && <TaskDialog task={task} />}
        </div>

          <Link to={`/task/${task._id}`}>
            <div className='flex items-center gap-2'>
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h4 className='text- line-clamp-1 text-black dark:text-white'>
                {task?.title}
              </h4>
            </div>
          </Link>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-1 mb-2 mt-2">
          {task?.tags?.map((tag, idx) => (
            <div
              key={`${tag}-${idx}`}
              className="flex gap-1 items-center text-xs rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </div>
          ))}
        </div>

          <div className="mt-2">
            <span className='text-sm text-gray-600 dark:text-gray-400'>Start: {formatDate(new Date(task?.startDate))}</span>
            <div className="mt-1">
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-[#F4F5F7] text-[#253858] rounded-[3px] text-sm'>
                <svg fill="none" viewBox="0 0 16 16" role="presentation" className="w-4 h-4">
                  <path fill="currentColor" fillRule="evenodd" d="M4.5 2.5v2H6v-2h4v2h1.5v-2H13a.5.5 0 0 1 .5.5v3h-11V3a.5.5 0 0 1 .5-.5zm-2 5V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V7.5zm9-6.5H13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1.5V0H6v1h4V0h1.5z" clipRule="evenodd"></path>
                </svg>
                <span>Due: {formatDate(new Date(task?.dueDate))}</span>
              </span>
            </div>
          </div>

        <div className='w-full border-t border-gray-200 dark:border-gray-700 my-2' />

        {/* Assigned Users Section */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned to:</span>
          <div>
            {task?.team?.map((member, idx) => {
              const initials = getInitials(member?.name) || 'AB';
              const displayName = member?.name || 'Test User';
              return (
              <div
                  key={member._id ? `${member._id}-${idx}` : idx}
                  className="flex items-center gap-3 mb-2"
              >
                  <div
                    className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-600 to-blue-400 transition-transform duration-200 hover:scale-105",
                      BGS[idx % BGS.length]
                    )}
                    style={{
                      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {initials}
                  </div>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-200 tracking-tight">
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Assets */}
        {task?.assets?.length > 0 && (
          <div className="mt-2">
            <TaskAssets assets={task.assets} />
          </div>
        )}
      </div>

      {/* Admin-only controls */}
      {user?.isAdmin && (
        <>
          <AddSubTask open={open} setOpen={setOpen} id={task._id} />
        </>
      )}
    </>
  );
};

export default TaskCard;