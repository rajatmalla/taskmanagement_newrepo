import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { useSelector } from "react-redux";
import { useDebounce } from "../hooks/useDebounce";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-400",
  completed: "bg-green-600",
}

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  
  const status = params?.status || "";
  const projectId = params?.projectId;

  const { data, isLoading, error, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: debouncedSearchTerm,
  });

  useEffect(() => {
    refetch();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [open]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <div className='py-10 text-center'>
        <p className='text-red-500'>
          {error?.data?.message || error?.error || 'Failed to load tasks. Please try again.'}
        </p>
      </div>
    );
  }

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex flex-col md:flex-row items-center justify-between mb-4 gap-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {!status && user?.isAdmin && (
            <Button
              label='Create Task'
              icon={<IoMdAdd className='text-lg' />}
              className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {selected !== 1 ? (
            <BoardView tasks={data?.data} />
          ) : (
            <Table tasks={data?.data} />
          )}
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} projectId={projectId} />
    </div>
  );
};

export default Tasks;