import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { API_BASE_URL } from "../../lib/constants";

export interface FeedbackFormData {
  message: string;
  email: string;
  name: string;
}

export const feedbackApi = createApi({
  reducerPath: "feedback",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    submitFeedback: builder.mutation({
      query: (feedback: FeedbackFormData) => ({
        url: "/feedback",
        method: "POST",
        body: feedback,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = feedbackApi;
