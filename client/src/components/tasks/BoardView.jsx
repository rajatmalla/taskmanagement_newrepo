import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
      {tasks?.map((task, idx) => (
        <TaskCard task={task} key={task._id || idx} />
      ))}
    </div>
  );
};

export default BoardView;