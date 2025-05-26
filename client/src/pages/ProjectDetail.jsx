import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectsQuery, useUpdateProjectMutation } from '../redux/slices/api/taskApiSlice';
import { Button, Loading, Title } from '../components';
import { useSelector } from 'react-redux';
import AddTeamMemberModal from "../components/tasks/AddTeamMemberModal";
import { FiLink } from "react-icons/fi";
import { toast } from "sonner";

// Helper to get initials from a name
function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery();
  const project = projects?.find((p) => p._id === id);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [updateProject] = useUpdateProjectMutation();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    if (project?.team) {
      setTeam(project.team);
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className='py-10 text-center'>
        <p className='text-red-500'>
          {error?.data?.message || error?.error || 'Project not found.'}
        </p>
        <Button label='Back to Projects' onClick={() => navigate('/projects')} />
      </div>
    );
  }

  return (
    <div className='w-full flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-gray-900'>
      <div className='w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mt-12 mb-12'>
        <div className="flex justify-between items-center mb-6">
          <Button label='← Back' className='mb-0' onClick={() => navigate('/projects')} />
          <button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:underline focus:outline-none"
            onClick={() => {
              const url = `${window.location.origin}/projects/${id}`;
              navigator.clipboard.writeText(url);
              toast.success("Invite link copied!");
            }}
          >
            <FiLink className="text-lg" />
            Copy Invite Link
          </button>
        </div>
        <Title title={project.name} />
        <p className='text-gray-600 dark:text-gray-300 mt-2 mb-8 text-lg'>{project.description}</p>
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='font-semibold text-xl'>Team Members</h3>
            {user?.isAdmin && (
              <Button
                label='+ Add Team Member'
                className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm'
                onClick={() => setShowAddTeamModal(true)}
              />
            )}
          </div>
          <div className="flex flex-col gap-3">
            {project.team?.length > 0 ? (
              project.team.map((member) => (
                <div key={member._id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold bg-blue-600">
                    {getInitials(member.name)}
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    {member.name}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-400">No team members yet.</span>
            )}
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='font-semibold text-xl'>Tasks</h3>
            {user?.isAdmin && (
              <Button label='+ Add Task' className='bg-green-600 text-white px-4 py-2 rounded-md text-sm' onClick={() => {/* open add task modal */}} />
            )}
          </div>
          <ul className='list-disc pl-6 text-base'>
            {project.tasks?.length > 0 ? project.tasks.map((task) => (
              <li key={task._id}>{task.title}</li>
            )) : <li>No tasks.</li>}
          </ul>
        </div>
        <AddTeamMemberModal
          open={showAddTeamModal}
          setOpen={setShowAddTeamModal}
          onAdd={async ({ users }) => {
            if (!users || users.length === 0) return;
            console.log('Selected user IDs:', users);
            const allUserIds = users;
            console.log('User IDs sent to backend:', allUserIds);
            await updateProject({ projectId: project._id, data: { team: allUserIds } }).unwrap();
            await refetch();
            toast.success('Team members added!');
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail; 