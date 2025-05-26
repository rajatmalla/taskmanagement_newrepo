import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useChangeSubTaskStatusMutation,
  useGetTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  getCompletedSubTasks,
  getInitials,
} from "../utils";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activities, taskId }) => {
  const [activity, setActivity] = useState("");
  const [type, setType] = useState("commented");
  const [postActivity] = usePostTaskActivityMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.trim()) return;

    try {
      const result = await postActivity({
        id: taskId,
        data: {
          type,
          activity: activity.trim()
        }
      }).unwrap();

      if (result) {
        setActivity("");
        setType("commented");
        toast.success("Activity posted successfully");
      }
    } catch (error) {
      console.error("Failed to post activity:", error);
      toast.error(error?.data?.message || "Failed to post activity");
    }
  };

    return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Activities</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4 mb-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="commented">Comment</option>
            <option value="started">Started</option>
            <option value="in progress">In Progress</option>
            <option value="bug">Bug</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Add an activity..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {activity.by?.name || "Unknown User"}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleString()}
                </span>
      </div>
              <p className="text-gray-700">{activity.activity}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full mt-2">
                {activity.type}
              </span>
            </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  
  // Validate task ID format
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const { data, isLoading, error, refetch } = useGetTaskQuery(id, {
    skip: !isValidObjectId(id)
  });
  console.log('Task detail API response:', data);
  
  const [subTaskAction, { isLoading: isSubmitting }] =
    useChangeSubTaskStatusMutation();

  const [selected, setSelected] = useState(0);
  // Support multiple possible response shapes
  const task = data?.task || data?.data || data;

  if (!isValidObjectId(id)) {
    return (
      <div className='py-10 text-center'>
        <p className='text-red-500'>Invalid task ID format</p>
      </div>
    );
  }

  const handleSubmitAction = async (el) => {
    try {
      const data = {
        id: el.id,
        subId: el.subId,
        status: !el.status,
      };
      const res = await subTaskAction({
        ...data,
      }).unwrap();

      toast.success(res?.message);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return (
    <div className='py-10'>
      <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-10 text-center'>
        <p className='text-red-500'>Error loading task: {error?.data?.message || error.message}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className='py-10 text-center'>
        <p className='text-gray-500'>Task not found</p>
      </div>
    );
  }

  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      {/* task detail */}
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto'>
              <div className='w-full md:w-1/2 space-y-8'>
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[task?.priority]}</span>
                    <span className='uppercase'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={TASK_TYPE[task?.stage]} />
                    <span className='text-black uppercase'>{task?.stage}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <p className='text-gray-500'>
                    Created At: {new Date(task?.createdAt).toLocaleString()}
                  </p>
                  <p className='text-gray-500'>
                    Start Date: {new Date(task?.startDate).toLocaleString()}
                  </p>
                <p className='text-gray-500'>
                    Due Date: {new Date(task?.dueDate).toLocaleString()}
                  </p>
                </div>

                {task?.description && (
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-700'>Description</h3>
                    <p className='text-gray-600 whitespace-pre-wrap'>{task.description}</p>
                  </div>
                )}

                {task?.createdBy && (
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-700'>Created By</h3>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center'>
                        <span>{getInitials(task.createdBy.name)}</span>
                      </div>
                      <div>
                        <p className='font-medium'>{task.createdBy.name}</p>
                        <p className='text-sm text-gray-500'>{task.createdBy.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Assets :</span>
                    <span>{task?.assets?.length || 0}</span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Sub-Tasks :</span>
                    <span>{task?.subTasks?.length || 0}</span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Team Members :</span>
                    <span>{task?.team?.length || 0}</span>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <h3 className='text-lg font-semibold text-gray-700'>Team Members</h3>
                  <div className='space-y-3'>
                    {task?.team?.map((member, index) => (
                      <div
                        key={index + member?._id}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                        <div className='w-10 h-10 rounded-full text-white flex items-center justify-center text-sm bg-blue-600'>
                          <span>{getInitials(member?.name)}</span>
                        </div>
                        <div>
                          <p className='text-lg font-semibold'>{member?.name}</p>
                          <span className='text-gray-500'>{member?.title}</span>
                          {member?.email && (
                            <p className='text-sm text-gray-500'>{member.email}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {task?.subTasks?.length > 0 && (
                  <div className='space-y-4 py-6'>
                    <div className='flex items-center gap-5'>
                      <p className='text-gray-500 font-semibold text-sm'>
                        SUB-TASKS
                      </p>
                      <div
                        className={`w-fit h-8 px-2 rounded-full flex items-center justify-center text-white ${
                          percentageCompleted < 50
                            ? "bg-rose-600"
                            : percentageCompleted < 80
                            ? "bg-amber-600"
                            : "bg-emerald-600"
                        }`}
                      >
                        <p>{percentageCompleted.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className='space-y-8'>
                      {task?.subTasks?.map((el, index) => (
                        <div key={index + el?._id} className='flex gap-3'>
                          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-200'>
                            <MdTaskAlt className='text-violet-600' size={26} />
                          </div>

                          <div className='space-y-1'>
                            <div className='flex gap-2 items-center'>
                              <span className='text-sm text-gray-500'>
                                {new Date(el?.date).toDateString()}
                              </span>

                              <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold lowercase'>
                                {el?.tag}
                              </span>

                              <span
                                className={`px-2 py-0.5 text-center text-sm rounded-full font-semibold ${
                                  el?.isCompleted
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-50 text-amber-600"
                                }`}
                              >
                                {el?.isCompleted ? "done" : "in progress"}
                              </span>
                            </div>
                            <p className='text-gray-700 pb-2'>{el?.title}</p>

                            <>
                              <button
                                disabled={isSubmitting}
                                className={`text-sm outline-none bg-gray-100 text-gray-800 p-1 rounded ${
                                  el?.isCompleted
                                    ? "hover:bg-rose-100 hover:text-rose-800"
                                    : "hover:bg-emerald-100 hover:text-emerald-800"
                                } disabled:cursor-not-allowed`}
                                onClick={() =>
                                  handleSubmitAction({
                                    status: el?.isCompleted,
                                    id: task?._id,
                                    subId: el?._id,
                                  })
                                }
                              >
                                {isSubmitting ? (
                                  <FaSpinner className='animate-spin' />
                                ) : el?.isCompleted ? (
                                  " Mark as Undone"
                                ) : (
                                  " Mark as Done"
                                )}
                              </button>
                            </>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='w-full md:w-1/2'>
                <Activities activities={task?.activities} taskId={task?._id} />
              </div>
            </div>
          </>
        ) : (
          <Activities activities={task?.activities} taskId={task?._id} />
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;