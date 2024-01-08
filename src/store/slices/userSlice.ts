import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginArgs {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginArgs>({
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    signup: builder.mutation<LoginResponse, LoginArgs>({
      query: ({ email, password }) => ({
        url: "/users/createUser",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useSignupMutation } = userApi;
