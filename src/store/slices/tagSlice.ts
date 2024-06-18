import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { API_BASE_URL } from "../../lib/constants";
import { Tag } from "../../types/Tag";

export const tagsApi = createApi({
  reducerPath: "tag",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Tags"],
  endpoints: (builder) => ({
    tags: builder.query<Tag[], void>({
      query: () => ({
        url: "/tags",
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: ["Tags"],
    }),
    createTag: builder.mutation<Tag, Omit<Tag, "id">>({
      query: ({ tagName, tagColor }) => ({
        url: "/tags",
        method: "POST",
        body: {
          tagName,
          tagColor,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Tags"],
    }),
    updateTag: builder.mutation<Tag, Tag>({
      query: ({ id, tagName, tagColor }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: {
          tagName,
          tagColor,
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Tags"],
    }),
    deleteTag: builder.mutation<Tag, { id: string }>({
      query: ({ id }) => ({
        url: `/tags/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {
  useTagsQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
} = tagsApi;
