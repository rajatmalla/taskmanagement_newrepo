import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";
// import { useParams } from "react-router-dom";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetAllTaskQuery,
  useDeleteRestoreTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
// import { app } from "../../utils/firebase";
import app from '/src/utils/firebase.js';

import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "LOW"];

const uploadedFileURLs = [];

const uploadFile = async (file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

const AddTask = ({ open, setOpen, task, projectId }) => {
  // const { projectId } = useParams();
  const defaultValues = {
    title: task?.title || "",
    startDate: task?.startDate ? dateFormatter(new Date(task.startDate)) : dateFormatter(new Date()),
    dueDate: task?.dueDate ? dateFormatter(new Date(task.dueDate)) : dateFormatter(new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(task?.stage ? task.stage.toUpperCase() : LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [priority, setPriority] = useState(
    task?.priority ? task.priority.toUpperCase() : PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const { refetch } = useGetAllTaskQuery({ strQuery: "", isTrashed: "", search: "" });
  const URLS = task?.assets ? [...task.assets] : [];

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        startDate: dateFormatter(new Date(task.startDate)),
        dueDate: dateFormatter(new Date(task.dueDate)),
        team: task.team,
        stage: task.stage,
        priority: task.priority,
        assets: task.assets,
        description: task.description,
      });
      setStage(task.stage ? task.stage.toUpperCase() : LISTS[0]);
      setTeam(task.team || []);
      setPriority(task.priority ? task.priority.toUpperCase() : PRIORIRY[2]);
    }
  }, [task, reset]);

  const handleOnSubmit = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const newData = {
        title: data.title,
        startDate: new Date(data.startDate).toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        priority: priority.toLowerCase(),
        stage: stage.toLowerCase(),
        team: team.map((member) => member._id || member),
        description: data.description,
        assets: [...URLS, ...uploadedFileURLs],
        // add other fields if needed
      };

      const res = task?._id
        ? await updateTask({ taskId: task._id, data: newData }).unwrap()
        : await createTask({ data: newData }).unwrap();

      toast.success(res.message);
      // Refresh the task list
      await refetch();
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Assign Team Members</label>
              <UserList setTeam={setTeam} team={team} />
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            <div className="flex gap-4">
              <Textbox
                placeholder='Start Date'
                type='date'
                name='startDate'
                label='Start Date'
                className='w-full rounded'
                register={register("startDate", {
                  required: "Start date is required!",
                })}
                error={errors.startDate ? errors.startDate.message : ""}
              />
              <Textbox
                placeholder='Due Date'
                type='date'
                name='dueDate'
                label='Due Date'
                className='w-full rounded'
                register={register("dueDate", {
                  required: "Due date is required!",
                })}
                error={errors.dueDate ? errors.dueDate.message : ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                {...register("description")}
                className="w-full rounded border border-gray-300 p-2"
                rows={3}
                placeholder="Enter task description..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleSelect}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
          </div>

          <div className='mt-4 flex items-center gap-3'>
            <Button
              type='submit'
              label={uploading ? "Uploading..." : task ? "Update" : "Create"}
              className='bg-blue-600 text-white rounded-md py-2'
              disabled={isLoading || isUpdating || uploading}
            />
            <Button
              type='button'
              label='Cancel'
              className='bg-gray-200 text-gray-700 rounded-md py-2'
              onClick={() => setOpen(false)}
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;