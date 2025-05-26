import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Button, Loading, Title } from '../components';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../redux/slices/api/taskApiSlice';
import { useSelector } from 'react-redux';
import AddProject from '../components/projects/AddProject';
import EditProject from '../components/projects/EditProject';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();

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
        <p className='text-red-500'>
          {error?.data?.message || error?.error || 'Failed to load projects. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col md:flex-row items-center justify-between mb-4 gap-4'>
        <Title title="Projects" />

        {user?.isAdmin && (
          <Button
            label='Create Project'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects?.map((project) => (
          <div
            key={project._id}
            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300 relative cursor-pointer'
            onClick={() => navigate(`/projects/${project._id}`)}
          >
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
              {project.name}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              {project.description}
            </p>
            <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
              <span>{project.tasks?.length || 0} tasks</span>
              <span>{project.team?.length || 0} members</span>
            </div>
            {user?.isAdmin && (
              <div className='absolute top-3 right-3 flex gap-2' onClick={e => e.stopPropagation()}>
                <button
                  className='text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold shadow-sm'
                  onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setEditOpen(true); }}
                >
                  Edit
                </button>
                <button
                  className='text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold shadow-sm'
                  onClick={(e) => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this project?')) { deleteProject(project._id); refetch(); } }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddProject open={open} setOpen={setOpen} />
      {selectedProject && (
        <EditProject open={editOpen} setOpen={setEditOpen} project={selectedProject} />
      )}
    </div>
  );
};

export default Projects; 