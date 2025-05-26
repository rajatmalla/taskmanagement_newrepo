import clsx from "clsx";
import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { useTrashTaskMutation, useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice.js";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils/index.js";
import { useSelector } from "react-redux";

import { Button, ConfirmatioDialog, UserInfo } from "./index";
import { AddTask, TaskAssets, TaskColor } from "./tasks";
import { Link } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [deleteTask] = useTrashTaskMutation();
  const { refetch } = useGetAllTaskQuery({ strQuery: "", isTrashed: "", search: "" });

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask(selected).unwrap();

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

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300 dark:border-gray-600'>
      <tr className='w-full text-black dark:text-white  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2 line-clamp-1'>Created At</th>
        <th className='py-2'>Assets</th>
        <th className='py-2'>Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2'>
        <Link to={`/task/${task._id}`}>
          <div className='flex items-center gap-2'>
            <TaskColor className={TASK_TYPE[task.stage]} />
            <p className='w-full line-clamp-2 text-base text-black'>
              {task?.title}
            </p>
          </div>
        </Link>
      </td>

      <td className='py-2'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize line-clamp-1'>
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className='py-2'>
        <span className='text-sm text-gray-600'>
          {formatDate(new Date(task?.date))}
        </span>
      </td>

      <td className='py-2'>
        <TaskAssets
          activities={task?.activities?.length}
          subTasks={task?.subTasks}
          assets={task?.assets?.length}
        />
      </td>

      <td className='py-2'>
        <div className='flex'>
          {task?.team?.map((m, index) => (
            <UserInfo user={m} key={m._id ? `${m._id}-${index}` : index} />
          ))}
        </div>
      </td>

      {user?.isAdmin && (
      <td className='py-2 flex gap-2 md:gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
          label='Edit'
          type='button'
          onClick={() => editClickHandler(task)}
        />

        <Button
          className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
          label='Delete'
          type='button'
          onClick={() => deleteClicks(task._id)}
        />
      </td>
      )}
    </tr>
  );

  return (
    <>
      <div className='bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={task._id || index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {user?.isAdmin && (
        <>
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
        </>
      )}
    </>
  );
};

export default Table;