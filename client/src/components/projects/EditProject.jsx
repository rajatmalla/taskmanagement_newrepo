import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ModalWrapper from '../ModalWrapper';
import Button from '../Button';
import { Dialog } from '@headlessui/react';
import { useUpdateProjectMutation } from '../../redux/slices/api/taskApiSlice';

const EditProject = ({ open, setOpen, project }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { name: project?.name, description: project?.description } });

  useEffect(() => {
    reset({ name: project?.name, description: project?.description });
  }, [project, reset]);

  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const onSubmit = async (data) => {
    try {
      await updateProject({ projectId: project._id, data }).unwrap();
      toast.success('Project updated successfully');
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update project');
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
        <Dialog.Title as='h3' className='font-semibold text-lg'>
          Edit Project
        </Dialog.Title>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Project Name
            </label>
            <input
              type='text'
              {...register('name', { required: 'Project name is required' })}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-500'>{errors.description.message}</p>
            )}
          </div>
          <div className='flex justify-end gap-4 mt-6'>
            <Button
              type='button'
              className='bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300'
              onClick={() => setOpen(false)}
              label='Cancel'
            />
            <Button
              type='submit'
              className='bg-blue-600 px-8 text-sm font-semibold text-white sm:w-auto'
              label={isLoading ? 'Saving...' : 'Save Changes'}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default EditProject; 