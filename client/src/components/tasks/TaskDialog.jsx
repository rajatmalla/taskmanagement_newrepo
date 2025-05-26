import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit, MdDelete } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmatioDialog from "../Dialogs";
import AddSubTask from "./AddSubTask";
import AddTask from "./AddTask";
import TaskColor from "./TaskColor";
import { useSelector } from "react-redux";
import { useGetAllTaskQuery } from "../../redux/slices/api/taskApiSlice";

const CustomTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter='transition ease-out duration-100'
    enterFrom='transform opacity-0 scale-95'
    enterTo='transform opacity-100 scale-100'
    leave='transition ease-in duration-75'
    leaveFrom='transform opacity-100 scale-100'
    leaveTo='transform opacity-0 scale-95'
  >
    {children}
  </Transition>
);

const ChangeTaskActions = ({ _id, stage }) => {
  const [changeStage] = useChangeTaskStageMutation();

  const changeHanlder = async (val) => {
    try {
      const data = {
        id: _id,
        stage: val,
      };
      const res = await changeStage(data).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const items = [
    {
      label: "To-Do",
      stage: "todo",
      icon: <TaskColor className='bg-blue-600' />,
      onClick: () => changeHanlder("todo"),
    },
    {
      label: "In Progress",
      stage: "in progress",
      icon: <TaskColor className='bg-yellow-600' />,
      onClick: () => changeHanlder("in progress"),
    },
    {
      label: "Completed",
      stage: "completed",
      icon: <TaskColor className='bg-green-600' />,
      onClick: () => changeHanlder("completed"),
    },
  ];

  return (
    <>
      <Menu as='div' className='relative inline-block text-left'>
        <Menu.Button
          className={clsx(
            "inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
          )}
        >
          <FaExchangeAlt />
          <span>Change Task</span>
        </Menu.Button>

        <CustomTransition>
          <Menu.Items className='absolute p-4 left-0 mt-2 w-40 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
            <div className='px-1 py-1 space-y-2'>
              {items.map((el) => (
                <Menu.Item key={`${el.label}-${el.stage}`} disabled={stage === el.stage}>
                  {({ active }) => (
                    <button
                      disabled={stage === el.stage}
                      onClick={el?.onClick}
                      className={clsx(
                        active ? "bg-gray-200 text-gray-900" : "text-gray-900",
                        "group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50"
                      )}
                    >
                      {el.icon}
                      {el.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </CustomTransition>
      </Menu>
    </>
  );
};

export default function TaskDialog({ task }) {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();
  const { refetch } = useGetAllTaskQuery({ strQuery: "", isTrashed: "", search: "" });

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask(task._id).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const duplicateHanlder = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    ...(user?.isAdmin ? [
      {
        label: "Edit",
        icon: <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />,
        onClick: () => setOpenEdit(true),
      },
      {
        label: "Add Sub-Task",
        icon: <MdAdd className='mr-2 h-5 w-5' aria-hidden='true' />,
        onClick: () => setOpen(true),
      },
      {
        label: "Duplicate",
        icon: <HiDuplicate className='mr-2 h-5 w-5' aria-hidden='true' />,
        onClick: () => duplicateHanlder(),
      },
      {
        label: "Delete",
        icon: <MdDelete className='mr-2 h-5 w-5' aria-hidden='true' />,
        onClick: () => deleteClicks(),
      },
    ] : []),
  ];

  return (
    <>
      <Menu as='div' className='relative'>
        <Menu.Button className='inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
          <BsThreeDots className='h-5 w-5 text-gray-600 dark:text-gray-400' />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-[#1f1f1f] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1'>
              {items.map((item) => (
                <Menu.Item key={item.label}>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      className={`${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-900 dark:text-gray-300'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
}