import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { API_BASE_URL } from "../../lib/constants";
import { Task } from "../../types/Task";
import { listsApi } from "./listSlice";

export interface UpdateReorderTask {
  id: number;
  newOrder: number;
  newDueDate?: string | null;
}

export interface StandupTasksResponse {
  yesterday: Task[];
  today: Task[];
  blocked: Task[];
}

export const tasksApi = createApi({
  reducerPath: "task",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [
    "Tasks",
    "CompletedTasks",
    "TodayTasks",
    "UpcomingTasks",
    "StandupTasks",
  ],
  endpoints: (builder) => ({
    createTask: builder.mutation<
      Task,
      { taskName: string; listId: number; dueDate?: string; tagIds?: number[] }
    >({
      query: ({ taskName, listId, dueDate, tagIds }) => ({
        url: "/tasks",
        method: "POST",
        body: {
          taskName,
          listId,
          dueDate,
          tagIds,
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
      invalidatesTags: ["TodayTasks", "UpcomingTasks"],
    }),
    updateTask: builder.mutation<Task, Task>({
      query: ({
        listId,
        id,
        taskName,
        dueDate,
        dateCompleted,
        isCompleted,
        tagIds,
      }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: {
          listId,
          taskName,
          dueDate,
          isCompleted,
          tagIds,
          dateCompleted,
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
      invalidatesTags: [
        "Tasks",
        "CompletedTasks",
        "TodayTasks",
        "UpcomingTasks",
        "StandupTasks",
      ],
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
      invalidatesTags: [
        "Tasks",
        "CompletedTasks",
        "TodayTasks",
        "UpcomingTasks",
      ],
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
    todayTasks: builder.query<Task[], void>({
      query: () => ({
        url: `/tasks/today?today=${new Date().toLocaleDateString()}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: ["TodayTasks"],
    }),
    upcomingTasks: builder.query<Task[], void>({
      query: () => ({
        url: `/tasks/upcoming?today=${new Date().toLocaleDateString()}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: ["UpcomingTasks"],
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
    standupTasks: builder.query<StandupTasksResponse, void>({
      query: () => ({
        url: `/tasks/standup?today=${new Date().toLocaleDateString()}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: ["StandupTasks"],
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
  useTodayTasksQuery,
  useUpcomingTasksQuery,
  useStandupTasksQuery,
} = tasksApi;
