// import { USERS_URL } from "../../../utils/contants";
// import { apiSlice } from "../apiSlice";

// const USER_URL = "/user";

// export const userApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     updateUser: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}/profile`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

//     getTeamLists: builder.query({
//       query: ({ search }) => ({
//         url: `${USERS_URL}/get-team?search=${search}`,
//         method: "GET",
//         credentials: "include",
//       }),
//     }),

//     getUserTaskStatus: builder.query({
//       query: () => ({
//         url: `${USERS_URL}/get-status`,
//         method: "GET",
//         credentials: "include",
//       }),
//     }),

//     getNotifications: builder.query({
//       query: () => ({
//         url: `${USERS_URL}/notifications`,
//         method: "GET",
//         credentials: "include",
//       }),
//     }),

//     deleteUser: builder.mutation({
//       query: (id) => ({
//         url: `${USERS_URL}/${id}`,
//         method: "DELETE",
//         credentials: "include",
//       }),
//     }),

//     userAction: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}/${data.id}`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

//     markNotiAsRead: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

//     changePassword: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}/change-password`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),
//   }),
// });

// export const {
//   useUpdateUserMutation,
//   useGetTeamListsQuery,
//   useDeleteUserMutation,
//   useUserActionMutation,
//   useChangePasswordMutation,
//   useGetNotificationsQuery,
//   useMarkNotiAsReadMutation,
//   useGetUserTaskStatusQuery,
// } = userApiSlice;


// import { USERS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getTeamLists: builder.query({
      query: ({ search }) => ({
        url: `${USER_URL}/get-team?search=${search}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USER_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USER_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/${data.id}`,
        method: "PUT",
        body: { isActive: data.isActive },
        credentials: "include",
      }),
    }),

    markNotiAsRead: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/read-noti`,
        method: "PUT",
        body: {
          isReadType: data.type || "one",
          id: data.id
        },
        credentials: "include",
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/notifications/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetTeamListsQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useGetUserTaskStatusQuery,
  useDeleteNotificationMutation,
} = userApiSlice;