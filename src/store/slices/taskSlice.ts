import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { API_BASE_URL } from "../../lib/constants";
import { Task } from "../../types/Task";
import { listsApi } from "./listSlice";

export interface UpdateReorderTask {
  fieldToUpdate: "listViewOrder" | "timeViewOrder";
  id: number;
  newOrder: number;
}

export const tasksApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Tasks", "CompletedTasks"],
  endpoints: (builder) => ({
    createTask: builder.mutation<
      Task,
      { taskName: string; listId: number; dueDate?: string }
    >({
      query: ({ taskName, listId, dueDate }) => ({
        url: "/tasks",
        method: "POST",
        body: {
          taskName,
          listId,
          dueDate,
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
      query: ({ id, taskName, dueDate, isCompleted }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: {
          taskName,
          dueDate,
          isCompleted,
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
      invalidatesTags: ["Tasks"],
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
      { success: boolean },
      { tasksToUpdate: UpdateReorderTask[] }
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
    completedTasks: builder.query<Task[], void>({
      query: () => ({
        url: "/tasks/completed",
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: ["CompletedTasks"],
    }),
    deleteCompletedTasks: builder.mutation<void, void>({
      query: () => ({
        url: "/tasks/completed",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["CompletedTasks"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useReorderTaskMutation,
  useCompletedTasksQuery,
  useDeleteCompletedTasksMutation,
} = tasksApi;
