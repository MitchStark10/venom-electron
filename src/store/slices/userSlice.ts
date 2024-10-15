import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../lib/constants";
import { Settings } from "../../types/Settings";

interface LoginArgs {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
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
    settings: builder.query<Settings, void>({
      query: () => ({
        url: "/users/settings",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useSettingsQuery } =
  userApi;
