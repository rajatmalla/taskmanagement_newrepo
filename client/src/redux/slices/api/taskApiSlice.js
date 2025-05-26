// import { TASKS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

const TASK_URL = "/task";
const PROJECT_URL = "/project";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: ({ data }) => ({
        url: `${TASK_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    createSubTask: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `${TASK_URL}/create-subtask/${taskId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getTasks: builder.query({
      query: (projectId) => ({
        url: `${TASK_URL}/project-tasks/${projectId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getAllTask: builder.query({
      query: (params) => ({
        url: `${TASK_URL}`,
        method: "GET",
        params,
        credentials: "include",
      }),
    }),
    getTask: builder.query({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateTask: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `${TASK_URL}/${taskId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASK_URL}/delete-restore/${id}${actionType ? `?actionType=${actionType}` : ''}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    changeTaskStage: builder.mutation({
      query: ({ taskId, stage }) => ({
        url: `${TASK_URL}/change-stage/${taskId}`,
        method: "PUT",
        body: { stage },
        credentials: "include",
      }),
    }),
    duplicateTask: builder.mutation({
      query: (taskId) => ({
        url: `${TASK_URL}/duplicate/${taskId}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    trashTask: builder.mutation({
      query: (taskId) => ({
        url: `${TASK_URL}/${taskId}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    getDashboardStats: builder.query({
      query: (params) => ({
        url: `${TASK_URL}/dashboard`,
        method: "GET",
        params,
        credentials: "include",
      }),
    }),
    changeSubTaskStatus: builder.mutation({
      query: ({ taskId, subTaskId, status }) => ({
        url: `${TASK_URL}/change-status/${taskId}/${subTaskId}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
    }),
    postTaskActivity: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `${TASK_URL}/activity/${taskId}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getProjects: builder.query({
      query: () => ({
        url: `${PROJECT_URL}/all`,
        method: "GET",
        credentials: "include",
      }),
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECT_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    updateProject: builder.mutation({
      query: ({ projectId, data }) => ({
        url: `${PROJECT_URL}/${projectId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${PROJECT_URL}/${projectId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useCreateSubTaskMutation,
  useGetTasksQuery,
  useGetAllTaskQuery,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteRestoreTaskMutation,
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTaskMutation,
  useGetDashboardStatsQuery,
  useChangeSubTaskStatusMutation,
  usePostTaskActivityMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = taskApiSlice;