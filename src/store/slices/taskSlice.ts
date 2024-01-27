import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { Task } from "../../types/Task";
import { listsApi } from "./listSlice";

export const tasksApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    createTask: builder.mutation<Task, { taskName: string; listId: number }>({
      query: ({ taskName, listId }) => ({
        url: "/tasks",
        method: "POST",
        body: {
          taskName,
          listId,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      onQueryStarted: (_arg, api) => {
        api.queryFulfilled.then(() => {
          api.dispatch(listsApi.util.invalidateTags(["Lists"]));
        });
      },
    }),
    updateTask: builder.mutation<Task, Task>({
      query: ({ id, taskName }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: {
          taskName,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      onQueryStarted: (_arg, api) => {
        api.queryFulfilled.then(() => {
          api.dispatch(listsApi.util.invalidateTags(["Lists"]));
        });
      },
    }),
    deleteTask: builder.mutation<Task, { id: string }>({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      onQueryStarted: (_arg, api) => {
        api.queryFulfilled.then(() => {
          api.dispatch(listsApi.util.invalidateTags(["Lists"]));
        });
      },
    }),
    reorderTask: builder.mutation<
      Task,
      {
        fieldToUpdate: "listViewOrder" | "timeViewOrder";
        taskId: string;
        newOrder: number;
      }
    >({
      query: (reqBody) => ({
        url: "/tasks/reorder",
        method: "PUT",
        body: reqBody,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      onQueryStarted: (_arg, api) => {
        api.queryFulfilled.then(() => {
          api.dispatch(listsApi.util.invalidateTags(["Lists"]));
        });
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useReorderTaskMutation,
} = tasksApi;
