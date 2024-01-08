import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginArgs {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

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

export const { useLoginMutation, useSignupMutation } = userApi;
