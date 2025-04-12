import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { API_BASE_URL } from "../../lib/constants";
import { List } from "../../types/List";

export const listsApi = createApi({
  reducerPath: "list",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Lists"],
  endpoints: (builder) => ({
    lists: builder.query<List[], void>({
      query: () => ({
        url: `/lists?today=${new Date().toLocaleDateString()}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: ["Lists"],
    }),
    createList: builder.mutation<List, { listName: string }>({
      query: ({ listName }) => ({
        url: "/lists",
        method: "POST",
        body: {
          listName,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Lists"],
    }),
    updateList: builder.mutation<List, { id: string; listName: string }>({
      query: ({ id, listName }) => ({
        url: `/lists/${id}`,
        method: "PUT",
        body: {
          listName,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Lists"],
    }),
    deleteList: builder.mutation<List, { id: string }>({
      query: ({ id }) => ({
        url: `/lists/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Lists"],
    }),
    reorderLists: builder.mutation<List[], List[]>({
      query: (lists) => ({
        url: `/lists/reorder`,
        method: "PUT",
        body: {
          lists,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Lists"],
    }),
  }),
});

export const {
  useListsQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useReorderListsMutation,
} = listsApi;
